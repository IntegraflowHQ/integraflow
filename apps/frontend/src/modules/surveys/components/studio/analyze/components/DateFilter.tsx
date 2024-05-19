import { DateFilterValue } from "@/types";
import { DatePicker } from "@/ui";
import { cn, getISOdateString } from "@/utils";
import { parseISO, subDays, subMonths, subWeeks, subYears } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const filterKeys = ["today", "last 7 days", "30 days", "1 year"] as const;

type Props = {
    onValueChange?: (data: DateFilterValue) => void;
    defaultValue?: DateFilterValue;
};

export const DateFilter = ({ defaultValue, onValueChange }: Props) => {
    const [selected, setSelected] = useState<DateFilterValue["timePeriod"] | undefined>(
        defaultValue?.timePeriod ?? filterKeys[0],
    );
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        defaultValue?.timePeriod === "custom"
            ? { from: parseISO(defaultValue.current.gte), to: parseISO(defaultValue.current.lte) }
            : undefined,
    );
    const [pickerOpen, setPickerOpen] = useState(false);

    const handleSelect = (key: string) => {
        switch (key) {
            case "today":
                onValueChange?.({
                    timePeriod: key,
                    current: { gte: getISOdateString(), lte: getISOdateString() },
                    previous: {
                        gte: getISOdateString(subDays(Date.now(), 1)),
                        lte: getISOdateString(subDays(Date.now(), 1)),
                    },
                });
                break;
            case "last 7 days":
                onValueChange?.({
                    timePeriod: key,
                    current: { gte: getISOdateString(subWeeks(Date.now(), 1)), lte: getISOdateString() },
                    previous: {
                        gte: getISOdateString(subWeeks(Date.now(), 2)),
                        lte: getISOdateString(subWeeks(Date.now(), 1)),
                    },
                });
                break;
            case "30 days":
                onValueChange?.({
                    timePeriod: key,
                    current: { gte: getISOdateString(subMonths(Date.now(), 1)), lte: getISOdateString() },
                    previous: {
                        gte: getISOdateString(subMonths(Date.now(), 2)),
                        lte: getISOdateString(subMonths(Date.now(), 1)),
                    },
                });
                break;
            case "1 year":
                onValueChange?.({
                    timePeriod: key,
                    current: { gte: getISOdateString(subYears(Date.now(), 1)), lte: getISOdateString() },
                    previous: {
                        gte: getISOdateString(subYears(Date.now(), 2)),
                        lte: getISOdateString(subYears(Date.now(), 1)),
                    },
                });
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
                onOpen={() => setPickerOpen(true)}
                onClose={() => setPickerOpen(false)}
                mode="range"
                selected={dateRange}
                onSelect={(value) => {
                    setDateRange(value);
                    if (value?.from && value.to) {
                        setSelected("custom");
                        onValueChange?.({
                            timePeriod: "custom",
                            current: {
                                gte: getISOdateString(value.from),
                                lte: getISOdateString(value.to),
                            },
                            previous: {
                                gte: getISOdateString(subWeeks(Date.now(), 2)),
                                lte: getISOdateString(subWeeks(Date.now(), 1)),
                            },
                        });
                    }
                }}
            >
                <div
                    className={cn(
                        "rounded-[4px]  px-2 py-1 text-sm capitalize -tracking-[0.41px] text-intg-text",
                        pickerOpen
                            ? "bg-intg-bg-9"
                            : dateRange?.from && dateRange.to
                              ? "bg-intg-bg-9"
                              : "bg-intg-bg-14",
                    )}
                >
                    Custom
                </div>
            </DatePicker>
        </div>
    );
};
