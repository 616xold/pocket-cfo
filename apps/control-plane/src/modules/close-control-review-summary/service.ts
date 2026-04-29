import type {
  CloseControlAcknowledgementServicePort,
  CloseControlServicePort,
  DeliveryReadinessServicePort,
  OperatorReadinessServicePort,
} from "../../lib/types";
import { AppHttpError } from "../../lib/http-errors";
import { buildCloseControlReviewSummaryResult } from "./formatter";

type CloseControlReviewSummaryServiceDeps = {
  closeControlAcknowledgementService: Pick<
    CloseControlAcknowledgementServicePort,
    "getAcknowledgementReadiness"
  >;
  closeControlService: Pick<CloseControlServicePort, "getChecklist">;
  deliveryReadinessService: Pick<
    DeliveryReadinessServicePort,
    "getDeliveryReadiness"
  >;
  operatorReadinessService: Pick<OperatorReadinessServicePort, "getReadiness">;
  now?: () => Date;
};

export class CloseControlReviewSummaryService {
  private readonly now: () => Date;

  constructor(private readonly deps: CloseControlReviewSummaryServiceDeps) {
    this.now = deps.now ?? (() => new Date());
  }

  async getReviewSummary(companyKey: string) {
    const [
      checklist,
      operatorReadiness,
      acknowledgementReadiness,
      deliveryReadiness,
    ] = await Promise.all([
      this.deps.closeControlService.getChecklist(companyKey),
      this.deps.operatorReadinessService.getReadiness(companyKey),
      this.deps.closeControlAcknowledgementService.getAcknowledgementReadiness(
        companyKey,
      ),
      this.deps.deliveryReadinessService.getDeliveryReadiness(companyKey),
    ]);

    assertReadModelCompanyKey({
      actualCompanyKey: checklist.companyKey,
      path: "checklist.companyKey",
      requestedCompanyKey: companyKey,
    });
    assertReadModelCompanyKey({
      actualCompanyKey: operatorReadiness.companyKey,
      path: "operatorReadiness.companyKey",
      requestedCompanyKey: companyKey,
    });
    assertReadModelCompanyKey({
      actualCompanyKey: acknowledgementReadiness.companyKey,
      path: "acknowledgementReadiness.companyKey",
      requestedCompanyKey: companyKey,
    });
    assertReadModelCompanyKey({
      actualCompanyKey: deliveryReadiness.companyKey,
      path: "deliveryReadiness.companyKey",
      requestedCompanyKey: companyKey,
    });

    return buildCloseControlReviewSummaryResult({
      acknowledgementReadiness,
      checklist,
      companyKey,
      deliveryReadiness,
      generatedAt: this.now().toISOString(),
      operatorReadiness,
    });
  }
}

type ReadModelCompanyKeyAssertion = {
  actualCompanyKey: string;
  path:
    | "checklist.companyKey"
    | "operatorReadiness.companyKey"
    | "acknowledgementReadiness.companyKey"
    | "deliveryReadiness.companyKey";
  requestedCompanyKey: string;
};

export class CloseControlReviewSummaryCompanyKeyMismatchError extends AppHttpError {
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
    this.name = "CloseControlReviewSummaryCompanyKeyMismatchError";
  }
}

function assertReadModelCompanyKey(input: ReadModelCompanyKeyAssertion) {
  if (input.actualCompanyKey !== input.requestedCompanyKey) {
    throw new CloseControlReviewSummaryCompanyKeyMismatchError(input);
  }
}
