import type {
  CloseControlReviewSummaryServicePort,
  DeliveryReadinessServicePort,
} from "../../lib/types";
import { AppHttpError } from "../../lib/http-errors";
import { buildExternalProviderBoundaryResult } from "./formatter";

type ExternalProviderBoundaryServiceDeps = {
  closeControlReviewSummaryService: Pick<
    CloseControlReviewSummaryServicePort,
    "getReviewSummary"
  >;
  deliveryReadinessService: Pick<
    DeliveryReadinessServicePort,
    "getDeliveryReadiness"
  >;
  now?: () => Date;
};

export class ExternalProviderBoundaryService {
  private readonly now: () => Date;

  constructor(private readonly deps: ExternalProviderBoundaryServiceDeps) {
    this.now = deps.now ?? (() => new Date());
  }

  async getExternalProviderBoundary(companyKey: string) {
    const [deliveryReadiness, reviewSummary] = await Promise.all([
      this.deps.deliveryReadinessService.getDeliveryReadiness(companyKey),
      this.deps.closeControlReviewSummaryService.getReviewSummary(companyKey),
    ]);

    assertReadModelCompanyKey({
      actualCompanyKey: deliveryReadiness.companyKey,
      path: "deliveryReadiness.companyKey",
      requestedCompanyKey: companyKey,
    });
    assertReadModelCompanyKey({
      actualCompanyKey: reviewSummary.companyKey,
      path: "reviewSummary.companyKey",
      requestedCompanyKey: companyKey,
    });

    return buildExternalProviderBoundaryResult({
      companyKey,
      deliveryReadiness,
      generatedAt: this.now().toISOString(),
      reviewSummary,
    });
  }
}

type ReadModelCompanyKeyAssertion = {
  actualCompanyKey: string;
  path: "deliveryReadiness.companyKey" | "reviewSummary.companyKey";
  requestedCompanyKey: string;
};

export class ExternalProviderBoundaryCompanyKeyMismatchError extends AppHttpError {
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
    this.name = "ExternalProviderBoundaryCompanyKeyMismatchError";
  }
}

function assertReadModelCompanyKey(input: ReadModelCompanyKeyAssertion) {
  if (input.actualCompanyKey !== input.requestedCompanyKey) {
    throw new ExternalProviderBoundaryCompanyKeyMismatchError(input);
  }
}
