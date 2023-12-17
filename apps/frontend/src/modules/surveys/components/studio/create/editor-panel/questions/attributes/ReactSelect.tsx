import Select from "react-select";

type OptionProps = {
    label: string|number;
    value: string| number;
};
type Props = {
    onchange?: (value: OptionProps | null) => void;
    defaultValue?: OptionProps;
    options: OptionProps[];
};

export const ReactSelect = ({ onchange, defaultValue, options }: Props) => (
    <Select
        options={options}
        defaultValue={defaultValue}
        onChange={(newValue) => onchange && onchange(newValue)}
    />
);
