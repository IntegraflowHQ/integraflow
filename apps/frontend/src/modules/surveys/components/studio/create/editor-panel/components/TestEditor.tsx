import { cn } from "@/utils";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export interface EditorTextProps {
    label?: string;
    className?: string;
    placeholder?: string;
    showCharacterCount?: boolean;
    maxCharacterCount?: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    options?: {
        id: string;
        value: string;
        type: string;
    }[];
    defaultValue?: string;
    showMention: boolean;
}

export const TestEditor = ({
    label,
    className,

    defaultValue,
    options,
}: EditorTextProps) => {
    const [textContent, setTextContent] = useState(defaultValue ?? "");
    const [input, setInput] = useState("");
    const [atClicked, setAtClicked] = useState(false);
    const [displayFallbackField, setDisplayFallbackField] = useState(false);

    return (
        <div className={cn(`${className} w-full`)}>
            <label htmlFor={label} className="text-sm font-normal text-intg-text-2">
                {label}
            </label>

            {displayFallbackField && (
                <input
                    type="text"
                    className={`z-2147483650 absolute  bottom-0 left-0 w-28 border`}
                    // ref={inputRef}
                    onBlur={() => setDisplayFallbackField(false)}
                />
            )}

            <ReactQuill
                theme="snow"
                onChange={(value, delta, source, editor) => {
                    setInput(value);
                    if (atClicked) {
                        console.log(delta);
                        setAtClicked(false);
                    }
                }}
                onKeyUp={(e) => {
                    if (e.key === "@") {
                        setAtClicked(true);
                    }
                }}
                modules={{
                    toolbar: false,
                }}
                value={input}
                style={{
                    height: "2.5rem",
                    width: "100%",
                    border: "1px solid red",
                    backgroundColor: "red",
                }}
            />
        </div>
    );
};

type TagProps = {
    classname: string;
    text: string;
};
const customTag = ({ classname = "mention", text }: TagProps) => {
    return <span className="mention">{text}</span>;
};
