import { useMutation } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import { reportsApi } from '../api/reportsApi';
import { saveBlobAsFile } from '../utils/saveBlobAsFile';

export default function useDownloadReport() {
  const { notify } = useNotification();

  return useMutation({
    mutationFn: async (id: string) => {
      const file = await reportsApi.downloadReport(id);
      saveBlobAsFile(file.blob, file.fileName);
      return file;
    },
    onError: () => {
      notify({ message: 'Failed to download report', severity: 'error' });
    },
  });
}
