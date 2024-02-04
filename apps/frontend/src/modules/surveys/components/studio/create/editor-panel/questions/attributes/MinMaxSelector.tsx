import { useState } from "react";
import { MultiValue, SingleValue } from "react-select";
import { Option, ReactSelect } from "./ReactSelect";

type Props = {
    options: Option[];
    minChange: (option: SingleValue<Option> | MultiValue<Option>) => void;
    maxChange: (option: SingleValue<Option> | MultiValue<Option>) => void;
    minValue?: Option;
    maxValue?: Option;
    minDefault?: Option | Option[];
    maxDefault?: Option | Option[];
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
    const [min, setMin] = useState<Option | null>(minValue || null);
    const [max, setMax] = useState<Option | null>(maxValue || null);

    const handleMinChange = (
        option: SingleValue<Option> | MultiValue<Option>,
    ) => {
        const index = (option as SingleValue<Option>)?.index;
        if (max && option && index) {
            if (index > (max?.index ?? 0)) {
                setMax(option as Option);
            }
            maxChange(option);
        }
        setMin(option as Option);
        minChange(option);
    };

    const handleMaxChange = (
        option: SingleValue<Option> | MultiValue<Option>,
    ) => {
        const index = (option as SingleValue<Option>)?.index;

        if (min && option && index) {
            if (index < (min?.index ?? 0)) {
                setMin(option as Option);
                minChange(option);
            }
        }
        setMax(option as Option);
        maxChange(option);
    };

    return (
        <div className="flex gap-4">
            <div className="flex-1">
                <p className="text-sm">Min</p>
                <ReactSelect
                    onchange={handleMinChange}
                    options={options}
                    value={min}
                    defaultValue={minDefault}
                />
            </div>
            <div className="flex-1">
                <p className="text-sm">Max</p>
                <ReactSelect
                    onchange={handleMaxChange}
                    options={options}
                    value={max}
                    defaultValue={maxDefault}
                />
            </div>
        </div>
    );
};

export default MinMaxSelector;
