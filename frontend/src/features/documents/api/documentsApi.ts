import { apiClient } from '@/lib/apiClient';
import { appConfig } from '@/config/appConfig';
import { ApiError } from '@/lib/apiError';
import type { DocumentFile } from '../types';

const BASE_PATH = '/documents';

export interface DownloadedDocumentFile {
  blob: Blob;
  fileName: string;
}

export const documentsQueryKeys = {
  all: ['documents'] as const,
  lists: () => [...documentsQueryKeys.all, 'list'] as const,
};

export const documentsApi = {
  list(): Promise<DocumentFile[]> {
    return apiClient.get<DocumentFile[]>(BASE_PATH);
  },

  // Uses XMLHttpRequest instead of the shared fetch-based apiClient so upload
  // progress can be reported back to the caller; fetch has no upload
  // progress event.
  upload(file: File, onProgress?: (percent: number) => void): Promise<DocumentFile> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${appConfig.api.baseUrl}${BASE_PATH}`);
      xhr.withCredentials = true;

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      });

      xhr.addEventListener('load', () => {
        let data: unknown;
        try {
          data = xhr.responseText ? JSON.parse(xhr.responseText) : undefined;
        } catch {
          data = undefined;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data as DocumentFile);
        } else {
          const message =
            (data as { error?: { message?: string } } | undefined)?.error?.message ??
            'Failed to upload document';
          reject(new ApiError(message, { status: xhr.status, data }));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new ApiError('Network request failed', {}));
      });

      xhr.send(formData);
    });
  },

  async download(id: string): Promise<DownloadedDocumentFile> {
    const response = await fetch(`${appConfig.api.baseUrl}${BASE_PATH}/${id}/download`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new ApiError('Failed to download document', { status: response.status });
    }

    const disposition = response.headers.get('content-disposition') ?? '';
    const fileNameMatch = /filename="?([^"]+)"?/i.exec(disposition);
    const fileName = fileNameMatch?.[1] ?? `document-${id}`;

    return { blob: await response.blob(), fileName };
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<void>(`${BASE_PATH}/${id}`);
  },
};
