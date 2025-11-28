'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'destructive' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-primary text-primary-foreground 
    hover:bg-primary-hover 
    focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
    shadow-sm hover:shadow-md
  `,
  secondary: `
    bg-secondary text-secondary-foreground 
    hover:bg-secondary-hover 
    focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2
  `,
  accent: `
    bg-accent text-accent-foreground 
    hover:bg-accent-hover 
    focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
    shadow-sm hover:shadow-md
  `,
  destructive: `
    bg-destructive text-destructive-foreground 
    hover:bg-destructive-hover 
    focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2
    shadow-sm hover:shadow-md
  `,
  ghost: `
    bg-transparent text-foreground 
    hover:bg-secondary 
    focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
  `,
  outline: `
    bg-transparent text-foreground 
    border-2 border-border 
    hover:bg-secondary hover:border-primary
    focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center font-medium
          rounded-[var(--radius-md)]
          transition-all duration-[var(--transition-fast)]
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;


