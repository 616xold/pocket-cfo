import type {
  CfoWikiPageKey,
  CfoWikiPageView,
  FinanceBankAccountInventoryView,
  FinanceCashPostureCurrencyBucket,
  FinanceCashPostureView,
  FinanceDiscoveryAnswerArtifactMetadata,
  FinanceDiscoveryEvidenceSection,
  FinanceDiscoveryFreshnessPosture,
  FinanceDiscoveryQuestion,
  FinanceDiscoveryRelatedRoute,
  FinanceDiscoveryRelatedWikiPage,
} from "@pocket-cto/domain";
import { FinanceDiscoveryAnswerArtifactMetadataSchema } from "@pocket-cto/domain";

type FinanceDiscoveryAnswerFormatterInput = {
  bankAccounts: FinanceBankAccountInventoryView | null;
  cashPosture: FinanceCashPostureView | null;
  extraLimitations: string[];
  missingWikiPages: CfoWikiPageKey[];
  question: FinanceDiscoveryQuestion;
  relatedRoutes: FinanceDiscoveryRelatedRoute[];
  wikiPages: CfoWikiPageView[];
};

export function buildFinanceDiscoveryAnswerMetadata(
  input: FinanceDiscoveryAnswerFormatterInput,
): FinanceDiscoveryAnswerArtifactMetadata {
  const freshnessPosture = buildFreshnessPosture(input);
  const limitations = buildLimitations(input);
  const relatedWikiPages = input.wikiPages.map((page) => ({
    pageKey: page.page.pageKey,
    title: page.page.title,
  })) satisfies FinanceDiscoveryRelatedWikiPage[];
  const evidenceSections = buildEvidenceSections({
    bankAccounts: input.bankAccounts,
    cashPosture: input.cashPosture,
    relatedRoutes: input.relatedRoutes,
    wikiPages: input.wikiPages,
  });
  const answerSummary = buildAnswerSummary({
    cashPosture: input.cashPosture,
    question: input.question,
  });

  return FinanceDiscoveryAnswerArtifactMetadataSchema.parse({
    source: "stored_finance_twin_and_cfo_wiki",
    summary: answerSummary,
    companyKey: input.question.companyKey,
    questionKind: input.question.questionKind,
    answerSummary,
    freshnessPosture,
    limitations,
    relatedRoutes: input.relatedRoutes,
    relatedWikiPages,
    evidenceSections,
    bodyMarkdown: buildBodyMarkdown({
      answerSummary,
      evidenceSections,
      freshnessPosture,
      limitations,
      question: input.question,
      relatedRoutes: input.relatedRoutes,
      relatedWikiPages,
    }),
    structuredData: {
      companyKey: input.question.companyKey,
      questionKind: input.question.questionKind,
      operatorPrompt: input.question.operatorPrompt ?? null,
      freshnessPosture,
      cashPosture: input.cashPosture
        ? {
            coverageSummary: input.cashPosture.coverageSummary,
            currencyBuckets: input.cashPosture.currencyBuckets,
            diagnostics: input.cashPosture.diagnostics,
            latestAttemptedSyncRunId:
              input.cashPosture.latestAttemptedSyncRun?.id ?? null,
            latestSuccessfulSyncRunId:
              input.cashPosture.latestSuccessfulBankSummarySlice.latestSyncRun?.id ??
              null,
          }
        : null,
      bankAccounts: input.bankAccounts
        ? {
            accountCount: input.bankAccounts.accountCount,
            diagnostics: input.bankAccounts.diagnostics,
            latestAttemptedSyncRunId:
              input.bankAccounts.latestAttemptedSyncRun?.id ?? null,
            latestSuccessfulSyncRunId:
              input.bankAccounts.latestSuccessfulSlice.latestSyncRun?.id ?? null,
          }
        : null,
      wikiPages: input.wikiPages.map((page) => ({
        pageKey: page.page.pageKey,
        title: page.page.title,
        freshnessState: page.freshnessSummary.state,
        summary: page.page.summary,
      })),
      missingWikiPages: input.missingWikiPages,
    },
  });
}

