import { useEffect, useRef } from 'react';

const useIntersectionObserver = (callback?: () => void) => {
  const ref = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(callback);

  // Always keep callbackRef up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        callbackRef.current?.();
      }
    });

    const element = ref.current;
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return ref;
};

export default useIntersectionObserver;
