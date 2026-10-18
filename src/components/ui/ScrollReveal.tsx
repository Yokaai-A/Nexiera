"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
  type ElementType,
} from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number; // delay in milliseconds
  duration?: number; // duration in milliseconds
  y?: number; // translateY distance in px (default: 24)
  x?: number; // translateX distance in px (default: 0)
  className?: string;
  threshold?: number;
  once?: boolean;
  immediate?: boolean; // triggers immediately on mount (ideal for Hero entrance)
  as?: ElementType;
  style?: CSSProperties;
}

export function Reveal({
  children,
  delay = 0,
  duration = 600,
  y = 20,
  x = 0,
  className = "",
  threshold = 0.15,
  once = true,
  immediate = false,
  as: Component = "div",
  style = {},
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    if (immediate) {
      const frame = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const node = ref.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [threshold, once, immediate]);

  const transformStyle = isVisible
    ? "translate3d(0, 0, 0)"
    : `translate3d(${x}px, ${y}px, 0)`;

  return (
    <Component
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: transformStyle,
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Component>
  );
}

interface StaggerContextType {
  isVisible: boolean;
  baseDelay: number;
  staggerInterval: number;
}

const StaggerContext = createContext<StaggerContextType>({
  isVisible: false,
  baseDelay: 0,
  staggerInterval: 80,
});

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  baseDelay?: number;
  staggerInterval?: number;
  threshold?: number;
  once?: boolean;
  immediate?: boolean;
  as?: ElementType;
  style?: CSSProperties;
}

export function StaggerContainer({
  children,
  className = "",
  baseDelay = 0,
  staggerInterval = 80,
  threshold = 0.12,
  once = true,
  immediate = false,
  as: Component = "div",
  style = {},
}: StaggerContainerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    if (immediate) {
      const frame = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const node = ref.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [threshold, once, immediate]);

  return (
    <StaggerContext.Provider value={{ isVisible, baseDelay, staggerInterval }}>
      <Component ref={ref} className={className} style={style}>
        {children}
      </Component>
    </StaggerContext.Provider>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  index?: number;
  className?: string;
  y?: number;
  x?: number;
  duration?: number;
  as?: ElementType;
  style?: CSSProperties;
}

export function StaggerItem({
  children,
  index = 0,
  className = "",
  y = 20,
  x = 0,
  duration = 550,
  as: Component = "div",
  style = {},
}: StaggerItemProps) {
  const { isVisible, baseDelay, staggerInterval } = useContext(StaggerContext);
  const delay = baseDelay + index * staggerInterval;

  const transformStyle = isVisible
    ? "translate3d(0, 0, 0)"
    : `translate3d(${x}px, ${y}px, 0)`;

  return (
    <Component
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: transformStyle,
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Component>
  );
}
