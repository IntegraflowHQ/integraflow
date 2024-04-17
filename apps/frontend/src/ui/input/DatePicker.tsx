"use client";

import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/utils";
import { format } from "date-fns";
import { ReactNode, forwardRef } from "react";
import { DayPickerProps } from "react-day-picker";
import { Calendar } from "../Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";

type Props = {
    label?: string;
    displayFormat?: string;
    children?: ReactNode;
    onOpen?: () => void;
    onClose?: () => void;
};

export const DatePicker = forwardRef<HTMLDivElement, DayPickerProps & Props>(
    ({ label, displayFormat = "PPP", children, onOpen, onClose, ...props }, ref) => {
        return (
            <div className={cn(label ? "flex w-full flex-col gap-2" : "")}>
                {label ? <p className="block text-sm font-medium text-intg-text-2">{label}</p> : null}

                <Popover
                    onOpenChange={(val) => {
                        if (val) {
                            onOpen?.();
                        } else {
                            onClose?.();
                        }
                    }}
                >
                    <PopoverTrigger>
                        {!children ? (
                            props.mode === "single" ? (
                                <div
                                    className={cn(
                                        "flex w-full items-center rounded-lg bg-intg-bg-15 px-4 py-3 text-intg-text",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {props.selected ? format(props.selected, displayFormat) : <span>Pick a date</span>}
                                </div>
                            ) : null
                        ) : (
                            children
                        )}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto bg-intg-bg-15  p-0" ref={ref}>
                        <Calendar initialFocus {...props} />
                    </PopoverContent>
                </Popover>
            </div>
        );
    },
);
