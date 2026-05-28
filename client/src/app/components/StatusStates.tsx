import type { ReactNode } from 'react';
import { AlertTriangle, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode;
}

interface ErrorStateProps {
  message: string;
  serverHint?: boolean;
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm">
          <Inbox className="h-5 w-5" />
        </div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{message}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}

export function ErrorState({ message, serverHint = true }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{message}{serverHint ? '. Make sure the API server is running on port 5000.' : ''}</p>
      </div>
    </div>
  );
}

export function CardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="aspect-[3/4] animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-3 w-32 animate-pulse rounded bg-muted" />
        <div className="border-t border-border pt-3">
          <div className="mb-2 flex justify-between">
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            <div className="h-3 w-10 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-14 animate-pulse rounded bg-muted" />
            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(280px,420px)_1fr]">
      <div className="aspect-[3/4] animate-pulse rounded-lg bg-muted" />
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 w-56 animate-pulse rounded bg-muted" />
          <div className="h-5 w-72 max-w-full animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-border bg-card p-4">
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="mt-3 h-6 w-20 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-10 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
