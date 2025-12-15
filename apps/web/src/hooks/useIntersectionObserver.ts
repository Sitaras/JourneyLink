"use client";

import { useEffect, useRef } from "react";

const useIntersectionObserver = (callback?: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        callback?.();
      }
    });

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [callback]);

  return ref;
};

export default useIntersectionObserver;
