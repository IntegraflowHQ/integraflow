import { DatePicker } from "@/ui";
import { cn, getISOdateString } from "@/utils";
import { addDays, subDays } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const filterKeys = ["today", "last 7 days", "30 days", "1 year"] as const;

type Props = {
    onValueChange?: (data: Value) => void;
};

type Value = {
    from: string;
    to: string;
};

export const DateFilter = ({ onValueChange }: Props) => {
    const [selected, setSelected] = useState<(typeof filterKeys)[number] | undefined>(filterKeys[0]);
    const [dateRange, setDateRange] = useState<DateRange>();

    const handleSelect = (key: string) => {
        switch (key) {
            case "today":
                onValueChange?.({ from: getISOdateString(), to: getISOdateString(addDays(Date.now(), 1)) });
                break;
            case "last 7 days":
                onValueChange?.({ from: getISOdateString(subDays(Date.now(), 7)), to: getISOdateString() });
                break;
            case "30 days":
                onValueChange?.({ from: getISOdateString(subDays(Date.now(), 30)), to: getISOdateString() });
                break;
            case "1 year":
                onValueChange?.({ from: getISOdateString(subDays(Date.now(), 365)), to: getISOdateString() });
                break;
            default:
                break;
        }
    };

    return (
        <div className="inline-flex gap-1 rounded-[4px] bg-intg-bg-15 p-1">
            <div className="inline-flex gap-1">
                {filterKeys.map((key) => (
                    <button
                        className={cn(
                            "rounded-[4px] px-2 py-1 text-sm capitalize -tracking-[0.41px] text-intg-text",
                            selected === key ? "bg-intg-bg-9" : "bg-intg-bg-14",
                        )}
                        key={key}
                        onClick={() => {
                            setSelected(key);
                            handleSelect(key);

                            if (dateRange) {
                                setDateRange(undefined);
                            }
                        }}
                    >
                        {key}
                    </button>
                ))}
            </div>

            <DatePicker
                mode="range"
                selected={dateRange}
                onSelect={(value) => {
                    setDateRange(value);
                    if (value?.from && value.to) {
                        onValueChange?.({
                            from: getISOdateString(value.from),
                            to: getISOdateString(value.to),
                        });
                    }
                }}
            >
                <div
                    className={cn(
                        "rounded-[4px]  px-2 py-1 text-sm capitalize -tracking-[0.41px] text-intg-text",
                        selected ? "bg-intg-bg-14" : "bg-intg-bg-9",
                    )}
                    onClick={() => {
                        setSelected(undefined);
                    }}
                >
                    Custom
                </div>
            </DatePicker>
        </div>
    );
};