function buildFreshnessPosture(
  input: Pick<FinanceDiscoveryAnswerFormatterInput, "cashPosture" | "question">,
): FinanceDiscoveryFreshnessPosture {
  if (!input.cashPosture) {
    return {
      state: "missing",
      reasonSummary: `No stored Finance Twin cash posture is available yet for ${input.question.companyKey}.`,
    };
  }

  return {
    state: input.cashPosture.freshness.state,
    reasonSummary: input.cashPosture.freshness.reasonSummary,
  };
}

function buildLimitations(
  input: Pick<
    FinanceDiscoveryAnswerFormatterInput,
    | "bankAccounts"
    | "cashPosture"
    | "extraLimitations"
    | "missingWikiPages"
    | "question"
  >,
) {
  const limitations = [
    ...input.extraLimitations,
    ...(input.cashPosture?.limitations ?? []),
    ...(input.bankAccounts?.limitations ?? []),
    ...input.missingWikiPages.map(
      (pageKey) =>
        `CFO Wiki page ${pageKey} is not available yet for ${input.question.companyKey}.`,
    ),
  ];

  if (input.cashPosture?.coverageSummary.reportedBalanceCount === 0) {
    limitations.push(
      `No persisted bank-account summary rows are available yet for ${input.question.companyKey}.`,
    );
  }

  return Array.from(new Set(limitations.filter((entry) => entry.trim().length > 0)));
}

function buildAnswerSummary(input: {
  cashPosture: FinanceCashPostureView | null;
  question: FinanceDiscoveryQuestion;
}) {
  if (!input.cashPosture) {
    return `No stored cash posture is available yet for ${input.question.companyKey}; the answer remains limited to missing-state posture and visible gaps.`;
  }

  if (
    input.cashPosture.coverageSummary.reportedBalanceCount === 0 ||
    input.cashPosture.currencyBuckets.length === 0
  ) {
    return `Stored cash posture for ${input.question.companyKey} is limited: no persisted bank-account summary rows are currently available for review.`;
  }

  const [firstBucket] = input.cashPosture.currencyBuckets;
  if (!firstBucket) {
    return `Stored cash posture for ${input.question.companyKey} is limited: no persisted bank-account summary rows are currently available for review.`;
  }
  const additionalBucketCount = input.cashPosture.currencyBuckets.length - 1;
  const additionalBucketSummary =
    additionalBucketCount > 0
      ? ` ${additionalBucketCount} additional currency bucket${additionalBucketCount === 1 ? " is" : "s are"} also present.`
      : "";

  return `Stored cash posture for ${input.question.companyKey} covers ${input.cashPosture.coverageSummary.bankAccountCount} bank account${pluralize(
    input.cashPosture.coverageSummary.bankAccountCount,
  )} across ${input.cashPosture.currencyBuckets.length} currency bucket${pluralize(
    input.cashPosture.currencyBuckets.length,
  )}: ${buildCurrencyBucketSummary(firstBucket)}.${additionalBucketSummary}`;
}

function buildCurrencyBucketSummary(bucket: FinanceCashPostureCurrencyBucket) {
  const totals = [
    `statement or ledger ${bucket.statementOrLedgerBalanceTotal}`,
    `available ${bucket.availableBalanceTotal}`,
    `unspecified ${bucket.unspecifiedBalanceTotal}`,
  ];
  const dateSummary = readBucketDateSummary(bucket);

  return `${bucket.currency ?? "Unknown currency"} ${totals.join(", ")}${dateSummary ? ` (${dateSummary})` : ""}`;
}

function readBucketDateSummary(bucket: FinanceCashPostureCurrencyBucket) {
  if (!bucket.earliestAsOfDate && !bucket.latestAsOfDate) {
    return null;
  }

  if (bucket.earliestAsOfDate && bucket.earliestAsOfDate === bucket.latestAsOfDate) {
    return `as of ${bucket.earliestAsOfDate}`;
  }

  if (bucket.earliestAsOfDate && bucket.latestAsOfDate) {
    return `as of ${bucket.earliestAsOfDate} to ${bucket.latestAsOfDate}`;
  }

  return null;
}

