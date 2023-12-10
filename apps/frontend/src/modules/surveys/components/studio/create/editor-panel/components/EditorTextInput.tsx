import { cn } from "@/utils";
import { TextInput, TextInputProps } from "@tremor/react";
<<<<<<< HEAD
export interface EditorTextProps extends TextInputProps {
    label?: string;
    classname?: string;
    placeholder?: string;
=======

export interface EditorTextProps extends TextInputProps {
    label?: string;
    classname?: string;
>>>>>>> ef1c73ed4d2649d315c838675480d41a2aa00e11
    characterCount?: number;
    showCharacterCount?: boolean;
    maxCharacterCount?: number;
}
<<<<<<< HEAD
export const EditorTextInput = ({
    label,
    classname,
    placeholder,
=======

export const EditorTextInput = ({
    label,
    classname,
>>>>>>> ef1c73ed4d2649d315c838675480d41a2aa00e11
    showCharacterCount = true,
    maxCharacterCount = 5000,
    ...props
}: EditorTextProps) => {
    return (
        <div className={cn(`${classname} relative w-full`)}>
<<<<<<< HEAD
            <label
                htmlFor={label}
                className="text-sm font-normal text-intg-text-2"
            >
                {label}
            </label>
            <TextInput
                {...props}
                placeholder={placeholder}
                className="my-4 rounded-lg border border-transparent bg-[#272138] py-[6px] pl-1
                text-sm font-medium tracking-[-0.408px] text-intg-text-1
                placeholder:text-intg-text-1 focus:border-intg-text-3 focus:outline-none"
=======
            <p className="text-sm text-intg-text-2">{label}</p>
            <TextInput
                {...props}
                className="rounded-lg border border-transparent bg-[#272138] py-[6px] pl-1 text-sm
                font-medium tracking-[-0.408px] text-intg-text-1 placeholder:text-intg-text-3 
                focus:border-intg-text-3 focus:outline-none"
>>>>>>> ef1c73ed4d2649d315c838675480d41a2aa00e11
                disabled={maxCharacterCount === props.characterCount}
            />
            {showCharacterCount && (
                <div className="absolute bottom-0 right-0 translate-y-1/2 rounded bg-[#2B2045] p-1 text-xs text-intg-text">
<<<<<<< HEAD
                    {props.characterCount}/{maxCharacterCount}
=======
                    {(props.characterCount)}/{maxCharacterCount}
>>>>>>> ef1c73ed4d2649d315c838675480d41a2aa00e11
                </div>
            )}
        </div>
    );
};
