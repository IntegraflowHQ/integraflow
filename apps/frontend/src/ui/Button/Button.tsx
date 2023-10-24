import React from "react";
import { cn } from "../../utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  className?: string;
  variant?: "primary" | "secondary";
  children?: React.ReactNode;
}

const Button = React.forwardRef(
  (
    { text, className, children, variant = "primary", ...props }: ButtonProps,
    forwardedRef: React.ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <button
        {...props}
        className={cn(
          "hover:bg-gradient-button-hover w-full rounded-lg px-8 py-4 text-base font-medium text-white",
          variant === "primary"
            ? "bg-gradient-button"
            : "bg-intg-bg-3 border border-intg-bg-2",
          className ?? "",
        )}
        ref={forwardedRef}
      >
        {text && <span>{text}</span>}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
