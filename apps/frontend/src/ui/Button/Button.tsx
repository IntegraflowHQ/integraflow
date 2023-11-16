import React from "react";
import { cn } from "../../utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    className?: string;
    variant?: "primary" | "secondary" | "custom";
    children?: React.ReactNode;
    icon?: React.ReactNode;
    size?: "full" | "md";
}

const Button = React.forwardRef(
    (
        {
            text,
            className,
            children,
            variant = "primary",
            size = "full",
            icon,
            ...props
        }: ButtonProps,
        forwardedRef: React.ForwardedRef<HTMLButtonElement>,
    ) => {
        return (
            <button
                {...props}
                className={cn(
                    "rounded-lg text-base font-medium text-white",
                    size === "full" ? "py-4w-full px-8" : "w-fit p-3",
                    icon ? "flex  items-center space-x-2" : "",
                    variant === "primary"
                        ? "bg-gradient-button hover:bg-gradient-button-hover"
                        : variant === "secondary"
                        ? "border border-intg-bg-2 bg-intg-bg-3 hover:bg-gradient-button-hover"
                        : "",
                    className ?? "",
                )}
                ref={forwardedRef}
            >
                {icon && <span>{icon}</span>}
                {text && <span>{text}</span>}
                {children}
            </button>
        );
    },
);

Button.displayName = "Button";

export default Button;
