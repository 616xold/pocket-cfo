import type {
  CloseControlServicePort,
  OperatorReadinessServicePort,
} from "../../lib/types";
import { buildCloseControlAcknowledgementReadinessResult } from "./formatter";

type CloseControlAcknowledgementServiceDeps = {
  closeControlService: Pick<CloseControlServicePort, "getChecklist">;
  operatorReadinessService: Pick<OperatorReadinessServicePort, "getReadiness">;
  now?: () => Date;
};

export class CloseControlAcknowledgementService {
  private readonly now: () => Date;

  constructor(private readonly deps: CloseControlAcknowledgementServiceDeps) {
    this.now = deps.now ?? (() => new Date());
  }

  async getAcknowledgementReadiness(companyKey: string) {
    const [checklist, readiness] = await Promise.all([
      this.deps.closeControlService.getChecklist(companyKey),
      this.deps.operatorReadinessService.getReadiness(companyKey),
    ]);

    return buildCloseControlAcknowledgementReadinessResult({
      checklist,
      companyKey,
      generatedAt: this.now().toISOString(),
      readiness,
    });
  }
}
