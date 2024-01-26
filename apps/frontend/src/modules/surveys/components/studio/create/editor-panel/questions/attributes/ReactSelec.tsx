import Select from "react-select";

export type OptionProps = {
    label: string | number | undefined;
    value: string | number | undefined;
};
type Props = {
    onchange?: (value: OptionProps | null) => void;
    defaultValue?: OptionProps;
    options: OptionProps[];
    label?: string;
    value?: OptionProps;
};

export const ReactSelect = ({ onchange, defaultValue, options, label, value }: Props) => (
    <div className="space-y-3">
      {label &&
            <p className="text-sm">{label}</p>
            }
        <Select
            value={value}
            isSearchable={false}
            options={options}
            defaultValue={defaultValue}
            onChange={(newValue) => onchange && onchange(newValue)}
            styles={{
                control: (provided) => ({
                    ...provided,
                    minHeight: "48px",
                    height: "48px",
                    borderRadius: "4px",
                    border: "1px solid transparent",
                    backgroundColor: "#272138",
                }),
                indicatorsContainer: (provided) => ({
                    ...provided,
                }),
                indicatorSeparator: (provided) => ({
                    ...provided,
                    display: "none",
                }),
                dropdownIndicator: (provided) => ({
                    ...provided,
                    color: "#9ca3af",
                }),
                placeholder: (provided) => ({
                    ...provided,
                    fontSize: "14px",
                    lineHeight: "17px",
                }),
                singleValue: (provided) => ({
                    ...provided,
                    fontSize: "14px",
                    lineHeight: "17px",
                    color: "#DBD4EB",
                }),
                menu: (provided) => ({
                    ...provided,
                    borderRadius: "4px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    backgroundColor: '#272138'
                }),
                option: (provided, state) => ({
                    ...provided,
                    ":hover": {
                        backgroundColor: "#e5e7eb",
                        color: "#000",
                    },
                    backgroundColor: state.isSelected ? "#e5e7eb" : "transparent",
                    color: state.isSelected ?  "#000":  "#e5e7eb",
                    fontSize: "14px",
                    lineHeight: "17px",
                    padding: "10px 12px",
                }),
            }}
        />
    </div>
);
