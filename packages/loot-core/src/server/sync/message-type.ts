// TypeScript type for the protobuf Message class from @actual-app/crdt
// This avoids type/value collision in consumer code

export type MessageType = {
  dataset: string;
  row: string;
  column: string;
  value: string;
  // timestamp is used in many places, but not present in the protobuf Message directly
  // so we make it optional for compatibility
  timestamp?: unknown;
  old?: boolean;
  [key: string]: unknown;
};
