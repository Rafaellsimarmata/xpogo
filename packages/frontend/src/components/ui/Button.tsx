"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
  asChild?: boolean;
}

const baseStyles =
  "group inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white shadow-lg shadow-blue-500/30 hover:from-blue-500 hover:via-blue-400 hover:to-blue-300",
  secondary:
    "bg-white/80 text-blue-600 border border-blue-100 hover:bg-white shadow-sm hover:border-blue-200",
  ghost: "bg-transparent text-white hover:text-blue-100",
  outline:
    "border border-blue-200 text-blue-600 hover:border-blue-300 hover:bg-white/60 backdrop-blur",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", icon, loading, children, asChild, type, ...props },
    ref,
  ) => {
    const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

    // Content untuk button biasa
    const buttonContent = (
      <>
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
        ) : (
          icon && <span className="text-lg">{icon}</span>
        )}
        <span>{children}</span>
      </>
    );

    // Jika asChild dan children adalah React element
    if (asChild && React.isValidElement(children)) {
      // Type assertion dengan interface yang jelas
      const elementChild = children as React.ReactElement<{
        className?: string;
        ref?: React.Ref<unknown>;
        children?: React.ReactNode;
        onClick?: React.MouseEventHandler<unknown>;
        onMouseEnter?: React.MouseEventHandler<unknown>;
        onMouseLeave?: React.MouseEventHandler<unknown>;
        disabled?: boolean;
        [key: string]: unknown;
      }>;

      // Ambil children dari element child dengan type guard
      const childChildren = elementChild.props?.children ?? children;

      // Content untuk asChild
      const asChildContent = (
        <>
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
          ) : (
            icon && <span className="text-lg">{icon}</span>
          )}
          {childChildren}
        </>
      );

      // Buat props untuk cloneElement
      const clonedProps: Record<string, unknown> = {
        ...elementChild.props,
        className: cn(classes, elementChild.props?.className || ""),
        children: asChildContent,
      };

      // Tambahkan ref jika element child tidak punya ref
      if (!elementChild.props?.ref) {
        clonedProps.ref = ref;
      }

      // Tambahkan event handlers dari props button
      if (props.onClick) clonedProps.onClick = props.onClick;
      if (props.onMouseEnter) clonedProps.onMouseEnter = props.onMouseEnter;
      if (props.onMouseLeave) clonedProps.onMouseLeave = props.onMouseLeave;
      if (props.disabled !== undefined) clonedProps.disabled = props.disabled;

      // Clone element dengan props yang sudah aman
      return React.cloneElement(elementChild, clonedProps);
    }

    // Jika asChild tapi children bukan React element
    if (asChild) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Button with asChild expects a single React element as child.");
      }
      // Fallback ke button biasa
      return (
        <button ref={ref} className={classes} type={type ?? "button"} {...props}>
          {buttonContent}
        </button>
      );
    }

    // Default: render sebagai button biasa
    return (
      <button ref={ref} className={classes} type={type ?? "button"} {...props}>
        {buttonContent}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;