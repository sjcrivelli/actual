import type { UUID, Timestamp } from './index';

export interface BaseEntity {
  id: UUID;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface PayeeEntity extends BaseEntity {
  name: string;
}

export interface ScheduleEntity extends BaseEntity {
  name: string;
  nextRun: Timestamp;
}
