import type {
  CloseControlReviewSummaryServicePort,
  ExternalProviderBoundaryServicePort,
} from "../../lib/types";
import { AppHttpError } from "../../lib/http-errors";
import { buildCloseControlCertificationBoundaryResult } from "./formatter";

type CloseControlCertificationBoundaryServiceDeps = {
  closeControlReviewSummaryService: Pick<
    CloseControlReviewSummaryServicePort,
    "getReviewSummary"
  >;
  externalProviderBoundaryService: Pick<
    ExternalProviderBoundaryServicePort,
    "getExternalProviderBoundary"
  >;
  now?: () => Date;
};

export class CloseControlCertificationBoundaryService {
  private readonly now: () => Date;

  constructor(
    private readonly deps: CloseControlCertificationBoundaryServiceDeps,
  ) {
    this.now = deps.now ?? (() => new Date());
  }

  async getCertificationBoundary(companyKey: string) {
    const [reviewSummary, providerBoundary] = await Promise.all([
      this.deps.closeControlReviewSummaryService.getReviewSummary(companyKey),
      this.deps.externalProviderBoundaryService.getExternalProviderBoundary(
        companyKey,
      ),
    ]);

    assertReadModelCompanyKey({
      actualCompanyKey: reviewSummary.companyKey,
      path: "reviewSummary.companyKey",
      requestedCompanyKey: companyKey,
    });
    assertReadModelCompanyKey({
      actualCompanyKey: providerBoundary.companyKey,
      path: "externalProviderBoundary.companyKey",
      requestedCompanyKey: companyKey,
    });

    return buildCloseControlCertificationBoundaryResult({
      companyKey,
      generatedAt: this.now().toISOString(),
      providerBoundary,
      reviewSummary,
    });
  }
}

type ReadModelCompanyKeyAssertion = {
  actualCompanyKey: string;
  path: "reviewSummary.companyKey" | "externalProviderBoundary.companyKey";
  requestedCompanyKey: string;
};

export class CloseControlCertificationBoundaryCompanyKeyMismatchError extends AppHttpError {
  constructor(input: ReadModelCompanyKeyAssertion) {
    super(400, {
      error: {
        code: "invalid_request",
        message: "Invalid request",
        details: [
          {
            path: input.path,
            message: `Expected ${input.path} to match requested companyKey "${input.requestedCompanyKey}", received "${input.actualCompanyKey}"`,
          },
        ],
      },
    });
    this.name = "CloseControlCertificationBoundaryCompanyKeyMismatchError";
  }
}

function assertReadModelCompanyKey(input: ReadModelCompanyKeyAssertion) {
  if (input.actualCompanyKey !== input.requestedCompanyKey) {
    throw new CloseControlCertificationBoundaryCompanyKeyMismatchError(input);
  }
}
