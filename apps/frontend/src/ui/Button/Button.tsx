import React from "react";
import { cn } from "../../utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    textAlign?: "left" | "center";
    className?: string;
    variant?: "primary" | "secondary" | "custom";
    children?: React.ReactNode;
    icon?: React.ReactElement | null;
    size?: "full" | "md" | "sm" | "xs";
    ping?: boolean;
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
            ping,
            ...props
        }: ButtonProps,
        forwardedRef: React.ForwardedRef<HTMLButtonElement>,
    ) => {
        return (
            <button
                {...props}
                className={cn(
                    "relative w-full text-base font-medium",
                    textAlign === "left" ? "" : "flex justify-center",
                    size === "full"
                        ? "rounded-lg px-8 py-4"
                        : size === "md"
                          ? "rounded-md p-3"
                          : size === "sm"
                            ? "rounded p-1.5"
                            : "p-0",
                    icon ? "flex items-center gap-2" : "",
                    variant === "primary"
                        ? "bg-gradient-button text-white transition-all duration-300 ease-in hover:bg-gradient-button-hover"
                        : variant === "secondary"
                          ? "border border-intg-bg-2 bg-intg-bg-3 text-white transition-all duration-300 ease-in hover:bg-gradient-button-hover"
                          : "",
                    className ?? "",
                )}
                ref={forwardedRef}
            >
                {ping && (
                    <>
                        <span className="absolute right-0 top-0 inline-flex h-2 w-2 animate-ping rounded-full bg-white opacity-75"></span>
                        <span className="absolute right-0 top-0 inline-flex h-2 w-2 rounded-full bg-white"></span>
                    </>
                )}
                {icon && <span>{icon}</span>}
                {text && <span>{text}</span>}
                {children}
            </button>
        );
    },
);

Button.displayName = "Button";

export default Button;
