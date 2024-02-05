import { LogicOperator } from "@integraflow/web/src/types";
import { useState } from "react";
import Select, {
    CSSObjectWithLabel,
    MultiValue,
    MultiValueGenericProps,
    SingleValue,
    components,
} from "react-select";
import CreatableSelect from "react-select/creatable";
import { LogicOperatorBtn } from "./LogicOperator";

type Props = {
    options?: Option[];
    enableUserOptions?: boolean;
    comboBox?: boolean;
    defaultValue?: Option | Option[];
    label?: string;
    value?: Option | Option[] | null;
    onchange?: (
        value: Option | SingleValue<Option> | MultiValue<Option>,
    ) => void;
    shouldLogicalOperatorChange?: boolean;
    onOperatorChange?: (value: Option) => void;
    logicOperator?: LogicOperator;
    classname?: string;
};

export interface Option {
    label: any;
    value: any;
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
    const [logicalOperatorValue, setLogicalOperatorValue] =
        useState<LogicOperator>(logicOperator as LogicOperator);

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
        control: (provided: any) => ({
            ...provided,
            borderRadius: "8px",
            border: "1px solid transparent",
            backgroundColor: "#272138",
            height: "48px",
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
            color: "#DBD4EB",
        }),
        menu: (provided: CSSObjectWithLabel) => ({
            ...provided,
            borderRadius: "4px",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            backgroundColor: "#272138",
        }),
        option: (provided: CSSObjectWithLabel, state: any) => ({
            ...provided,
            ":hover": {
                backgroundColor: "#e5e7eb",
                color: "#000",
            },
            backgroundColor: state.isSelected ? "#e5e7eb" : "transparent",
            color: state.isSelected ? "#000" : "#e5e7eb",
            fontSize: "14px",
            lineHeight: "17px",
            padding: "10px 12px",
        }),
        multiValueLabel: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: "#DBD4EB",
        }),
        multiValueRemove: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: "#DBD4EB",
            display: "none",
        }),
    };

    const MultiValueContainer = (props: MultiValueGenericProps<Option>) => {
        return (
            <>
                {(props.selectProps.value &&
                    (props.selectProps.value as MultiValue<Option>)[0]
                        ?.value) !== props.data.value ? (
                    <LogicOperatorBtn
                        value={logicalOperatorValue as LogicOperator}
                        onclick={() => {
                            console.log(shouldLogicalOperatorChange);
                            if (shouldLogicalOperatorChange) {
                                setLogicalOperatorValue(
                                    logicalOperatorValue === LogicOperator.AND
                                        ? LogicOperator.OR
                                        : LogicOperator.AND,
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
                <components.MultiValueContainer {...props} />
            </>
        );
    };

    return (
        <>
            {!comboBox ? (
                <div>
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
                            components={{ MultiValueContainer }}
                            onCreateOption={(inputValue) => {
                                handleCreate(inputValue);
                                onchange &&
                                    onchange([
                                        ...(values as Option[]),
                                        createOption(inputValue),
                                    ]);
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
                                components={{ MultiValueContainer }}
                                value={value}
                                options={options}
                                defaultValue={defaultValue}
                                isMulti
                                onChange={(value) => {
                                    onchange && onchange(value);
                                }}
                                className={classname}
                                styles={styles}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
};
