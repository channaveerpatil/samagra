import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import { logger } from '@/lib/logger';
import { getApiErrorMessage } from '@/lib/apiError';
import { documentsApi, documentsQueryKeys } from '../api/documentsApi';
import type { DocumentFile } from '../types';

export default function useDocuments() {
  const { notify } = useNotification();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');

  const {
    data: documents = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: documentsQueryKeys.lists(),
    queryFn: documentsApi.list,
  });

  React.useEffect(() => {
    if (error) {
      logger.error('[useDocuments] Failed to load documents', error);
      notify({ message: 'Failed to load documents', severity: 'error' });
    }
  }, [error, notify]);

  const filteredDocuments = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return documents;
    return documents.filter((document) => document.originalName.toLowerCase().includes(term));
  }, [documents, searchTerm]);

  const invalidateDocuments = React.useCallback(
    () => queryClient.invalidateQueries({ queryKey: documentsQueryKeys.lists() }),
    [queryClient],
  );

  const deleteMutation = useMutation({
    mutationFn: (document: DocumentFile) => documentsApi.remove(document.id),
    onSuccess: async (_result, document) => {
      await invalidateDocuments();
      notify({ message: `${document.originalName} was deleted`, severity: 'info' });
    },
    onError: (deleteError) => {
      notify({
        message: getApiErrorMessage(deleteError, 'Failed to delete document'),
        severity: 'error',
      });
    },
  });

  const deleteDocument = React.useCallback(
    (document: DocumentFile) => deleteMutation.mutateAsync(document),
    [deleteMutation],
  );

  return {
    documents: filteredDocuments,
    allDocuments: documents,
    isLoading,
    searchTerm,
    setSearchTerm,
    deleteDocument,
    isDeletingId: deleteMutation.isPending ? deleteMutation.variables?.id : undefined,
    refresh: refetch,
    invalidateDocuments,
  };
}
