import type {
  CloseControlCertificationBoundaryServicePort,
  CloseControlReviewSummaryServicePort,
  DeliveryReadinessServicePort,
  ExternalProviderBoundaryServicePort,
} from "../../lib/types";
import { AppHttpError } from "../../lib/http-errors";
import { buildExternalDeliveryHumanConfirmationBoundaryResult } from "./formatter";

type ExternalDeliveryHumanConfirmationBoundaryServiceDeps = {
  closeControlCertificationBoundaryService: Pick<
    CloseControlCertificationBoundaryServicePort,
    "getCertificationBoundary"
  >;
  closeControlReviewSummaryService: Pick<
    CloseControlReviewSummaryServicePort,
    "getReviewSummary"
  >;
  deliveryReadinessService: Pick<
    DeliveryReadinessServicePort,
    "getDeliveryReadiness"
  >;
  externalProviderBoundaryService: Pick<
    ExternalProviderBoundaryServicePort,
    "getExternalProviderBoundary"
  >;
  now?: () => Date;
};

export class ExternalDeliveryHumanConfirmationBoundaryService {
  private readonly now: () => Date;

  constructor(
    private readonly deps: ExternalDeliveryHumanConfirmationBoundaryServiceDeps,
  ) {
    this.now = deps.now ?? (() => new Date());
  }

  async getHumanConfirmationBoundary(companyKey: string) {
    const [
      deliveryReadiness,
      providerBoundary,
      certificationBoundary,
      reviewSummary,
    ] = await Promise.all([
      this.deps.deliveryReadinessService.getDeliveryReadiness(companyKey),
      this.deps.externalProviderBoundaryService.getExternalProviderBoundary(
        companyKey,
      ),
      this.deps.closeControlCertificationBoundaryService.getCertificationBoundary(
        companyKey,
      ),
      this.deps.closeControlReviewSummaryService.getReviewSummary(companyKey),
    ]);

    assertReadModelCompanyKey({
      actualCompanyKey: deliveryReadiness.companyKey,
      path: "deliveryReadiness.companyKey",
      requestedCompanyKey: companyKey,
    });
    assertReadModelCompanyKey({
      actualCompanyKey: providerBoundary.companyKey,
      path: "externalProviderBoundary.companyKey",
      requestedCompanyKey: companyKey,
    });
    assertReadModelCompanyKey({
      actualCompanyKey: certificationBoundary.companyKey,
      path: "certificationBoundary.companyKey",
      requestedCompanyKey: companyKey,
    });
    assertReadModelCompanyKey({
      actualCompanyKey: reviewSummary.companyKey,
      path: "reviewSummary.companyKey",
      requestedCompanyKey: companyKey,
    });

    return buildExternalDeliveryHumanConfirmationBoundaryResult({
      certificationBoundary,
      companyKey,
      deliveryReadiness,
      generatedAt: this.now().toISOString(),
      providerBoundary,
      reviewSummary,
    });
  }
}

type ReadModelCompanyKeyAssertion = {
  actualCompanyKey: string;
  path:
    | "deliveryReadiness.companyKey"
    | "externalProviderBoundary.companyKey"
    | "certificationBoundary.companyKey"
    | "reviewSummary.companyKey";
  requestedCompanyKey: string;
};

export class ExternalDeliveryHumanConfirmationBoundaryCompanyKeyMismatchError extends AppHttpError {
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
    this.name =
      "ExternalDeliveryHumanConfirmationBoundaryCompanyKeyMismatchError";
  }
}

function assertReadModelCompanyKey(input: ReadModelCompanyKeyAssertion) {
  if (input.actualCompanyKey !== input.requestedCompanyKey) {
    throw new ExternalDeliveryHumanConfirmationBoundaryCompanyKeyMismatchError(
      input,
    );
  }
}
