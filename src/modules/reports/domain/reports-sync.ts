export interface ReportAggregatePayload {
  report: Record<string, unknown>;
  basicData?: Record<string, unknown> | null;
  attachments?: Record<string, unknown>[];
  dynamicValues?: Record<string, unknown>[];
}

export interface SyncRecordChanges {
  created: unknown[];
  updated: unknown[];
  deleted: number[];
}

export interface ReportsPullChangesResponse {
  changes: {
    reports: SyncRecordChanges;
    basicData: SyncRecordChanges;
    reportDynamicValues: SyncRecordChanges;
    reportAttachments: SyncRecordChanges;
    reportFieldsConfig: SyncRecordChanges;
  };
  timestamp: number;
}

export interface ReportsPushChangesPayload {
  reports?: Record<string, unknown>[];
  basicData?: Record<string, unknown>[];
  reportDynamicValues?: Record<string, unknown>[];
  reportAttachments?: Record<string, unknown>[];
}
