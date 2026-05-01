import type {
  CloseControlCertificationBoundaryServicePort,
  CloseControlReviewSummaryServicePort,
  ExternalDeliveryHumanConfirmationBoundaryServicePort,
} from "../../lib/types";
import { AppHttpError } from "../../lib/http-errors";
import { buildCloseControlCertificationSafetyResult } from "./formatter";

type CloseControlCertificationSafetyServiceDeps = {
  closeControlCertificationBoundaryService: Pick<
    CloseControlCertificationBoundaryServicePort,
    "getCertificationBoundary"
  >;
  closeControlReviewSummaryService: Pick<
    CloseControlReviewSummaryServicePort,
    "getReviewSummary"
  >;
  externalDeliveryHumanConfirmationBoundaryService: Pick<
    ExternalDeliveryHumanConfirmationBoundaryServicePort,
    "getHumanConfirmationBoundary"
  >;
  now?: () => Date;
};

export class CloseControlCertificationSafetyService {
  private readonly now: () => Date;

  constructor(
    private readonly deps: CloseControlCertificationSafetyServiceDeps,
  ) {
    this.now = deps.now ?? (() => new Date());
  }

  async getCertificationSafety(companyKey: string) {
    const [certificationBoundary, humanConfirmation, reviewSummary] =
      await Promise.all([
        this.deps.closeControlCertificationBoundaryService.getCertificationBoundary(
          companyKey,
        ),
        this.deps.externalDeliveryHumanConfirmationBoundaryService.getHumanConfirmationBoundary(
          companyKey,
        ),
        this.deps.closeControlReviewSummaryService.getReviewSummary(companyKey),
      ]);

    assertReadModelCompanyKey({
      actualCompanyKey: certificationBoundary.companyKey,
      path: "certificationBoundary.companyKey",
      requestedCompanyKey: companyKey,
    });
    assertReadModelCompanyKey({
      actualCompanyKey: humanConfirmation.companyKey,
      path: "humanConfirmationBoundary.companyKey",
      requestedCompanyKey: companyKey,
    });
    assertReadModelCompanyKey({
      actualCompanyKey: reviewSummary.companyKey,
      path: "reviewSummary.companyKey",
      requestedCompanyKey: companyKey,
    });

    return buildCloseControlCertificationSafetyResult({
      certificationBoundary,
      companyKey,
      generatedAt: this.now().toISOString(),
      humanConfirmation,
      reviewSummary,
    });
  }
}

type ReadModelCompanyKeyAssertion = {
  actualCompanyKey: string;
  path:
    | "certificationBoundary.companyKey"
    | "humanConfirmationBoundary.companyKey"
    | "reviewSummary.companyKey";
  requestedCompanyKey: string;
};

export class CloseControlCertificationSafetyCompanyKeyMismatchError extends AppHttpError {
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
    this.name = "CloseControlCertificationSafetyCompanyKeyMismatchError";
  }
}

function assertReadModelCompanyKey(input: ReadModelCompanyKeyAssertion) {
  if (input.actualCompanyKey !== input.requestedCompanyKey) {
    throw new CloseControlCertificationSafetyCompanyKeyMismatchError(input);
  }
}
