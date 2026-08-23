import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?:
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'secondary';
}

const Badge = ({
  children,
  variant = 'primary',
  className,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',

        {
          'bg-blue-100 text-blue-700': variant === 'primary',

          'bg-green-100 text-green-700':
            variant === 'success',

          'bg-yellow-100 text-yellow-700':
            variant === 'warning',

          'bg-red-100 text-red-700':
            variant === 'danger',

          'bg-slate-100 text-slate-700':
            variant === 'secondary',
        },

        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;