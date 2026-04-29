import type {
  CloseControlAcknowledgementServicePort,
  OperatorReadinessServicePort,
} from "../../lib/types";
import { AppHttpError } from "../../lib/http-errors";
import { buildDeliveryReadinessResult } from "./formatter";

type DeliveryReadinessServiceDeps = {
  closeControlAcknowledgementService: Pick<
    CloseControlAcknowledgementServicePort,
    "getAcknowledgementReadiness"
  >;
  operatorReadinessService: Pick<OperatorReadinessServicePort, "getReadiness">;
  now?: () => Date;
};

export class DeliveryReadinessService {
  private readonly now: () => Date;

  constructor(private readonly deps: DeliveryReadinessServiceDeps) {
    this.now = deps.now ?? (() => new Date());
  }

  async getDeliveryReadiness(companyKey: string) {
    const [operatorReadiness, acknowledgementReadiness] = await Promise.all([
      this.deps.operatorReadinessService.getReadiness(companyKey),
      this.deps.closeControlAcknowledgementService.getAcknowledgementReadiness(
        companyKey,
      ),
    ]);

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

    return buildDeliveryReadinessResult({
      acknowledgementReadiness,
      companyKey,
      generatedAt: this.now().toISOString(),
      operatorReadiness,
    });
  }
}

type ReadModelCompanyKeyAssertion = {
  actualCompanyKey: string;
  path: "operatorReadiness.companyKey" | "acknowledgementReadiness.companyKey";
  requestedCompanyKey: string;
};

export class DeliveryReadinessCompanyKeyMismatchError extends AppHttpError {
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
    this.name = "DeliveryReadinessCompanyKeyMismatchError";
  }
}

function assertReadModelCompanyKey(input: ReadModelCompanyKeyAssertion) {
  if (input.actualCompanyKey !== input.requestedCompanyKey) {
    throw new DeliveryReadinessCompanyKeyMismatchError(input);
  }
}
