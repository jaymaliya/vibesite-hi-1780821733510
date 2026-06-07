"use client";
import { useEffect, useRef } from "react";

export function useScrollReveal(threshold = 0.08) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Above-fold elements become visible immediately; below-fold animate in
    if (el.getBoundingClientRect().top <= window.innerHeight) {
      el.classList.add("visible");
      return;
    }
    el.classList.add("will-reveal");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("will-reveal");
          entry.target.classList.add("visible");
          observer.disconnect(); // permanently visible — never goes blank again
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}