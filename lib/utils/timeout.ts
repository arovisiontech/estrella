/**
 * Helper to ensure async queries never freeze or hang UI transitions.
 * Returns the fallback value if the query exceeds the timeout threshold.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  fallbackValue: T,
  timeoutMs: number = 1000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallbackValue), timeoutMs)),
  ]);
}
