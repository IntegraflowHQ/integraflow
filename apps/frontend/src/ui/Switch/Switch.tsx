import * as SwitchPrimitive from "@radix-ui/react-switch";
import { forwardRef } from "react";

type Props = {
    label: string;
    value?: boolean;
    onChange?: (e: { target: { value: boolean } }) => void;
};

export const Switch = forwardRef<HTMLButtonElement, Props>(
    ({ label, value, onChange }, ref) => {
        return (
            <div className="flex items-center justify-between rounded-lg bg-intg-bg-15 px-4 py-3">
                <label
                    className="pr-[15px] text-[15px] leading-none text-intg-text-1"
                    htmlFor={label}
                >
                    {label}
                </label>

                <SwitchPrimitive.Root
                    ref={ref}
                    className="relative h-[24px] w-[35px] cursor-default rounded-xl border border-[#524770] bg-[#372E4F] outline-none data-[state=checked]:bg-white"
                    id="airplane-mode"
                    style={{
                        WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                    }}
                    checked={value}
                    onCheckedChange={(value: boolean) =>
                        onChange && onChange({ target: { value } })
                    }
                >
                    <SwitchPrimitive.Thumb className="block h-[13px] w-[13px] translate-x-1 rounded-full bg-[#6941C6]  transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[15px]" />
                </SwitchPrimitive.Root>
            </div>
        );
    },
);

Switch.displayName = "Switch";
