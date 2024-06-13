import { cn } from "@/utils";
import { TextInput as TremorTextInput, TextInputProps as TremorTextInputProps } from "@tremor/react";
import React, { forwardRef } from "react";

interface InputFieldProps extends TremorTextInputProps {
    label?: string;
    icon?: React.JSXElementConstructor<any> | React.ElementType<any> | undefined;
    prefix?: string;
    className?: string;
    rightIcon?: React.ReactElement;
    inputSize?: "lg" | "md";
}

export const TextInput = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, icon, prefix, inputSize = "lg", rightIcon, className, ...props }, ref) => {
        const Prefix = () => {
            return <span className="-mr-1 pl-3 text-intg-text-3 ">{prefix}</span>;
        };

        const sizeClass = inputSize === "lg" ? "rounded-lg py-[6px]" : "rounded";

        return (
            <div className={`${className} space-y-2`}>
                {label && (
                    <label className="block text-sm font-medium text-intg-text-2" htmlFor={label}>
                        {label}
                    </label>
                )}
                <div className="relative">
                    <TremorTextInput
                        {...props}
                        ref={ref}
                        className={cn(
                            sizeClass,
                            "border border-transparent bg-[#272138]  pl-1 text-sm font-medium tracking-[-0.408px] text-intg-text-1 placeholder:text-intg-text-3 focus:border-intg-text-3 focus:outline-none",
                        )}
                        icon={prefix ? Prefix : icon}
                    />

                    {rightIcon && (
                        <div className="absolute right-[0] top-[50%] -translate-x-[50%] -translate-y-[50%] text-intg-text">
                            {rightIcon}
                        </div>
                    )}
                </div>
            </div>
        );
    },
);
