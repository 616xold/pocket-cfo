import { execFileSync } from "node:child_process"
import {
  createWebhookSignature,
  expectOkJson,
  loadNearestEnvFile,
  parseArgs,
  stripTrailingSlash,
  wait,
} from "./m2-exit-utils.mjs"
import {
  buildInstallationHeaders,
  createInstallationAccessToken,
  encodeRepoPath,
  parseGitHubResponse,
  requireEnv,
} from "./github-app-tooling.mjs"

const DEFAULT_CONTROL_PLANE_URL = "http://localhost:4000"
const DEFAULT_WEB_URL = "http://localhost:3000"
const DEFAULT_LIVE_TIMEOUT_MS = 120_000
const DEFAULT_POLL_INTERVAL_MS = 3_000
const LOCAL_MODE = "local_signed_ingress_replay"
const LIVE_MODE = "live_github_hosted_issue"
const USER_AGENT = "pocket-cto-github-issue-intake-smoke"

async function main() {
  loadNearestEnvFile()

  const options = parseArgs(process.argv.slice(2).filter((entry) => entry !== "--"))
  const mode = normalizeMode(options.mode ?? LOCAL_MODE)
  const controlPlaneUrl = stripTrailingSlash(
    options.controlPlaneUrl ??
      process.env.NEXT_PUBLIC_CONTROL_PLANE_URL ??
      process.env.CONTROL_PLANE_URL ??
      DEFAULT_CONTROL_PLANE_URL,
  )
  const webUrl = stripTrailingSlash(
    options.webUrl ?? process.env.PUBLIC_APP_URL ?? DEFAULT_WEB_URL,
  )

  await expectOkJson(`${controlPlaneUrl}/health`, "control-plane health check")

  const repositoryContext = await resolveRepositoryContext({
    controlPlaneUrl,
    requestedFullName: options.repoFullName,
  })

  const result =
    mode === LIVE_MODE
      ? await runLiveGitHubIssueSmoke({
          controlPlaneUrl,
          pollIntervalMs: readPositiveInteger(
            options.pollIntervalMs ?? String(DEFAULT_POLL_INTERVAL_MS),
            "--poll-interval-ms",
          ),
          repositoryContext,
          timeoutMs: readPositiveInteger(
            options.timeoutMs ?? String(DEFAULT_LIVE_TIMEOUT_MS),
            "--timeout-ms",
          ),
        })
      : await runLocalSignedIngressReplay({
          controlPlaneUrl,
          repositoryContext,
          title: options.title,
          body: options.body,
          deliveryId: options.deliveryId,
          issueId: options.issueId,
          issueNumber: options.issueNumber,
          senderLogin: options.senderLogin,
          webhookSecret: options.webhookSecret ?? process.env.GITHUB_WEBHOOK_SECRET,
          webUrl,
        })

  console.log(JSON.stringify(result, null, 2))
}

