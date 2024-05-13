import { cn } from "@/utils";
import { LogicOperator } from "@/types";
import { useState } from "react";
import Select, { CSSObjectWithLabel, MultiValue, MultiValueGenericProps, SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { LogicOperatorBtn } from "./LogicOperator";

type Props = {
    options?: Option[];
    enableUserOptions?: boolean;
    comboBox?: boolean;
    defaultValue?: Option | Option[];
    label?: string;
    value?: Option | Option[] | null;
    onchange?: (value: Option | SingleValue<Option> | MultiValue<Option>) => void;
    shouldLogicalOperatorChange?: boolean;
    onOperatorChange?: (value: Option) => void;
    logicOperator?: LogicOperator;
    classname?: string;
};

export interface Option {
    label: string;
    value: string;
    id?: string;
    index?: number;
}

const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
});

export const ReactSelect = ({
    options,
    enableUserOptions = false,
    onchange,
    defaultValue,
    comboBox = false,
    label,
    value,
    onOperatorChange,
    logicOperator,
    shouldLogicalOperatorChange = false,
    classname,
}: Props) => {
    const [values, setValue] = useState<Option | Option[]>([]);
    const [userOptions, setUserOptions] = useState<Option[]>([]);
    const [logicalOperatorValue, setLogicalOperatorValue] = useState<LogicOperator>(logicOperator as LogicOperator);

    const handleCreate = (inputValue: string) => {
        setTimeout(() => {
            const newOption = createOption(inputValue);

            if (Array.isArray(values)) {
                setValue((prev) => [...(prev as Option[]), newOption]);
            } else {
                setValue([values, newOption]);
            }

            setUserOptions((prev) => [...prev, newOption]);
        }, 100);
    };

    const styles = {
        control: (provided: CSSObjectWithLabel) => ({
            ...provided,
            borderRadius: "8px",
            border: "1px solid transparent",
            backgroundColor: "#272138",
        }),
        indicatorsContainer: (provided: CSSObjectWithLabel) => ({
            ...provided,
        }),
        indicatorSeparator: (provided: CSSObjectWithLabel) => ({
            ...provided,
            display: "none",
        }),
        dropdownIndicator: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: "#9ca3af",
        }),
        placeholder: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: "#9ca3af",
            fontSize: "14px",
            lineHeight: "17px",
        }),
        singleValue: (provided: CSSObjectWithLabel) => ({
            ...provided,
            fontSize: "14px",
            lineHeight: "17px",
            color: "#CFD4E0",
        }),
        menu: (provided: CSSObjectWithLabel) => ({
            ...provided,
            borderRadius: "4px",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            backgroundColor: "#181325",
        }),
        option: (provided: CSSObjectWithLabel, state: { isSelected: boolean; }) => ({
            ...provided,
            ":hover": {
                backgroundColor: "#272138",
            },
            backgroundColor: state.isSelected ? "#272138" : "transparent",
            color: "#CFD4E0",
            fontSize: "14px",
            lineHeight: "17px",
            padding: "10px 12px",
        }),
        clearIndicator: (provided: CSSObjectWithLabel) => ({
            ...provided,
            display: "none",
        }),
    };

    const customMultiValue = (props: MultiValueGenericProps<Option>) => {
        return (
            <div className="flex items-center justify-center">
                {(props.selectProps.value && (props.selectProps.value as MultiValue<Option>)[0]?.value) !==
                props.data.value ? (
                    <LogicOperatorBtn
                        value={logicalOperatorValue as LogicOperator}
                        onclick={() => {
                            if (shouldLogicalOperatorChange) {
                                setLogicalOperatorValue(
                                    logicalOperatorValue === LogicOperator.AND ? LogicOperator.OR : LogicOperator.AND,
                                );
                                onOperatorChange &&
                                    onOperatorChange({
                                        label: logicalOperatorValue,
                                        value: logicalOperatorValue,
                                    });
                            } else {
                                return;
                            }
                        }}
                    />
                ) : null}

                <div
                    onClick={() => {
                        value = (value as Option[]).filter((v) => v.value !== props.data.value);
                        onchange && onchange(value);
                    }}
                    className="rounded-lg bg-intg-bg-19 px-2 py-1 text-sm text-intg-text"
                >
                    {props.data.label}
                </div>
            </div>
        );
    };

    return (
        <>
            {!comboBox ? (
                <div className={cn(label ? "space-y-2" : "", "text-intg-text-2")}>
                    {label && <p className="text-sm">{label}</p>}
                    <Select
                        value={value}
                        isSearchable={false}
                        options={options}
                        defaultValue={defaultValue}
                        onChange={(newValue) => onchange && onchange(newValue)}
                        styles={styles}
                        className={classname}
                    />
                </div>
            ) : (
                <>
                    {enableUserOptions ? (
                        <CreatableSelect<Option, boolean>
                            closeMenuOnSelect={false}
                            components={{ MultiValue: customMultiValue }}
                            onCreateOption={(inputValue) => {
                                handleCreate(inputValue);
                                onchange && onchange([...(values as Option[]), createOption(inputValue)]);
                            }}
                            value={value}
                            isMulti
                            options={userOptions}
                            onChange={(value) => {
                                setValue(value as Option[]);
                                onchange && onchange(value);
                            }}
                            className={classname}
                            styles={styles}
                        />
                    ) : (
                        <div>
                            <Select
                                components={{ MultiValue: customMultiValue }}
                                value={value}
                                options={options}
                                defaultValue={defaultValue}
                                isMulti
                                onChange={(value) => {
                                    onchange && onchange(value);
                                }}
                                className={classname}
                                styles={styles}
                                closeMenuOnSelect={false}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
};
