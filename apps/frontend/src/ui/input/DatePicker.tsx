"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/utils";
import { forwardRef } from "react";
import { Calendar } from "../Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";

type DatePickerProps = {
    label: string;
    value?: Date;
    onChange?: (e: {
        target: { value: Date | undefined; name: string; type: string };
    }) => void;
    fromDate?: Date;
    toDate?: Date;
    displayFormat?: string;
};

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
    ({ label, value, onChange, displayFormat = "PPP", ...props }, ref) => {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <button className="flex w-full flex-col gap-2">
                        <p className="block text-sm font-medium text-intg-text-2">
                            {label}
                        </p>
                        <div
                            className={cn(
                                "flex w-full items-center rounded-lg bg-intg-bg-15 px-4 py-3 text-intg-text",
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {value ? (
                                format(value, displayFormat)
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </div>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto bg-intg-bg-15  p-0" ref={ref}>
                    <Calendar
                        selected={value}
                        onSelect={(value) =>
                            onChange &&
                            onChange({
                                target: {
                                    value,
                                    name: label,
                                    type: "datetime-local",
                                },
                            })
                        }
                        mode="single"
                        initialFocus
                        {...props}
                    />
                </PopoverContent>
            </Popover>
        );
    },
);
