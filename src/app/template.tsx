export default function Template({ children }: LayoutProps<"/">) {
  return <div className="page-transition flex min-h-full flex-1 flex-col">{children}</div>;
}