function buildEvidenceSections(input: {
  bankAccounts: FinanceBankAccountInventoryView | null;
  cashPosture: FinanceCashPostureView | null;
  relatedRoutes: FinanceDiscoveryRelatedRoute[];
  wikiPages: CfoWikiPageView[];
}) {
  const sections: FinanceDiscoveryEvidenceSection[] = [
    {
      key: "cash_posture_route",
      title: "Cash posture route",
      summary: buildCashPostureEvidenceSummary(input.cashPosture),
      routePath:
        input.relatedRoutes.find((route) => route.label === "Cash posture")
          ?.routePath ?? input.relatedRoutes[0]?.routePath,
    },
    {
      key: "bank_account_inventory_route",
      title: "Bank account inventory route",
      summary: buildBankAccountEvidenceSummary(input.bankAccounts),
      routePath:
        input.relatedRoutes.find((route) => route.label === "Bank account inventory")
          ?.routePath ?? input.relatedRoutes[1]?.routePath,
    },
  ];

  for (const page of input.wikiPages) {
    sections.push({
      key: `wiki_${page.page.pageKey.replaceAll("/", "_")}`,
      title: `CFO Wiki: ${page.page.title}`,
      summary: page.page.summary,
      pageKey: page.page.pageKey,
    });
  }

  return sections;
}

function buildCashPostureEvidenceSummary(cashPosture: FinanceCashPostureView | null) {
  if (!cashPosture) {
    return "No stored cash-posture route result is available yet for this company.";
  }

  return `Read ${cashPosture.coverageSummary.reportedBalanceCount} persisted bank-summary balance${pluralize(
    cashPosture.coverageSummary.reportedBalanceCount,
  )} across ${cashPosture.coverageSummary.currencyBucketCount} currency bucket${pluralize(
    cashPosture.coverageSummary.currencyBucketCount,
  )}. Freshness is ${cashPosture.freshness.state}: ${cashPosture.freshness.reasonSummary}`;
}

function buildBankAccountEvidenceSummary(
  bankAccounts: FinanceBankAccountInventoryView | null,
) {
  if (!bankAccounts) {
    return "No stored bank-account inventory route result is available yet for this company.";
  }

  return `Read ${bankAccounts.accountCount} persisted bank account${pluralize(
    bankAccounts.accountCount,
  )} with ${bankAccounts.accounts.flatMap((account) => account.reportedBalances).length} reported balance row${pluralize(
    bankAccounts.accounts.flatMap((account) => account.reportedBalances).length,
  )}.`;
}

function buildBodyMarkdown(input: {
  answerSummary: string;
  evidenceSections: FinanceDiscoveryEvidenceSection[];
  freshnessPosture: FinanceDiscoveryFreshnessPosture;
  limitations: string[];
  question: FinanceDiscoveryQuestion;
  relatedRoutes: FinanceDiscoveryRelatedRoute[];
  relatedWikiPages: FinanceDiscoveryRelatedWikiPage[];
}) {
  const lines = [
    "# Cash posture answer",
    "",
    input.answerSummary,
    "",
    "## Question",
    `- Company key: \`${input.question.companyKey}\``,
    `- Question kind: \`${input.question.questionKind}\``,
    ...(input.question.operatorPrompt
      ? [`- Operator prompt: ${input.question.operatorPrompt}`]
      : []),
    "",
    "## Freshness posture",
    `- State: \`${input.freshnessPosture.state}\``,
    `- Reason: ${input.freshnessPosture.reasonSummary}`,
    "",
    "## Limitations",
    ...(input.limitations.length > 0
      ? input.limitations.map((entry) => `- ${entry}`)
      : ["- No explicit limitations were recorded."]),
    "",
    "## Related routes",
    ...(input.relatedRoutes.length > 0
      ? input.relatedRoutes.map(
          (route) => `- ${route.label}: \`${route.routePath}\``,
        )
      : ["- No related routes were recorded."]),
    "",
    "## Related CFO Wiki pages",
    ...(input.relatedWikiPages.length > 0
      ? input.relatedWikiPages.map(
          (page) => `- \`${page.pageKey}\`: ${page.title}`,
        )
      : ["- No related CFO Wiki pages were available."]),
    "",
    "## Evidence sections",
  ];

  for (const section of input.evidenceSections) {
    lines.push(`### ${section.title}`);
    lines.push(section.summary);

    if (section.routePath) {
      lines.push(`Route: \`${section.routePath}\``);
    }

    if (section.pageKey) {
      lines.push(`Wiki page: \`${section.pageKey}\``);
    }

    lines.push("");
  }

  return lines.join("\n").trim();
}

function pluralize(count: number) {
  return count === 1 ? "" : "s";
}
