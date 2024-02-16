import { cn } from "@/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { TextInput } from "@tremor/react";
import { useState } from "react";
import { Option } from "../questions/attributes/ReactSelect";

export interface EditorTextProps {
    label?: string;
    className?: string;
    placeholder?: string;
    showCharacterCount?: boolean;
    maxCharacterCount?: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    options?: Option[];
    attributes?: Option[];
    defaultValue?: string;
}

export const EditorTextInput = ({
    label,
    className,
    showCharacterCount = true,
    maxCharacterCount = 500,
    placeholder,
    defaultValue,
    onChange,
    ...props
}: EditorTextProps) => {
    const [atBtnClicked, setAtBtnClicked] = useState(false);
    const [atIndex, setAtIndex] = useState<number | null>(null);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [inputValue, setInputValue] = useState(defaultValue || "");

    return (
        <div className={cn(`${className} relative w-full`)}>
            <label htmlFor={label} className="text-sm font-normal text-intg-text-2">
                {label}
            </label>

            {atBtnClicked && (
                <DropdownMenu.Root open={atBtnClicked} onOpenChange={() => setAtBtnClicked(!atBtnClicked)}>
                    <DropdownMenu.Trigger asChild className="invisible">
                        <button>hello</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            sideOffset={40}
                            align="start"
                            alignOffset={3}
                            className="max-h-40 overflow-auto rounded-md bg-intg-bg-4 text-intg-text"
                        >
                            {props.attributes && (
                                <DropdownMenu.Label className="px-2 py-1 text-xs uppercase">
                                    attributes
                                </DropdownMenu.Label>
                            )}
                            {props.attributes &&
                                props.attributes.map((option) => (
                                    <DropdownMenu.Item
                                        key={option.value}
                                        className="cursor-pointer px-2 py-1 text-sm"
                                        onClick={() => {
                                            setSelectedOption(option);
                                            setAtBtnClicked(false);
                                        }}
                                    >
                                        {option.label}
                                    </DropdownMenu.Item>
                                ))}
                            <DropdownMenu.Separator className="border"></DropdownMenu.Separator>
                            {props.options && (
                                <DropdownMenu.Label className="px-2 py-1 text-xs uppercase">
                                    Recall from
                                </DropdownMenu.Label>
                            )}
                            {props.options &&
                                props.options.map((option) => (
                                    <DropdownMenu.Item key={option.value} className="cursor-pointer px-2 py-1 text-sm">
                                        {option.label}
                                    </DropdownMenu.Item>
                                ))}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            )}

            <TextInput
                onChange={(e) => {
                    setInputValue(e.target.value);
                    onChange(e);
                }}
                onKeyUp={(e) => {
                    if (e.key === "@") {
                        setAtBtnClicked(true);
                        setAtIndex(e.currentTarget.selectionStart!);
                    }
                }}
                value={inputValue}
                placeholder={placeholder}
                className="rounded-lg border border-transparent bg-[#272138] py-[6px] pl-1 text-sm font-medium tracking-[-0.408px] text-intg-text-1 placeholder:text-intg-text-3 focus:border-intg-text-3 focus:outline-none"
                disabled={maxCharacterCount === inputValue.length}
            />

            {showCharacterCount && (
                <div className="absolute bottom-0 right-0 translate-y-1/2 rounded bg-[#2B2045] p-1 text-xs text-intg-text">
                    {inputValue.length}/{maxCharacterCount}
                </div>
            )}
        </div>
    );
};
