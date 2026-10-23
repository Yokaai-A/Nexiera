import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-transition flex min-h-full flex-1 flex-col">{children}</div>;
}
