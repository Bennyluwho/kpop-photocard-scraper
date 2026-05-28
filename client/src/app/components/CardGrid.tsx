import type { ReactNode } from 'react';

type CardGridVariant = 'cards' | 'groups';

interface CardGridProps {
  children: ReactNode;
  variant?: CardGridVariant;
  isLoading?: boolean;
}

const gridColumns: Record<CardGridVariant, string> = {
  cards: 'grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]',
  groups: 'grid-cols-[repeat(auto-fill,minmax(140px,1fr))] lg:grid-cols-6',
};

export function CardGrid({ children, variant = 'cards', isLoading = false }: CardGridProps) {
  return (
    <div
      className={`grid gap-4 sm:gap-5 transition-opacity duration-200 ${gridColumns[variant]} ${
        isLoading ? 'opacity-70' : 'opacity-100'
      }`}
      aria-busy={isLoading}
    >
      {children}
    </div>
  );
}
