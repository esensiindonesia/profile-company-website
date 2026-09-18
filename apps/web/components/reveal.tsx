"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

const REVEAL_ROOT_MARGIN = "0px 0px -8% 0px";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

type RevealStyle = CSSProperties & {
  "--reveal-delay"?: string;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsVisible(true);
        observer.unobserve(element);
      },
      { rootMargin: REVEAL_ROOT_MARGIN, threshold: 0.1 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style: RevealStyle = {
    "--reveal-delay": `${delay}ms`,
  };

  return (
    <div
      ref={elementRef}
      data-reveal={isVisible ? "visible" : "hidden"}
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}
