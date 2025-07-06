import { useCallback, useState } from "react";

export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  return useCallback(
    (...args: Parameters<T>) => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      const timeout = setTimeout(() => {
        callback(...args);
      }, delay);
      setDebounceTimeout(timeout);
    },
    [callback, delay, debounceTimeout]
  );
};
