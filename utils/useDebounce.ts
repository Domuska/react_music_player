import { useEffect, useMemo, useRef } from "react";

function debounce<T extends (...args: any[]) => void>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, waitMs);
  };
}

// inspiration from
// https://www.developerway.com/posts/debouncing-in-react

export const useDebounce = (callback: () => any, timeMs: number) => {
  const ref = useRef<() => void>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, timeMs);
  }, [timeMs]);

  return debouncedCallback;
};
