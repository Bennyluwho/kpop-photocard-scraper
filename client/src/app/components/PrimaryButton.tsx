import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
type PrimaryLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const primaryClasses =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

export function PrimaryButton({ className = '', type = 'button', ...props }: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={`${primaryClasses} ${className}`}
      {...props}
    />
  );
}

export function PrimaryLink({ className = '', ...props }: PrimaryLinkProps) {
  return <a className={`${primaryClasses} ${className}`} {...props} />;
}