async function runLocalSignedIngressReplay(input) {
  if (!input.webhookSecret) {
    throw new Error(
      "GITHUB_WEBHOOK_SECRET is required. Set it in .env or pass --webhook-secret.",
    )
  }

  const now = new Date()
  const timeTag = now.toISOString().replace(/[-:.TZ]/gu, "")
  const issueNumber = readPositiveInteger(
    input.issueNumber ?? String(Number(timeTag.slice(-6)) || 1),
    "--issue-number",
  )
  const issueId = input.issueId ?? `${Date.now()}`
  const deliveryId = input.deliveryId ?? `local-issue-intake-smoke-${timeTag}`
  const title =
    input.title ?? `Local signed issue intake smoke ${now.toISOString()}`
  const body =
    input.body ??
    [
      "This is a truthful local signed ingress replay for the M2.7 issue-intake smoke.",
      "It exercises the existing /github/webhooks route without claiming to be a live GitHub-hosted delivery.",
      "Expected proof: issue intake list, idempotent create-mission, mission list presence, and mission detail page load.",
    ].join("\n\n")
  const senderLogin = input.senderLogin ?? "local-issue-intake-smoke"
  const issueUrl = `https://github.com/${input.repositoryContext.fullName}/issues/${issueNumber}`
  const payload = buildIssuePayload({
    body,
    githubRepositoryId: input.repositoryContext.githubRepositoryId,
    installationId: input.repositoryContext.installationId,
    issueId,
    issueNumber,
    issueUrl,
    language: input.repositoryContext.language,
    repoFullName: input.repositoryContext.fullName,
    title,
    visibility: input.repositoryContext.visibility,
    senderLogin,
  })
  const rawBody = JSON.stringify(payload)
  const ingressResponse = await requestJson(
    `${input.controlPlaneUrl}/github/webhooks`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-github-delivery": deliveryId,
        "x-github-event": "issues",
        "x-hub-signature-256": createWebhookSignature(input.webhookSecret, rawBody),
      },
      body: rawBody,
    },
  )

  assert(
    ingressResponse.status === 202,
    `Expected first webhook ingest to return 202, received ${ingressResponse.status}`,
  )
  assert(
    ingressResponse.json?.handledAs === "issue_envelope_recorded",
    "Webhook ingress did not persist the issue envelope as issue_envelope_recorded",
  )

  const verified = await verifyIssueIntakeFlow({
    controlPlaneUrl: input.controlPlaneUrl,
    deliveryId,
    issueNumber,
    issueTitle: title,
    issueUrl,
    repoFullName: input.repositoryContext.fullName,
    requireMissionPage: true,
    webUrl: input.webUrl,
  })

  return {
    mode: LOCAL_MODE,
    controlPlaneUrl: input.controlPlaneUrl,
    webUrl: input.webUrl,
    deliveryId,
    issueId,
    issueNumber,
    repoFullName: input.repositoryContext.fullName,
    missionId: verified.missionId,
    issueSourceRef: issueUrl,
    ingress: {
      handledAs: ingressResponse.json?.handledAs ?? null,
      status: ingressResponse.status,
    },
    createMission: {
      firstOutcome: verified.firstCreate.json?.outcome ?? null,
      secondOutcome: verified.secondCreate.json?.outcome ?? null,
    },
    cleanup: {
      attempted: false,
      result: "not_applicable",
    },
  }
}

async function runLiveGitHubIssueSmoke(input) {
  const installationId = requireRepositoryInstallationId(input.repositoryContext)
  const appId = requireEnv("GITHUB_APP_ID")
  const privateKeyBase64 = requireEnv("GITHUB_APP_PRIVATE_KEY_BASE64")
  const tokenResponse = await createInstallationAccessToken({
    appId,
    installationId,
    privateKeyBase64,
    userAgent: USER_AGENT,
  })
  const issuePermission = tokenResponse.permissions?.issues ?? null

  if (issuePermission !== "write") {
    throw new Error(
      `GitHub App installation ${installationId} for ${input.repositoryContext.fullName} is missing issues:write permission. Reported issues permission: ${issuePermission ?? "none"}. Full permissions: ${JSON.stringify(tokenResponse.permissions ?? {})}`,
    )
  }

  const token = tokenResponse.token
  const createdIssue = await createGitHubIssue({
    repoFullName: input.repositoryContext.fullName,
    token,
  })
  let cleanup = {
    attempted: false,
    issueState: createdIssue.state,
    result: "not_attempted",
  }

  try {
    const delivery = await waitForPersistedIssueDelivery({
      controlPlaneUrl: input.controlPlaneUrl,
      installationId,
      issueNumber: createdIssue.number,
      pollIntervalMs: input.pollIntervalMs,
      repoFullName: input.repositoryContext.fullName,
      timeoutMs: input.timeoutMs,
    })

    const verified = await verifyIssueIntakeFlow({
      controlPlaneUrl: input.controlPlaneUrl,
      deliveryId: delivery.deliveryId,
      issueNumber: createdIssue.number,
      issueTitle: createdIssue.title,
      issueUrl: createdIssue.html_url,
      repoFullName: input.repositoryContext.fullName,
    })

    cleanup = await closeGitHubIssue({
      issueNumber: createdIssue.number,
      repoFullName: input.repositoryContext.fullName,
      token,
    })

    return {
      mode: LIVE_MODE,
      cleanup,
      controlPlaneUrl: input.controlPlaneUrl,
      deliveryId: delivery.deliveryId,
      issueNumber: createdIssue.number,
      issueSourceRef: createdIssue.html_url,
      issueTitle: createdIssue.title,
      missionId: verified.missionId,
      repoFullName: input.repositoryContext.fullName,
      createMission: {
        firstOutcome: verified.firstCreate.json?.outcome ?? null,
        secondOutcome: verified.secondCreate.json?.outcome ?? null,
      },
      githubIssue: {
        id: String(createdIssue.id),
        nodeId: createdIssue.node_id ?? null,
        state: createdIssue.state,
        url: createdIssue.html_url,
      },
      installationId,
      permissions: tokenResponse.permissions ?? {},
    }
  } catch (error) {
    cleanup = await closeGitHubIssue({
      issueNumber: createdIssue.number,
      repoFullName: input.repositoryContext.fullName,
      token,
    })

    throw new Error(
      `${error instanceof Error ? error.message : String(error)} Cleanup result for live issue #${createdIssue.number}: ${cleanup.result}.`,
    )
  }
}

