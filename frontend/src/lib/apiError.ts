export interface ApiErrorDetails {
  status?: number;
  data?: unknown;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly data?: unknown;

  constructor(message: string, details: ApiErrorDetails = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = details.status;
    this.data = details.data;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error)) {
    const data = error.data as { error?: { message?: string } } | undefined;
    if (data?.error?.message) {
      return data.error.message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
