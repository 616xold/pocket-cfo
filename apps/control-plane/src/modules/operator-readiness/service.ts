import type {
  CloseControlServicePort,
  MonitoringServicePort,
} from "../../lib/types";
import { buildOperatorReadinessResult } from "./formatter";

type OperatorReadinessMonitoringReader = Pick<
  MonitoringServicePort,
  | "getLatestCashPostureMonitorResult"
  | "getLatestCollectionsPressureMonitorResult"
  | "getLatestPayablesPressureMonitorResult"
  | "getLatestPolicyCovenantThresholdMonitorResult"
>;

type OperatorReadinessServiceDeps = {
  closeControlService: Pick<CloseControlServicePort, "getChecklist">;
  monitoringService: OperatorReadinessMonitoringReader;
  now?: () => Date;
};

export class OperatorReadinessService {
  private readonly now: () => Date;

  constructor(private readonly deps: OperatorReadinessServiceDeps) {
    this.now = deps.now ?? (() => new Date());
  }

  async getReadiness(companyKey: string) {
    const [
      cashPosture,
      collectionsPressure,
      payablesPressure,
      policyCovenantThreshold,
      checklist,
    ] = await Promise.all([
      this.deps.monitoringService.getLatestCashPostureMonitorResult(companyKey),
      this.deps.monitoringService.getLatestCollectionsPressureMonitorResult(
        companyKey,
      ),
      this.deps.monitoringService.getLatestPayablesPressureMonitorResult(
        companyKey,
      ),
      this.deps.monitoringService.getLatestPolicyCovenantThresholdMonitorResult(
        companyKey,
      ),
      this.deps.closeControlService.getChecklist(companyKey),
    ]);

    return buildOperatorReadinessResult({
      checklist,
      companyKey,
      generatedAt: this.now().toISOString(),
      latestMonitorResults: [
        cashPosture,
        collectionsPressure,
        payablesPressure,
        policyCovenantThreshold,
      ],
    });
  }
}
