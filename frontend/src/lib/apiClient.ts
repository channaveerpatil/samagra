import { appConfig } from '@/config/appConfig';
import { logger } from './logger';
import { ApiError } from './apiError';
import { publishApiError } from './apiErrorBus';

export type RequestBody = Record<string, unknown> | unknown[];

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return undefined;
  }

  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

async function request<TResponse>(
  method: string,
  path: string,
  body?: RequestBody,
  options: RequestOptions = {},
): Promise<TResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), appConfig.api.timeoutMs);

  const onExternalAbort = () => controller.abort();
  options.signal?.addEventListener('abort', onExternalAbort);

  let response: Response;
  try {
    response = await fetch(`${appConfig.api.baseUrl}${path}`, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (cause) {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', onExternalAbort);
    const error = new ApiError(
      controller.signal.aborted ? 'Request timed out' : 'Network request failed',
      {},
    );
    logger.error(`[apiClient] ${method} ${path} failed`, cause);
    publishApiError(error);
    throw error;
  }
  clearTimeout(timeout);
  options.signal?.removeEventListener('abort', onExternalAbort);

  const data = await parseResponseBody(response);

  if (!response.ok) {
    const error = new ApiError(`Request failed with status ${response.status}`, {
      status: response.status,
      data,
    });
    logger.error(`[apiClient] ${method} ${path} responded with ${response.status}`, data);
    publishApiError(error);
    throw error;
  }

  return data as TResponse;
}

export const apiClient = {
  get: <TResponse>(path: string, options?: RequestOptions) =>
    request<TResponse>('GET', path, undefined, options),
  post: <TResponse>(path: string, body?: RequestBody, options?: RequestOptions) =>
    request<TResponse>('POST', path, body, options),
  put: <TResponse>(path: string, body?: RequestBody, options?: RequestOptions) =>
    request<TResponse>('PUT', path, body, options),
  patch: <TResponse>(path: string, body?: RequestBody, options?: RequestOptions) =>
    request<TResponse>('PATCH', path, body, options),
  delete: <TResponse>(path: string, options?: RequestOptions) =>
    request<TResponse>('DELETE', path, undefined, options),
};
