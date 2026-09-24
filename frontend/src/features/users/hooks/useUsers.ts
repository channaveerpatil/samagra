import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import { logger } from '@/lib/logger';
import { usersApi, usersQueryKeys } from '../api/usersApi';
import type { UserInput } from '../types';

export default function useUsers() {
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: usersQueryKeys.lists(),
    queryFn: usersApi.list,
  });

  React.useEffect(() => {
    if (error) {
      logger.error('[useUsers] Failed to load users', error);
      notify({ message: 'Failed to load users', severity: 'error' });
    }
  }, [error, notify]);

  const invalidateUsers = React.useCallback(
    () => queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() }),
    [queryClient],
  );

  const createMutation = useMutation({
    mutationFn: (input: UserInput) => usersApi.create(input),
    onSuccess: async (created) => {
      await invalidateUsers();
      notify({ message: `${created.firstName} ${created.lastName} was added`, severity: 'success' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UserInput }) => usersApi.update(id, input),
    onSuccess: async (updated) => {
      await invalidateUsers();
      notify({ message: `${updated.firstName} ${updated.lastName} was updated`, severity: 'success' });
    },
  });

  const createUser = React.useCallback(
    (input: UserInput) => createMutation.mutateAsync(input),
    [createMutation],
  );

  const updateUser = React.useCallback(
    (id: string, input: UserInput) => updateMutation.mutateAsync({ id, input }),
    [updateMutation],
  );

  return {
    users,
    isLoading,
    createUser,
    updateUser,
  };
}
