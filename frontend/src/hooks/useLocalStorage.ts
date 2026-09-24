import * as React from 'react';
import { logger } from '@/lib/logger';

type SetValue<T> = (value: T | ((previous: T) => T)) => void;

export default function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      logger.warn(`[useLocalStorage] Failed to read key "${key}"`, error);
      return initialValue;
    }
  });

  const setValue = React.useCallback<SetValue<T>>(
    (value) => {
      setStoredValue((previous) => {
        const nextValue = value instanceof Function ? value(previous) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        } catch (error) {
          logger.warn(`[useLocalStorage] Failed to write key "${key}"`, error);
        }
        return nextValue;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
