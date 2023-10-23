import { TextInput, TextInputProps } from "@tremor/react";
import React from "react";

interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: React.JSXElementConstructor<any> | React.ElementType<any> | undefined;
  prefix?: string;
  cn?: string
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  prefix,
  cn,
  ...props
}) => {
  const Prefix = () => {
    return <div className="bg-intg-bg-1 py-[14px] pl-[16px] font-medium text-[14px] text-intg-text-3">{prefix}</div>;
  };

  return (
    <div className={cn}  >
      {label && 
      <label className="block text-sm font-medium text-intg-text-2" htmlFor={label}>
        {label}
      </label>}
      <TextInput
      style={{
        background: '#21173A',
        width:'100%',
        color: '#DBD4EB',
        padding:"14px 16px",
        fontSize:'14px',
      }}
        {...props}
        icon={prefix ? Prefix : icon}
      />
    </div>
  );
};

