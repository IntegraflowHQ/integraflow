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

const MinMaxSelector = ({ options, maxChange, minChange, minValue, maxValue, maxDefault, minDefault }: Props) => {
    const [min, setMin] = useState<Option | null>(minValue || null);
    const [max, setMax] = useState<Option | null>(maxValue || null);

    const handleMinChange = (option: SingleValue<Option> | MultiValue<Option>) => {
        const index = (option as SingleValue<Option>)?.index;
        setMin(option as Option);
        minChange(option);

        if (max && option && (index || index == 0)) {
            if (index > (max?.index ?? 0)) {
                setMax(option as Option);
                maxChange(option);
            }
        }
    };

    const handleMaxChange = (option: SingleValue<Option> | MultiValue<Option>) => {
        const index = (option as SingleValue<Option>)?.index;
        setMax(option as Option);
        maxChange(option);

        if (min?.index && option && (index || index == 0)) {
            if (index < min?.index ?? 0) {
                setMin(option as Option);
                minChange(option);
            }
        }
    };

    return (
        <div className="flex gap-4">
            <div className="flex-1">
                <p className="text-sm">Min</p>
                <ReactSelect
                    onchange={handleMinChange}
                    dataTestid={"min-indicator"}
                    options={options}
                    value={min}
                    defaultValue={minDefault}
                />
            </div>
            <div className="flex-1">
                <p className="text-sm">Max</p>
                <ReactSelect
                    onchange={handleMaxChange}
                    dataTestid="max-indicator"
                    options={options}
                    value={max}
                    defaultValue={maxDefault}
                />
            </div>
        </div>
    );
};

export default MinMaxSelector;
