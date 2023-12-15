import React from "react";
import Select from "react-select";
import "tailwindcss/tailwind.css";

interface OptionProps {
    label: string;
    value: string;
}

interface Props {
    options: OptionProps[];
    option?: OptionProps;
    placeholder?: string;
    value?: OptionProps | null;
    onChange?: (value: OptionProps | null) => void;
}

export const ReactSelect: React.FC<Props> = ({
    options,
    option,
    placeholder,
    onChange,
}: Props) => {
    const handleChange = (option: OptionProps | null) => {
        onChange && onChange(option);
    };

    return (
        <div>
            <Select
                options={options}
                value={option || null}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full"
                defaultValue={options[0]}
            />
        </div>
    );
};
