import { cn } from "@/utils";
import { TextInput, TextInputProps } from "@tremor/react";

export interface EditorTextProps extends TextInputProps {
    label?: string;
    classname?: string;
    characterCount?: number;
    showCharacterCount?: boolean;
    maxCharacterCount?: number;
}

export const EditorTextInput = ({
    label,
    classname,
    characterCount = 0,
    showCharacterCount = true,
    maxCharacterCount = 5000,
    ...props
}: EditorTextProps) => {
    return (
        <div className={cn(`${classname} relative w-full`)}>
            <p className="text-sm text-intg-text-2">{label}</p>
            <TextInput
                {...props}
                className="rounded-lg border border-transparent bg-[#272138] py-[6px] pl-1 text-sm
                font-medium tracking-[-0.408px] text-intg-text-1 placeholder:text-intg-text-3
                focus:border-intg-text-3 focus:outline-none"
                disabled={maxCharacterCount === characterCount}
            />
            {showCharacterCount && (
                <div className="absolute bottom-0 right-0 translate-y-1/2 rounded bg-[#2B2045] p-1 text-xs text-intg-text">
                    {characterCount}/{maxCharacterCount}
                </div>
            )}
        </div>
    );
};