async function verifyIssueIntakeFlow(input) {
  const issueList = await expectOkJson(
    `${input.controlPlaneUrl}/github/intake/issues`,
    "issue intake list",
  )
  const intakeIssue = issueList.issues?.find(
    (issue) => issue.deliveryId === input.deliveryId,
  )

  assert(
    intakeIssue,
    `Persisted intake item ${input.deliveryId} was not returned by GET /github/intake/issues`,
  )
  assert(
    intakeIssue.repoFullName === input.repoFullName,
    `Expected intake repo ${input.repoFullName}, received ${intakeIssue.repoFullName}`,
  )
  assert(
    intakeIssue.issueNumber === input.issueNumber,
    `Expected intake issue number ${input.issueNumber}, received ${intakeIssue.issueNumber}`,
  )
  assert(
    intakeIssue.issueTitle === input.issueTitle,
    `Expected intake issue title ${input.issueTitle}, received ${intakeIssue.issueTitle}`,
  )

  const firstCreate = await requestJson(
    `${input.controlPlaneUrl}/github/intake/issues/${encodeURIComponent(input.deliveryId)}/create-mission`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({}),
    },
  )
  const secondCreate = await requestJson(
    `${input.controlPlaneUrl}/github/intake/issues/${encodeURIComponent(input.deliveryId)}/create-mission`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({}),
    },
  )

  assert(
    firstCreate.status === 201,
    `Expected first create-mission to return 201, received ${firstCreate.status}`,
  )
  assert(
    secondCreate.status === 200,
    `Expected repeated create-mission to return 200, received ${secondCreate.status}`,
  )
  assert(
    firstCreate.json?.outcome === "created",
    "First create-mission did not report outcome=created",
  )
  assert(
    secondCreate.json?.outcome === "already_bound",
    "Repeated create-mission did not report outcome=already_bound",
  )

  const missionId = firstCreate.json?.mission?.id
  assert(
    typeof missionId === "string" && missionId.length > 0,
    "Mission id was missing from create-mission response",
  )
  assert(
    secondCreate.json?.mission?.id === missionId,
    "Repeated create-mission did not return the same mission id",
  )

  const missionDetail = await expectOkJson(
    `${input.controlPlaneUrl}/missions/${missionId}`,
    "mission detail",
  )
  assert(
    missionDetail.mission?.sourceKind === "github_issue",
    `Expected sourceKind github_issue, received ${missionDetail.mission?.sourceKind ?? "unknown"}`,
  )
  assert(
    missionDetail.mission?.sourceRef === input.issueUrl,
    `Expected sourceRef ${input.issueUrl}, received ${missionDetail.mission?.sourceRef ?? "unknown"}`,
  )
  assert(
    missionDetail.mission?.primaryRepo === input.repoFullName,
    `Expected primaryRepo ${input.repoFullName}, received ${missionDetail.mission?.primaryRepo ?? "unknown"}`,
  )
  assert(
    Array.isArray(missionDetail.mission?.spec?.repos) &&
      missionDetail.mission.spec.repos.includes(input.repoFullName),
    `Mission spec.repos did not include ${input.repoFullName}`,
  )

  if (input.requireMissionPage) {
    const missionPage = await fetch(
      `${input.webUrl}/missions/${encodeURIComponent(missionId)}`,
      {
        redirect: "follow",
        headers: {
          accept: "text/html",
        },
      },
    )
    const missionPageHtml = await missionPage.text()

    assert(
      missionPage.ok,
      `Mission detail page ${input.webUrl}/missions/${missionId} returned ${missionPage.status}`,
    )
    assert(
      missionPageHtml.includes(input.issueTitle),
      "Mission detail page rendered but did not include the mission title",
    )
  }

  return {
    firstCreate,
    intakeIssue,
    missionDetail,
    missionId,
    secondCreate,
  }
}

