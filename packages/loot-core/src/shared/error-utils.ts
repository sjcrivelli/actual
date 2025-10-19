export function getError(e: unknown): Error {
  if (e instanceof Error) return e;
  return new Error(typeof e === 'string' ? e : JSON.stringify(e));
}

export function getErrorMessage(e: unknown): string {
  return getError(e).message;
}
