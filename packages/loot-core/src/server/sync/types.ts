/**
 * 🧠 Sync Types — ActualFork A+ Edition
 * -------------------------------------
 * Strong typing for all sync operations.
 */

export interface SyncConfig {
  /** Conflict resolution strategy */
  conflictResolution?: 'local-wins' | 'remote-wins' | 'latest';
  /** Applies a resolved record to the local datastore */
  applyRecord: (record: any) => Promise<void>;
  /** If true, schedules recurring syncs */
  autoSchedule?: boolean;
}

export interface SyncMessage {
  id: string;
  data: any;
  updated: string; // ISO timestamp
}

export interface SyncDiff {
  /** Items that exist locally but not remotely */
  new: Array<SyncMessage>;
  /** Items that exist in both but differ */
  updated: Array<{
    id: string;
    local: SyncMessage;
    remote: SyncMessage;
  }>;
}

export interface ReconcileResult {
  status: 'ok' | 'failed';
  conflictsResolved: number;
  timestamp: string;
}
