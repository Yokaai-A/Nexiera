"use client";

import { useEffect, useMemo, useRef } from "react";

type CountUpNumberProps = {
  value: number;
  suffix?: string;
  decimals?: number;
};

export function CountUpNumber({ value, suffix = "", decimals = 0 }: CountUpNumberProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [decimals],
  );
  const finalValue = `${formatter.format(value)}${suffix}`;

  useEffect(() => {
    const element = numberRef.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frameId = 0;
    const duration = 700;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        let startTime: number | undefined;
        const animate = (time: number) => {
          startTime ??= time;
          const progress = Math.min((time - startTime) / duration, 1);
          const easedProgress = progress;
          element.textContent = `${formatter.format(value * easedProgress)}${suffix}`;

          if (progress < 1) {
            frameId = requestAnimationFrame(animate);
          } else {
            element.textContent = finalValue;
          }
        };

        frameId = requestAnimationFrame(animate);
      },
      { threshold: 0.4 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [finalValue, formatter, suffix, value]);

  return (
    <span ref={numberRef} className="tabular-nums" aria-label={finalValue}>
      {finalValue}
    </span>
  );
}
