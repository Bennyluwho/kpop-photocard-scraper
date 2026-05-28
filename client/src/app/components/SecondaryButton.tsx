import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type SecondaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
type SecondaryLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const secondaryClasses =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

export function SecondaryButton({ className = '', type = 'button', ...props }: SecondaryButtonProps) {
  return (
    <button
      type={type}
      className={`${secondaryClasses} ${className}`}
      {...props}
    />
  );
}

export function SecondaryLink({ className = '', ...props }: SecondaryLinkProps) {
  return <a className={`${secondaryClasses} ${className}`} {...props} />;
}
