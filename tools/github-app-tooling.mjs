import { createPrivateKey, createSign } from "node:crypto"

export const GITHUB_ACCEPT_HEADER = "application/vnd.github+json"
export const GITHUB_API_VERSION = "2022-11-28"
export const DEFAULT_GITHUB_USER_AGENT = "pocket-cto-github-tooling"

export function requireEnv(name) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`${name} is required.`)
  }

  return value
}

export async function createInstallationAccessToken(input) {
  const appJwt = createAppJwt({
    appId: input.appId,
    privateKeyBase64: input.privateKeyBase64,
  })
  const response = await fetch(
    `https://api.github.com/app/installations/${encodeURIComponent(input.installationId)}/access_tokens`,
    {
      method: "POST",
      headers: {
        Accept: GITHUB_ACCEPT_HEADER,
        Authorization: `Bearer ${appJwt}`,
        "Content-Type": "application/json",
        "User-Agent": input.userAgent ?? DEFAULT_GITHUB_USER_AGENT,
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      },
      body: JSON.stringify({}),
    },
  )
  const body = await parseGitHubResponse(response)

  if (!response.ok || !body?.token) {
    throw new Error(
      `Failed to create installation token (${response.status}): ${JSON.stringify(body)}`,
    )
  }

  return body
}

export function buildInstallationHeaders(token, input = {}) {
  return {
    Accept: GITHUB_ACCEPT_HEADER,
    Authorization: `Bearer ${token}`,
    "User-Agent": input.userAgent ?? DEFAULT_GITHUB_USER_AGENT,
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
    ...input.extraHeaders,
  }
}

export function encodeRepoPath(fullName) {
  return fullName
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

export function encodeGitRef(ref) {
  return ref
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

export async function parseGitHubResponse(response) {
  const rawBody = await response.text()

  if (!rawBody) {
    return null
  }

  try {
    return JSON.parse(rawBody)
  } catch {
    return rawBody
  }
}

function createAppJwt(input) {
  const privateKeyPem = Buffer.from(input.privateKeyBase64, "base64")
    .toString("utf8")
    .trim()
  const privateKey = createPrivateKey(privateKeyPem)
  const nowSeconds = Math.floor(Date.now() / 1000)
  const header = toBase64Url(
    JSON.stringify({
      alg: "RS256",
      typ: "JWT",
    }),
  )
  const payload = toBase64Url(
    JSON.stringify({
      exp: nowSeconds + 9 * 60,
      iat: nowSeconds - 60,
      iss: input.appId,
    }),
  )
  const signingInput = `${header}.${payload}`
  const signature = createSign("RSA-SHA256")
    .update(signingInput)
    .end()
    .sign(privateKey)
    .toString("base64url")

  return `${signingInput}.${signature}`
}

function toBase64Url(value) {
  return Buffer.from(value).toString("base64url")
}
