import Select from "react-select";

type OptionProps = {
    label: string | number | undefined;
    value: string | number | undefined;
};
type Props = {
    onchange?: (value: OptionProps | null) => void;
    defaultValue?: OptionProps;
    options: OptionProps[];
    label?: string;
};

export const ReactSelect = ({ onchange, defaultValue, options, label }: Props) => (
    <div className="space-y-3">
        <p className="text-sm">{label}</p>
        <Select
            isSearchable={false}
            options={options}
            defaultValue={defaultValue}
            onChange={(newValue) => onchange && onchange(newValue)}
        />
    </div>
);
