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
  border?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, icon, prefix, cn, border = false, ...props }, ref) => {
    const Prefix = () => {
      return (
        <span className="-mr-1 pl-[14px] text-intg-text-3 ">{prefix}</span>
      );
    };

    return (
      <div className={cn}>
        {label && (
          <label
            className="block text-sm font-medium text-intg-text-2"
            htmlFor={label}
          >
            {label}
          </label>
        )}
        <TremorTextInput
          {...props}
          ref={ref}
          className={`${
            border ? "border-intg-bg-2" : ""
          } rounded-lg bg-intg-bg-1 text-white placeholder:text-intg-text-3`}
          icon={prefix ? Prefix : icon}
        />
      </div>
    );
  },
);
