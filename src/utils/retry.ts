type RetryOptions = {
  retries?: number;
  baseDelayMs?: number;
  factor?: number;
  onRetry?: (attempt: number, error: unknown) => void;
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isRetryable = (error: unknown) => {
  const message = (error as { message?: string })?.message?.toLowerCase?.() ?? '';
  const code = (error as { code?: string })?.code?.toLowerCase?.();
  return (
    message.includes('timeout') ||
    message.includes('network error') ||
    code === 'ecconnaborted' ||
    code === 'enotfound' ||
    code === 'etimedout'
  );
};

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  {
    retries = 3,
    baseDelayMs = 500,
    factor = 2,
    onRetry,
  }: RetryOptions = {},
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt >= retries || !isRetryable(err)) {
        break;
      }
      onRetry?.(attempt, err);
      const backoff = baseDelayMs * Math.pow(factor, attempt - 1);
      await wait(backoff);
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Gagal setelah retry');
}
