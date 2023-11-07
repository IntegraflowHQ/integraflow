import {
  TextInput as TremorTextInput,
  TextInputProps as TremorTextInputProps,
} from "@tremor/react";
import React, { forwardRef } from "react";

interface InputFieldProps extends TremorTextInputProps {
  label?: string;
  icon?: React.JSXElementConstructor<any> | React.ElementType<any> | undefined;
  prefix?: string;
  cn?: string;
}

export const TextInput = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, icon, prefix, cn, ...props }, ref) => {
    const Prefix = () => {
      return <span className="-mr-1 pl-3 text-intg-text-3 ">{prefix}</span>;
    };

    return (
      <div className={cn}>
        {label && (
          <label
            className="mb-2 block text-sm font-medium text-intg-text-2"
            htmlFor={label}
          >
            {label}
          </label>
        )}
        <TremorTextInput
          {...props}
          ref={ref}
          className="rounded-lg border border-transparent bg-intg-bg-1 py-[6px] pl-1 text-sm
           font-medium tracking-[-0.408px] text-intg-text-1 placeholder:text-intg-text-3 
           focus:border-intg-text-3 focus:outline-none"
          icon={prefix ? Prefix : icon}
        />
      </div>
    );
  },
);
