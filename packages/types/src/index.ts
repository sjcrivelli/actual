export type UUID = string;
export type Timestamp = string;

export * from './messages';
export * from './models';

export interface BaseEntity {
  id: UUID;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
