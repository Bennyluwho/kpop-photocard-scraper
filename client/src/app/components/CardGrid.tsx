import type { ReactNode } from 'react';

type CardGridVariant = 'cards' | 'groups';

interface CardGridProps {
  children: ReactNode;
  variant?: CardGridVariant;
  isLoading?: boolean;
}

const gridColumns: Record<CardGridVariant, string> = {
  cards: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  groups: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
};

export function CardGrid({ children, variant = 'cards', isLoading = false }: CardGridProps) {
  return (
    <div
      className={`grid gap-4 transition-opacity duration-200 ${gridColumns[variant]} ${
        isLoading ? 'opacity-70' : 'opacity-100'
      }`}
      aria-busy={isLoading}
    >
      {children}
    </div>
  );
}
