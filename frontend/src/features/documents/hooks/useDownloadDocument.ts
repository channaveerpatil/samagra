import { useMutation } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import { getApiErrorMessage } from '@/lib/apiError';
import { documentsApi } from '../api/documentsApi';
import { saveBlobAsFile } from '../utils/saveBlobAsFile';

export default function useDownloadDocument() {
  const { notify } = useNotification();

  return useMutation({
    mutationFn: async (id: string) => {
      const file = await documentsApi.download(id);
      saveBlobAsFile(file.blob, file.fileName);
      return file;
    },
    onError: (error) => {
      notify({ message: getApiErrorMessage(error, 'Failed to download document'), severity: 'error' });
    },
  });
}
