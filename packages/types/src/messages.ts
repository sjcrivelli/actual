import type { Timestamp } from './index';

export interface Message {
  dataset: string;
  row: string;
  column: string;
  value: number;
  timestamp: Timestamp | null;
}
