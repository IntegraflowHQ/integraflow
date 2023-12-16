import { useState } from "react";
import Select, { MultiValue, SingleValue } from "react-select";

import CreatableSelect from "react-select/creatable";

type Props = {
    options?: Option[];
    enableUserOptions?: boolean;
    getValue?: (value: MultiValue<Option> | SingleValue<Option>) => void;
};

interface Option {
    readonly label: string;
    readonly value: string;
}

const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
});

export const ComboBox = ({
    options,
    enableUserOptions = false,
    getValue,
}: Props) => {
    const [values, setValue] = useState<Option | Option[]>([]);
    const [userOptions, setUserOptions] = useState<Option[]>([]);

    const handleCreate = (inputValue: string) => {
        setTimeout(() => {
            const newOption = createOption(inputValue);
            setUserOptions((prev) => [...prev, newOption]);
            setValue((prev) => [...prev, newOption]);
        }, 100);
    };

    return (
        <>
            {enableUserOptions ? (
                <CreatableSelect<Option, boolean>
                    closeMenuOnSelect={false}
                    onCreateOption={handleCreate}
                    value={values}
                    isMulti
                    options={userOptions}
                    onChange={(value) => {
                        setValue(value as Option[]);
                        getValue && getValue(value);
                    }}
                />
            ) : (
                <div>
                    <Select
                        options={options}
                        isMulti
                        onChange={(value) => {
                            getValue && getValue(value);
                        }}
                    />
                </div>
            )}
        </>
    );
};
