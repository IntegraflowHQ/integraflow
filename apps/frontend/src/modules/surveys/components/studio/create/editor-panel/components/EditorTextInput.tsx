import { cn, stripHtmlTags } from "@/utils";
import { getfromDB, sendToDB } from "@/utils/question";
import { StringMap } from "quill";
import "quill-mention";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useObserveScrollPosition } from "react-scroll-to-bottom";

export interface EditorTextProps {
    label?: string;
    className?: string;
    placeholder?: string;
    showCharacterCount?: boolean;
    maxCharacterCount?: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    tagOptions?: {
        id: string;
        value: string;
        type: string;
        disabled: boolean;
    }[];
    defaultValue?: string;
    showMention: boolean;
}

export const EditorTextInput = ({
    label,
    className,
    showCharacterCount = true,
    maxCharacterCount = 500,
    defaultValue,
    tagOptions,
    onChange,
    showMention = false,
}: EditorTextProps) => {
    const [textContent, setTextContent] = useState(getfromDB(defaultValue ?? "", tagOptions ?? []));
    const [displayInputField, setDisplayInputField] = useState(false);
    const [fallbackValue, setFallbackValue] = useState(" ");
    const [inputFieldPosition, setInputFieldPosition] = useState({ left: 0, bottom: 0 });

    const ref = useRef<ReactQuill>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mentionRef = useRef<HTMLSpanElement>();

    useEffect(() => {
        if (displayInputField && inputRef.current) {
            inputRef.current.focus();
        }
    }, [displayInputField]);

    useEffect(() => {
        if (!ref.current) {
            return;
        }
        const editor = ref.current.getEditor();
        const unprivilegedEditor = ref.current.makeUnprivilegedEditor(editor);
        onChange({
            target: {
                value: sendToDB(unprivilegedEditor?.getHTML()),
            },
        } as React.ChangeEvent<HTMLInputElement>);
    }, [fallbackValue]);

    const calculateFallbackPosition = useCallback(() => {
        if (!mentionRef.current) {
            return;
        }
        const { left, top } = mentionRef.current.getBoundingClientRect();
        setInputFieldPosition({ left, bottom: window.innerHeight - top });
    }, [mentionRef]);

    useObserveScrollPosition(calculateFallbackPosition);

    useEffect(() => {
        const handleMentionClick = (event: MouseEvent) => {
            const mentionSpan = (event.target as HTMLSpanElement)?.closest(".mention");
            if (mentionSpan) {
                mentionRef.current = mentionSpan as HTMLSpanElement;
                const newFallbackValue = mentionSpan.getAttribute("data-fallback");
                setDisplayInputField(true);
                setFallbackValue(newFallbackValue ?? "");
                calculateFallbackPosition();
            }
        };

        document.addEventListener("click", handleMentionClick);
        return () => {
            document.removeEventListener("click", handleMentionClick);
        };
    }, [displayInputField, fallbackValue]);

    const modules: StringMap = useMemo(() => {
        return {
            toolbar: false,
            syntax: false,
            mention: {
                allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
                allowInlineMentionChar: true,
                isolateCharacter: true,
                mentionDenotationChars: ["@"],
                showDenotationChar: false,
                spaceAfterInsert: true,
                positioningStrategy: "absolute",
                source: function (searchTerm: string, renderList: (list: unknown[]) => void) {
                    console.log(renderList);
                    if (searchTerm.startsWith(" ")) {
                        renderList([]);
                        return;
                    }
                    renderList(tagOptions as []);
                },
                onSelect: function (item: DOMStringMap, insertItem: (args: unknown) => unknown) {
                    const newItem = item;
                    const details = newItem?.id?.split(" ");
                    insertItem({
                        ...newItem,
                        value: item.value,
                        id: details ? details[0] : "",
                        type: details ? details[1] : "",
                        fallback: "",
                    });
                },
            },
        };
    }, []);

    return (
        <div className={cn(`${className} relative w-full`)}>
            <style>
                {`
                .mention{
                background-color: #392D72;
                    padding: 4px;
                    border-radius: 4px;
                }
                .mention::first-letter {
                    visibility: hidden;
                }
                .ql-mention-list-container {
                    overflow-y:scroll;
                    overflow-x: hidden;
                    max-width: 250px;
                    padding: 4px;
                    position: absolute;
                    z-index: 1000;
                    max-height: 200px;
                    background-color: #392D72;
                }
                .mention[aria-disabled="true"]{
                    background-color: purple;

                }
                `}
            </style>
            <label htmlFor={label} className="text-sm font-normal text-intg-text-2">
                {label}
            </label>

            {displayInputField && (
                <input
                    type="text"
                    ref={inputRef}
                    value={fallbackValue}
                    onChange={(e) => {
                        if (mentionRef.current) {
                            mentionRef.current.setAttribute("data-fallback", e.target.value);
                            setFallbackValue(e.target.value);
                        }
                    }}
                    className="mention-input border-0 bg-intg-bg-4 p-0.5 text-xs text-intg-text"
                    onBlur={() => {
                        setDisplayInputField(false);
                    }}
                    style={{
                        position: "fixed",
                        zIndex: 9,
                        left: inputFieldPosition.left,
                        bottom: inputFieldPosition.bottom + 5,
                    }}
                />
            )}
            {showMention ? (
                <ReactQuill
                    ref={ref}
                    theme="bubble"
                    onChange={(value) => {
                        setTextContent(value);
                        onChange({
                            target: {
                                value: sendToDB(value),
                            },
                        } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    defaultValue={textContent}
                    style={{
                        width: "100%",
                        backgroundColor: "#272138",
                    }}
                    formats={["mention"]}
                    modules={modules}
                />
            ) : (
                <ReactQuill
                    ref={ref}
                    theme="snow"
                    onChange={(value) => {
                        setTextContent(value);
                        onChange({
                            target: {
                                value: sendToDB(value),
                            },
                        } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    modules={{
                        toolbar: false,
                    }}
                    defaultValue={textContent}
                    style={{
                        width: "100%",
                        backgroundColor: "#272138",
                    }}
                />
            )}
            {showCharacterCount && (
                <div className="absolute bottom-0 right-0 translate-y-1/2 rounded bg-[#2B2045] p-1 text-xs text-intg-text">
                    {stripHtmlTags(defaultValue!)?.length}/{maxCharacterCount}
                </div>
            )}
        </div>
    );
};
