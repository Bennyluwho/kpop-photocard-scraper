import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-xl font-semibold tracking-normal sm:text-2xl">{title}</h2>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