async function waitForPersistedIssueDelivery(input) {
  const deadline = Date.now() + input.timeoutMs

  while (Date.now() <= deadline) {
    const deliveries = await expectOkJson(
      `${input.controlPlaneUrl}/github/webhooks/deliveries?eventName=issues&handledAs=issue_envelope_recorded&installationId=${encodeURIComponent(input.installationId)}`,
      "issues webhook delivery list",
    )
    const matched = deliveries.deliveries?.find((delivery) => {
      const preview = delivery.payloadPreview ?? {}

      return (
        preview.repositoryFullName === input.repoFullName &&
        preview.issueNumber === input.issueNumber
      )
    })

    if (matched) {
      return matched
    }

    await wait(input.pollIntervalMs)
  }

  throw new Error(
    `No persisted live issues delivery for ${input.repoFullName}#${input.issueNumber} arrived within ${input.timeoutMs}ms.`,
  )
}

async function createGitHubIssue(input) {
  const timestamp = new Date().toISOString()
  const response = await fetch(
    `https://api.github.com/repos/${encodeRepoPath(input.repoFullName)}/issues`,
    {
      method: "POST",
      headers: {
        ...buildInstallationHeaders(input.token, {
          extraHeaders: {
            "Content-Type": "application/json",
          },
          userAgent: USER_AGENT,
        }),
      },
      body: JSON.stringify({
        body: [
          "This is a short-lived live GitHub-hosted smoke issue for Pocket CTO M2.7.",
          "The helper will watch for the real webhook delivery, create one build mission through the existing intake route, and then close this issue when capture is complete.",
        ].join("\n\n"),
        title: `Pocket CTO live issue intake smoke ${timestamp}`,
      }),
    },
  )
  const body = await parseGitHubResponse(response)

  if (!response.ok) {
    throw new Error(
      `Failed to create live GitHub issue on ${input.repoFullName} (${response.status}): ${JSON.stringify(body)}`,
    )
  }

  return body
}

async function closeGitHubIssue(input) {
  const response = await fetch(
    `https://api.github.com/repos/${encodeRepoPath(input.repoFullName)}/issues/${input.issueNumber}`,
    {
      method: "PATCH",
      headers: {
        ...buildInstallationHeaders(input.token, {
          extraHeaders: {
            "Content-Type": "application/json",
          },
          userAgent: USER_AGENT,
        }),
      },
      body: JSON.stringify({
        state: "closed",
      }),
    },
  )
  const body = await parseGitHubResponse(response)

  if (!response.ok) {
    return {
      attempted: true,
      issueState: body?.state ?? null,
      result: `close_failed_${response.status}`,
    }
  }

  return {
    attempted: true,
    issueState: body?.state ?? null,
    result: body?.state === "closed" ? "closed" : "unchanged",
  }
}

