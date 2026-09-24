import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import { getApiErrorMessage } from '@/lib/apiError';
import { documentsApi, documentsQueryKeys } from '../api/documentsApi';

export default function useUploadDocument() {
  const { notify } = useNotification();
  const queryClient = useQueryClient();
  const [progress, setProgress] = React.useState(0);

  const mutation = useMutation({
    mutationFn: (file: File) => {
      setProgress(0);
      return documentsApi.upload(file, setProgress);
    },
    onSuccess: async (document) => {
      await queryClient.invalidateQueries({ queryKey: documentsQueryKeys.lists() });
      notify({ message: `${document.originalName} was uploaded`, severity: 'success' });
    },
    onError: (error) => {
      notify({ message: getApiErrorMessage(error, 'Failed to upload document'), severity: 'error' });
    },
    onSettled: () => setProgress(0),
  });

  const uploadDocument = React.useCallback(
    (file: File) => mutation.mutateAsync(file),
    [mutation],
  );

  return {
    uploadDocument,
    isUploading: mutation.isPending,
    progress,
  };
}
