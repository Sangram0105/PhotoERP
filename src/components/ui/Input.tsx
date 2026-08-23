import { useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  type = 'text',
  required,
  disabled,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      {/* Input Container */}
      <div
        className={clsx(
          'flex items-center rounded-xl border bg-white transition-all duration-200',
          error
            ? 'border-red-500 focus-within:border-red-500'
            : 'border-slate-300 focus-within:border-blue-500',
          disabled && 'cursor-not-allowed bg-slate-100',
        )}
      >
        {/* Left Icon */}
        {leftIcon && (
          <div className="pl-4 text-slate-400">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          type={isPassword && showPassword ? 'text' : type}
          disabled={disabled}
          className={clsx(
            'w-full bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400',
            className,
          )}
          {...props}
        />

        {/* Password Toggle */}
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-4 text-slate-500 hover:text-slate-700"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        ) : (
          rightIcon && (
            <div className="pr-4 text-slate-400">
              {rightIcon}
            </div>
          )
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}

      {/* Helper Text */}
      {!error && helperText && (
        <p className="mt-2 text-sm text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
