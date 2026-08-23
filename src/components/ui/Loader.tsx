import clsx from 'clsx';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const Loader = ({
  size = 'md',
  text,
  fullScreen = false,
}: LoaderProps) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={clsx(
          'animate-spin rounded-full border-4 border-blue-600 border-t-transparent',
          {
            'h-5 w-5': size === 'sm',
            'h-8 w-8': size === 'md',
            'h-12 w-12': size === 'lg',
          }
        )}
      />

      {text && (
        <p className="text-sm text-slate-500">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;