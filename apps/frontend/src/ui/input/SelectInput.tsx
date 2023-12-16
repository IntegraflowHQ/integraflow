import * as Select from "@radix-ui/react-select";
import { SelectProps } from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { forwardRef } from "react";

interface SelectFieldProps extends SelectProps {
    title?: string;
    defaultValue: string;
    options: { label: string; value: string }[];
    onChange?: (value: { target: { name?: string; value: string } }) => void;
    name?: string;
    error?: string;
}

export const SelectInput = forwardRef<HTMLDivElement, SelectFieldProps>(
    ({ defaultValue, options, title, name, onChange, error }, ref) => {
        return (
            <div ref={ref} className="w-full">
                <label className="mb-1.5 text-sm font-medium text-intg-text-2">
                    {title}
                </label>

                <Select.Root
                    defaultValue={defaultValue}
                    onValueChange={(value) =>
                        onChange && onChange({ target: { name, value } })
                    }
                >
                    <Select.Trigger
                        aria-label={title}
                        placeholder={title}
                        className={`flex w-full items-center justify-between rounded-lg border border-transparent bg-intg-bg-1 px-3 py-3.5
           text-sm font-medium text-intg-text-3 focus:border-intg-text-3 focus:outline-none  ${
               error ? "border-intg-error-text" : ""
           }`}
                    >
                        <Select.Value />
                        <Select.Icon>
                            <ChevronDownIcon size={"15px"} color="#B5A4DB" />
                        </Select.Icon>
                    </Select.Trigger>
                    <Select.Content
                        ref={ref}
                        sideOffset={-10}
                        alignOffset={6}
                        position="popper"
                        className="mx-auto w-[calc(var(--radix-select-trigger-width)-12px)] rounded-lg border border-intg-bg-6"
                    >
                        <Select.ScrollUpButton className="flex items-center justify-center text-intg-bg-1">
                            <ChevronUpIcon />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="rounded-lg bg-intg-bg-5 p-2 shadow-lg">
                            {options.map((f, i) => (
                                <Select.Item
                                    disabled={f === options[0]}
                                    key={`${f.label}-${i}`}
                                    value={f.value}
                                    className="radix-disabled:opacity-50 relative flex select-none items-center rounded-md px-2 py-2 text-sm
                  font-medium text-intg-text-3 focus:bg-intg-bg-6 focus:outline-none"
                                >
                                    <Select.ItemText>{f.label}</Select.ItemText>
                                </Select.Item>
                            ))}
                        </Select.Viewport>
                        <Select.ScrollDownButton className="flex items-center justify-center text-intg-bg-1">
                            <ChevronDownIcon />
                        </Select.ScrollDownButton>
                    </Select.Content>
                </Select.Root>
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>
        );
    },
);
