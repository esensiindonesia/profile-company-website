"use client";

import { useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/reveal";

const COUNT_DURATION = 1200;

const STATS = [
  { value: 15, suffix: "+", label: "Years of Experience" },
  { value: 100, suffix: "+", label: "Satisfied Clients" },
  { value: 800, suffix: "+", label: "Professional Employees" },
  { value: 50, suffix: "+", label: "Indonesian Districts Covered" },
];

type CountUpProps = {
  value: number;
  suffix: string;
};

function CountUp({ value, suffix }: CountUpProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let animationFrameId: number | null = null;
    let hasStarted = false;

    const animate = () => {
      if (hasStarted) return;
      hasStarted = true;

      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("requestAnimationFrame" in window)
      ) {
        setCount(value);
        return;
      }

      const startTime = performance.now();
      const updateCount = (currentTime: number) => {
        const progress = Math.min(
          (currentTime - startTime) / COUNT_DURATION,
          1,
        );
        const easedProgress = 1 - (1 - progress) ** 3;

        setCount(Math.round(value * easedProgress));

        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(updateCount);
        }
      };

      animationFrameId = window.requestAnimationFrame(updateCount);
    };

    const cancelAnimation = () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };

    if (!("IntersectionObserver" in window)) {
      animate();
      return cancelAnimation;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        animate();
        observer.unobserve(element);
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimation();
    };
  }, [value]);

  return (
    <span ref={elementRef}>
      {count}
      {suffix}
    </span>
  );
}

export function Statistics() {
  return (
    <section className="flex items-center bg-golden py-12 md:py-16 min-[1920px]:h-[270px] min-[1920px]:py-0">
      <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-12 min-[1920px]:px-24">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6 min-[1920px]:gap-10">
          {STATS.map((stat, index) => (
            <Reveal key={stat.value} delay={index * 80}>
              <div className="flex flex-col items-center gap-1 text-center md:gap-2 min-[1920px]:gap-3">
                <span className="font-display text-3xl font-bold leading-[110%] text-white md:text-4xl min-[1920px]:text-5xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="font-display text-sm font-medium text-white md:text-base min-[1920px]:text-xl">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
