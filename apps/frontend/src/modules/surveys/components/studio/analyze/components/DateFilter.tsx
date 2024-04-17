import { DatePicker } from "@/ui";
import { cn } from "@/utils";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const filterKeys = ["today", "last 7 days", "30 days", "1 year"] as const;

type Props = {
    onValueChange?: (
        data: { type: "string"; value?: (typeof filterKeys)[number] } | { type: "range"; value?: DateRange },
    ) => void;
};

export const DateFilter = ({ onValueChange }: Props) => {
    const [selected, setSelected] = useState<(typeof filterKeys)[number] | undefined>(filterKeys[0]);
    const [dateRange, setDateRange] = useState<DateRange>();

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
                            onValueChange?.({ type: "string", value: key });

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
                            type: "range",
                            value,
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
