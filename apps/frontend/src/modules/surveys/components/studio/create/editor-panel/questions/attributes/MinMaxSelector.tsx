import { Option, ReactSelect } from "./ReactSelect";

type Props = {
    options: Option[];
    minChange: (option) => void;
    maxChange: (option) => void;
    minValue?: Option;
    maxValue?: Option;
    minDefault?: Option;
    maxDefault?: Option;
};

const MinMaxSelector = ({
    options,
    maxChange,
    minChange,
    minValue,
    maxValue,
    maxDefault,
    minDefault,
}: Props) => {
    const handleMinChange = (option: Option) => {
        const minOptionValue = Array.isArray(options)
            ? option?.value
            : option?.value;
        const maxOptionValue = Array.isArray(options)
            ? option?.value
            : option?.value;

        if (maxOptionValue && minOptionValue > maxOptionValue) {
            maxChange(option);
        } else {
            minChange(option);
        }
    };

    const handleMaxChange = (option: Option) => {
        const minOptionValue = Array.isArray(options)
            ? option?.value
            : option?.value;
        const maxOptionValue = Array.isArray(options)
            ? option?.value
            : option?.value;

        if (minOptionValue && maxOptionValue < minOptionValue) {
            minChange(option);
        } else {
            maxChange(option);
        }
    };

    return (
        <div className="flex gap-4">
            <div className="flex-1">
                <p className="text-sm">Min</p>
                <ReactSelect
                    onchange={handleMinChange}
                    minDefault={minDefault}
                    options={options}
                    value={minValue}
                />
            </div>
            <div className="flex-1">
                <p className="text-sm">Max</p>
                <ReactSelect
                    onchange={handleMaxChange}
                    options={options}
                    maxDefault={maxDefault}
                    value={maxValue}
                />
            </div>
        </div>
    );
};

export default MinMaxSelector;
