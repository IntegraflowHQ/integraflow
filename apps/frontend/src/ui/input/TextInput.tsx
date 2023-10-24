import { TextInputProps, TextInput as TremorTextInput } from "@tremor/react";
import React from "react";

interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: React.JSXElementConstructor<any> | React.ElementType<any> | undefined;
  prefix?: string;
  cn?: string;
  border?: boolean;
}

export const TextInput: React.FC<InputFieldProps> = ({
  label,
  icon,
  prefix,
  cn,
  border = false,
  ...props
}) => {
  const Prefix = () => {
    return <span className="pl-3 -mr-1 text-intg-text-3 ">{prefix}</span>;
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
        className={`${
          border ? "border-intg-bg-2" : "border-transparent"
        } rounded-lg bg-intg-bg-1 py-[6px] pl-1 text-sm font-medium tracking-[-0.408px] text-white placeholder:text-intg-text-3`}
        icon={prefix ? Prefix : icon}
      />
    </div>
  );
};
