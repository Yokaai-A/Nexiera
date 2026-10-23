"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";

function ScrollToTopOnNavigation() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [lenis, pathname]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        anchors: true,
        lerp: 0.22,
        duration: 0.65,
        smoothWheel: true,
        syncTouch: false,
        respectReducedMotion: true,
      }}
    >
      <ScrollToTopOnNavigation />
      {children}
    </ReactLenis>
  );
}
