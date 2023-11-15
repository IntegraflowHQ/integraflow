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
        {
            text,
            className,
            children,
            variant = "primary",
            ...props
        }: ButtonProps,
        forwardedRef: React.ForwardedRef<HTMLButtonElement>,
    ) => {
        return (
            <button
                {...props}
                className={cn(
                    "w-full rounded-lg px-8 py-4 text-base font-medium text-white hover:bg-gradient-button-hover",
                    variant === "primary"
                        ? "bg-gradient-button"
                        : "border border-intg-bg-2 bg-intg-bg-3",
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
