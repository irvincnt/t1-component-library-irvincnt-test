'use client';

import { InputHTMLAttributes, forwardRef, useState, useId } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-5 py-3.5 text-lg',
};

const iconSizeStyles: Record<InputSize, string> = {
  sm: 'pl-9',
  md: 'pl-11',
  lg: 'pl-12',
};

const rightIconSizeStyles: Record<InputSize, string> = {
  sm: 'pr-9',
  md: 'pr-11',
  lg: 'pr-12',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={`
              block mb-2 font-medium text-sm
              transition-colors duration-[var(--transition-fast)]
              ${error ? 'text-destructive' : isFocused ? 'text-primary' : 'text-foreground'}
            `}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span
              className={`
                absolute left-3 top-1/2 -translate-y-1/2
                text-muted-foreground
                transition-colors duration-[var(--transition-fast)]
                ${isFocused ? 'text-primary' : ''}
                ${error ? 'text-destructive' : ''}
              `}
            >
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              w-full
              bg-card text-foreground
              border-2 rounded-[var(--radius-md)]
              placeholder:text-muted-foreground
              transition-all duration-[var(--transition-fast)]
              ${sizeStyles[size]}
              ${leftIcon ? iconSizeStyles[size] : ''}
              ${rightIcon ? rightIconSizeStyles[size] : ''}
              ${
                error
                  ? 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20'
                  : 'border-input focus:border-input-focus focus:ring-2 focus:ring-primary/20'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed bg-muted' : ''}
              outline-none
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <span
              className={`
                absolute right-3 top-1/2 -translate-y-1/2
                text-muted-foreground
                transition-colors duration-[var(--transition-fast)]
                ${isFocused ? 'text-primary' : ''}
                ${error ? 'text-destructive' : ''}
              `}
            >
              {rightIcon}
            </span>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={`
              mt-1.5 text-sm
              ${error ? 'text-destructive' : 'text-muted-foreground'}
            `}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;


