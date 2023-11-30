import React from "react";
import { cn } from "../../utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    textAlign?: "left" | "center";
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
            textAlign = "left",
            ...props
        }: ButtonProps,
        forwardedRef: React.ForwardedRef<HTMLButtonElement>,
    ) => {
        return (
            <button
                {...props}
                className={cn(
                    "w-full rounded-lg text-base font-medium",
                    textAlign === "left" ? "" : "flex justify-center",
                    size === "full" ? "px-8 py-4" : "p-3",
                    icon ? "flex items-center gap-2" : "",
                    variant === "primary"
                        ? "bg-gradient-button text-white hover:bg-gradient-button-hover"
                        : variant === "secondary"
                        ? "border border-intg-bg-2 bg-intg-bg-3 text-white hover:bg-gradient-button-hover"
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
