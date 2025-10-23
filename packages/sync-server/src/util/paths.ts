import { join, resolve } from 'node:path';

import { config } from '../load-config.js';

export function getPathForUserFile(fileId: string): string {
  const userFiles = config.get('userFiles');
  if (typeof userFiles !== 'string') {
    throw new Error("config.get('userFiles') did not return a string");
  }
  return join(resolve(userFiles), `file-${fileId}.blob`);
}

export function getPathForGroupFile(groupId: string): string {
  const userFiles = config.get('userFiles');
  if (typeof userFiles !== 'string') {
    throw new Error("config.get('userFiles') did not return a string");
  }
  return join(resolve(userFiles), `group-${groupId}.sqlite`);
}
