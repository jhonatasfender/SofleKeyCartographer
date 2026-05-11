import React from "react";

type AppLayoutProps = {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
};

export function AppLayout({ children, headerRight }: AppLayoutProps) {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950">
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/60 backdrop-blur-sm bg-neutral-900/40 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-primary shadow-[0_0_16px_theme(colors.primary)]" />
          <span className="font-semibold tracking-tight">
            SofleKeyCartographer
          </span>
        </div>
        <div className="flex items-center gap-3">{headerRight}</div>
      </header>
      <main className="px-4 sm:px-6 md:px-8 py-6">{children}</main>
      <footer className="px-6 py-6 text-sm opacity-70 border-t border-neutral-800/60">
        <span>© {new Date().getFullYear()} SofleKeyCartographer</span>
      </footer>
    </div>
  );
}
