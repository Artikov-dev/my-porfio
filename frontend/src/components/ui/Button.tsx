import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/useSound';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'solid', isLoading, children, disabled, onMouseEnter, onClick, ...props }, ref) => {
    const { playHover, playClick } = useSound();
    const baseStyles = 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md cursor-pointer';
    
    const variants = {
      solid: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-lg shadow-primary/30',
      outline: 'border border-border text-white hover:bg-white/5 focus:ring-white/20',
      ghost: 'text-white hover:bg-white/10 focus:ring-white/20'
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        disabled={isLoading || disabled}
        onMouseEnter={(e) => {
          if (!disabled && !isLoading) playHover();
          onMouseEnter?.(e);
        }}
        onClick={(e) => {
          if (!disabled && !isLoading) playClick();
          onClick?.(e);
        }}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
