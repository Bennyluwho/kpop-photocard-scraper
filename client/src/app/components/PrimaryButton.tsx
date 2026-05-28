import type { ButtonHTMLAttributes } from 'react';

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({ className = '', type = 'button', ...props }: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
