import { useState, useEffect } from "react";
// custom hook to debounce the number input when filtering between values
export const useDebouncedCallback = (func, delay) => {
  const [debouncedCallback, setDebouncedCallback] = useState(() => {});

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => func);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [func, delay]);

  return debouncedCallback;
};
