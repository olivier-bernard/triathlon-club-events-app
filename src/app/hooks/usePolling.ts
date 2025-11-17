import { useEffect, useRef } from "react";

export function usePolling(callback: () => void, interval: number) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (!document.hidden) {
        savedCallback.current();
      }
    }
    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval]);
}