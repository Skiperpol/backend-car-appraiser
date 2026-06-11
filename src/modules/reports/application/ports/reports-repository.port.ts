import type {
  ReportAggregatePayload,
  ReportsPullChangesResponse,
  ReportsPushChangesPayload,
} from '../../domain/reports-sync';

export interface ReportsRepositoryPort {
  create(payload: Record<string, unknown>): Promise<unknown>;
  findAll(): Promise<unknown[]>;
  findById(id: number): Promise<unknown | null>;
  update(id: number, payload: Record<string, unknown>): Promise<unknown | null>;
  delete(id: number): Promise<boolean>;
  getFieldsConfig(): Promise<unknown[]>;
  getAggregateByReportId(id: number): Promise<unknown | null>;
  upsertAggregateByReportId(
    id: number,
    payload: ReportAggregatePayload,
    authUserId?: number,
  ): Promise<unknown>;
  pullChanges(lastPulledAt?: number): Promise<ReportsPullChangesResponse>;
  pushChanges(payload: ReportsPushChangesPayload): Promise<void>;
}

export const REPORTS_REPOSITORY = Symbol('REPORTS_REPOSITORY');
