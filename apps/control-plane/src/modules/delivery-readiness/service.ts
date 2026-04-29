import type {
  CloseControlAcknowledgementServicePort,
  OperatorReadinessServicePort,
} from "../../lib/types";
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

    return buildDeliveryReadinessResult({
      acknowledgementReadiness,
      companyKey,
      generatedAt: this.now().toISOString(),
      operatorReadiness,
    });
  }
}