async function requestJson(url, input) {
  const response = await fetch(url, input)

  return {
    json: await readJson(response),
    status: response.status,
  }
}

async function readJson(response) {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(
      `Expected JSON response from ${response.url}, received: ${text.slice(0, 240)}`,
    )
  }
}

async function resolveRepositoryContext(input) {
  const repositoryList = await expectOkJson(
    `${input.controlPlaneUrl}/github/repositories`,
    "github repository list",
  )
  const activeRepositories = (repositoryList.repositories ?? []).filter(
    (repository) => repository.isActive,
  )

  if (input.requestedFullName) {
    const matched = activeRepositories.find(
      (repository) => repository.fullName === input.requestedFullName,
    )
    if (!matched) {
      throw new Error(
        `Active synced repository ${input.requestedFullName} was not found. Pass a synced full name or sync repositories first.`,
      )
    }

    return matched
  }

  if (activeRepositories.length === 1) {
    return activeRepositories[0]
  }

  const gitRemoteFullName = tryResolveGitRemoteFullName()
  if (gitRemoteFullName) {
    const matched = activeRepositories.find(
      (repository) => repository.fullName === gitRemoteFullName,
    )
    if (matched) {
      return matched
    }
  }

  if (activeRepositories.length === 0) {
    throw new Error(
      "No active synced repositories are available. Sync repositories first or pass --repo-full-name for a synced repo.",
    )
  }

  throw new Error(
    "Multiple active synced repositories were found. Pass --repo-full-name to choose the truthful target repo for the smoke.",
  )
}

function requireRepositoryInstallationId(repositoryContext) {
  const installationId = repositoryContext.installationId

  if (typeof installationId !== "string" || installationId.length === 0) {
    throw new Error(
      `Repository ${repositoryContext.fullName} is missing installationId in GET /github/repositories.`,
    )
  }

  return installationId
}

function tryResolveGitRemoteFullName() {
  try {
    const remoteUrl = execFileSync("git", ["remote", "get-url", "origin"], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
    const sshMatch = remoteUrl.match(/^git@github\.com:([^/]+\/[^/.]+?)(?:\.git)?$/u)

    if (sshMatch?.[1]) {
      return sshMatch[1]
    }

    const httpsMatch = remoteUrl.match(
      /^https:\/\/github\.com\/([^/]+\/[^/.]+?)(?:\.git)?$/u,
    )

    if (httpsMatch?.[1]) {
      return httpsMatch[1]
    }

    return null
  } catch {
    return null
  }
}

function buildIssuePayload(input) {
  const [ownerLogin = "unknown", name = "unknown"] = input.repoFullName.split("/")

  return {
    action: "opened",
    installation: {
      id: input.installationId,
    },
    issue: {
      body: input.body,
      comments: 0,
      html_url: input.issueUrl,
      id: input.issueId,
      node_id: `LOCAL_${input.issueId}`,
      number: input.issueNumber,
      state: "open",
      title: input.title,
    },
    repository: {
      archived: false,
      default_branch: "main",
      disabled: false,
      full_name: input.repoFullName,
      id: input.githubRepositoryId,
      language: input.language ?? "TypeScript",
      name,
      owner: {
        login: ownerLogin,
      },
      private: input.visibility === "private",
    },
    sender: {
      login: input.senderLogin,
    },
  }
}

function normalizeMode(value) {
  if (value !== LOCAL_MODE && value !== LIVE_MODE) {
    throw new Error(
      `--mode must be ${LOCAL_MODE} or ${LIVE_MODE}. Received: ${value}`,
    )
  }

  return value
}

function readPositiveInteger(value, label) {
  const parsed = Number.parseInt(value, 10)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive integer`)
  }

  return parsed
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
