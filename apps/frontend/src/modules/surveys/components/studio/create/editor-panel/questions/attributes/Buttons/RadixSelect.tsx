import { Select, SelectItem } from "@tremor/react";

type OptionProps = {
    label: string | number;
    value: string | number;
};

type Props = {
    onValueChange: (value: string) => void;
    icon?: React.FC;
    classname?: string;
    placeholder?: string;
    options: OptionProps[];
    defaultValue?: string;
};

export const TremorSelect = ({
    icon,
    onValueChange,
    defaultValue,
    options,
    placeholder,
}: Props) => {
    return (
        <Select
            className="scrollbar-hide rounded-lg border-2 border-[#28213B] bg-intg-bg-9 text-intg-text-1"
            placeholder={placeholder}
            icon={icon}
            onValueChange={onValueChange}
            defaultValue={`${defaultValue}`}
        >
            {options.map((event) => (
                <SelectItem
                    key={event.label}
                    value={`${event.value}`}
                    icon={icon}
                    className="gap-2 border border-intg-bg-9 text-intg-text hover:border-[#28213B]"
                >
                    {event.label}
                </SelectItem>
            ))}
        </Select>
    );
};
