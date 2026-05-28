import type { ButtonHTMLAttributes } from 'react';

type SecondaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function SecondaryButton({ className = '', type = 'button', ...props }: SecondaryButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
