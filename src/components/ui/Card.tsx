import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  padding?: boolean;
  hover?: boolean;
}

const Card = ({
  children,
  title,
  subtitle,
  padding = true,
  hover = false,
  className,
  ...props
}: CardProps) => {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-slate-200 bg-white shadow-sm',
        {
          'p-6': padding,
          'transition-all duration-200 hover:shadow-md': hover,
        },
        className,
      )}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-5">
          {title && (
            <h2 className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

export default Card;