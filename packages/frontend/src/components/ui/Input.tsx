"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  helperText?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, helperText, error, ...props }, ref) => (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner shadow-slate-300/20 transition focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200",
          error && "border-red-200 focus:border-red-300 focus:ring-red-200",
          className,
        )}
        {...props}
      />
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  ),
);

Input.displayName = "Input";

export default Input;
