export function Container({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 container mx-auto px-4 py-4 max-w-[900px]">{children}</div>;
}
