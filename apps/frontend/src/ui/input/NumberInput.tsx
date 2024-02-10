import {
    NumberInputProps,
    NumberInput as TremorNumberInput,
} from "@tremor/react";
import { forwardRef } from "react";

interface InputFieldProps extends NumberInputProps {
    label?: string;
    className?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, className, ...props }, ref) => {
        return (
            <div className={className}>
                {label && (
                    <label
                        className="mb-2 block text-sm font-medium text-intg-text-2"
                        htmlFor={label}
                    >
                        {label}
                    </label>
                )}

                <TremorNumberInput
                    {...props}
                    ref={ref}
                    className="rounded-lg border border-transparent bg-[#272138] py-[6px] pl-1 text-sm font-medium tracking-[-0.408px] text-intg-text-1 placeholder:text-intg-text-3 focus:border-intg-text-3 focus:outline-none"
                />
            </div>
        );
    },
);
