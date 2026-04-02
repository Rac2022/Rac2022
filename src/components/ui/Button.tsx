'use client';

import { clsx } from 'clsx';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' &&
          'bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-500 shadow-sm',
        variant === 'secondary' &&
          'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400',
        variant === 'outline' &&
          'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-400',
        variant === 'ghost' &&
          'text-slate-600 hover:bg-slate-100 focus:ring-slate-300',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-5 py-2.5 text-sm',
        size === 'lg' && 'px-7 py-3 text-base',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
