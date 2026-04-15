import {
  type CfoWikiPageKey,
  type CfoWikiPageView,
  type FinanceBankAccountInventoryView,
  type FinanceCashPostureView,
  type FinanceDiscoveryQuestion,
  FinanceDiscoveryQuestionSchema,
} from "@pocket-cto/domain";
import { FinanceCompanyNotFoundError } from "../finance-twin/errors";
import type { FinanceTwinService } from "../finance-twin/service";
import { CfoWikiPageNotFoundError } from "../wiki/errors";
import type { CfoWikiService } from "../wiki/service";
import { buildFinanceDiscoveryAnswerMetadata } from "./formatter";

const RELATED_WIKI_PAGE_KEYS = [
  "metrics/cash-posture",
  "concepts/cash",
  "company/overview",
] as const satisfies CfoWikiPageKey[];

const RELATED_ROUTES = [
  {
    label: "Cash posture",
    routePathSuffix: "cash-posture",
  },
  {
    label: "Bank account inventory",
    routePathSuffix: "bank-accounts",
  },
] as const;

export class FinanceDiscoveryService {
  constructor(
    private readonly deps: {
      cfoWikiService: Pick<CfoWikiService, "getPage">;
      financeTwinService: Pick<
        FinanceTwinService,
        "getBankAccounts" | "getCashPosture"
      >;
    },
  ) {}

  async answerQuestion(rawQuestion: FinanceDiscoveryQuestion) {
    const question = FinanceDiscoveryQuestionSchema.parse(rawQuestion);

    switch (question.questionKind) {
      case "cash_posture":
        return this.answerCashPosture(question);
    }
  }

  private async answerCashPosture(question: FinanceDiscoveryQuestion) {
    const extraLimitations: string[] = [];
    const cashPosture = await this.readCashPosture(question, extraLimitations);
    const bankAccounts = await this.readBankAccounts(question, extraLimitations);
    const { missingWikiPages, wikiPages } = await this.readWikiPages(
      question,
      extraLimitations,
    );

    return buildFinanceDiscoveryAnswerMetadata({
      bankAccounts,
      cashPosture,
      extraLimitations,
      missingWikiPages,
      question,
      relatedRoutes: RELATED_ROUTES.map((route) => ({
        label: route.label,
        routePath: `/finance-twin/companies/${question.companyKey}/${route.routePathSuffix}`,
      })),
      wikiPages,
    });
  }

  private async readCashPosture(
    question: FinanceDiscoveryQuestion,
    extraLimitations: string[],
  ): Promise<FinanceCashPostureView | null> {
    try {
      return await this.deps.financeTwinService.getCashPosture(question.companyKey);
    } catch (error) {
      if (error instanceof FinanceCompanyNotFoundError) {
        extraLimitations.push(
          `Finance Twin company ${question.companyKey} does not exist yet, so no stored cash-posture state could be read.`,
        );
        return null;
      }

      throw error;
    }
  }

  private async readBankAccounts(
    question: FinanceDiscoveryQuestion,
    extraLimitations: string[],
  ): Promise<FinanceBankAccountInventoryView | null> {
    try {
      return await this.deps.financeTwinService.getBankAccounts(question.companyKey);
    } catch (error) {
      if (error instanceof FinanceCompanyNotFoundError) {
        extraLimitations.push(
          `Finance Twin company ${question.companyKey} does not exist yet, so no stored bank-account inventory could be read.`,
        );
        return null;
      }

      throw error;
    }
  }

  private async readWikiPages(
    question: FinanceDiscoveryQuestion,
    extraLimitations: string[],
  ): Promise<{
    missingWikiPages: CfoWikiPageKey[];
    wikiPages: CfoWikiPageView[];
  }> {
    const results = await Promise.all(
      RELATED_WIKI_PAGE_KEYS.map(async (pageKey) => {
        try {
          const page = await this.deps.cfoWikiService.getPage(
            question.companyKey,
            pageKey,
          );
          return {
            kind: "page" as const,
            page,
          };
        } catch (error) {
          if (
            error instanceof CfoWikiPageNotFoundError ||
            error instanceof FinanceCompanyNotFoundError
          ) {
            return {
              kind: "missing" as const,
              pageKey,
            };
          }

          throw error;
        }
      }),
    );

    const wikiPages = results.flatMap((result) =>
      result.kind === "page" ? [result.page] : [],
    );
    const missingWikiPages = results.flatMap((result) =>
      result.kind === "missing" ? [result.pageKey] : [],
    );

    if (missingWikiPages.length > 0) {
      extraLimitations.push(
        `CFO Wiki coverage is partial for ${question.companyKey}; one or more expected cash-posture pages are not available yet.`,
      );
    }

    return {
      missingWikiPages,
      wikiPages,
    };
  }
}
