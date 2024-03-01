import { TagOption } from "@/types";
import { cn, stripHtmlTags } from "@/utils";
import { decodeText, encodeText } from "@/utils/question";
import { TextInput } from "@tremor/react";
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
    tagOptions?: TagOption[];
    defaultValue?: string;
    showMention?: boolean;
    value?: string;
}

export const EditorTextInput = ({
    label,
    className,
    showCharacterCount = true,
    maxCharacterCount = 500,
    defaultValue,
    tagOptions,
    onChange,
    placeholder,
    showMention = false,
    value,
}: EditorTextProps) => {
    const [displayFallbackField, setDisplayFallbackField] = useState(false);
    const [fallbackValue, setFallbackValue] = useState(" ");
    const [fallbackFieldPosition, setFallbackFieldPosition] = useState({ left: 0, bottom: 0 });

    const ref = useRef<ReactQuill>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mentionRef = useRef<HTMLSpanElement>();

    useEffect(() => {
        if (displayFallbackField && inputRef.current) {
            inputRef.current.focus();
        }
    }, [displayFallbackField]);

    useEffect(() => {
        if (!ref.current) {
            return;
        }
        const editor = ref.current.getEditor();
        const unprivilegedEditor = ref.current.makeUnprivilegedEditor(editor);
        onChange({
            target: {
                value: encodeText(unprivilegedEditor?.getHTML()),
            },
        } as React.ChangeEvent<HTMLInputElement>);
    }, [fallbackValue]);

    const calculateFallbackPosition = useCallback(() => {
        if (!mentionRef.current) {
            return;
        }
        const { left, top } = mentionRef.current.getBoundingClientRect();
        setFallbackFieldPosition({ left, bottom: window.innerHeight - top });
    }, [mentionRef]);

    useObserveScrollPosition(calculateFallbackPosition);

    useEffect(() => {
        const handleMentionClick = (event: MouseEvent) => {
            const mentionSpan = (event.target as HTMLSpanElement)?.closest(".mention");
            if (mentionSpan) {
                mentionRef.current = mentionSpan as HTMLSpanElement;
                const newFallbackValue = mentionSpan.getAttribute("data-fallback");
                setDisplayFallbackField(true);
                setFallbackValue(newFallbackValue ?? "");
                calculateFallbackPosition();
            }
        };

        document.addEventListener("click", handleMentionClick);
        return () => {
            document.removeEventListener("click", handleMentionClick);
        };
    }, [displayFallbackField, fallbackValue]);

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
                .ql-mention-list-container {
                    border-radius:4px;
                    overflow-y:scroll;
                    overflow-x: hidden;
                    width: 180px;
                    padding: 4px;
                    position: absolute;
                    z-index: 1000;
                    max-height: 200px;
                    background-color: #392D72;
                }
                .ql-mention-list-item {
                    cursor: pointer;
                    padding: 1px 1px;
                }
                .ql-mention-list-item[data-disabled="true"]{
                    pointer-events:none;
                    font-weight:600;
                    font-size: 12px;
                }
                .mention[aria-disabled="true"]{
                    background-color: purple;
                }
                `}
            </style>
            <label htmlFor={label} className="text-sm font-normal text-intg-text-2">
                {label}
            </label>

            {displayFallbackField && (
                <input
                    type="text"
                    ref={inputRef}
                    value={fallbackValue}
                    placeholder="Fallback"
                    onChange={(e) => {
                        if (mentionRef.current) {
                            mentionRef.current.setAttribute("data-fallback", e.target.value);
                            setFallbackValue(e.target.value);
                        }
                    }}
                    className="mention-input border-0 bg-intg-bg-4 p-0.5 text-xs text-intg-text"
                    onBlur={() => {
                        setDisplayFallbackField(false);
                    }}
                    style={{
                        position: "fixed",
                        zIndex: 9,
                        left: fallbackFieldPosition.left,
                        bottom: fallbackFieldPosition.bottom + 5,
                    }}
                    disabled={maxCharacterCount === stripHtmlTags(defaultValue!)?.length}
                />
            )}
            {showMention ? (
                <ReactQuill
                    ref={ref}
                    theme="bubble"
                    onChange={(value) => {
                        onChange({
                            target: {
                                value: encodeText(value),
                            },
                        } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    defaultValue={decodeText(defaultValue ?? "", tagOptions ?? [])}
                    style={{
                        width: "100%",
                        backgroundColor: "#272138",
                        borderRadius: "8px",
                    }}
                    formats={["mention"]}
                    modules={modules}
                />
            ) : (
                <TextInput
                    onChange={(e) => {
                        onChange(e);
                    }}
                    value={value}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    className="rounded-lg border border-transparent bg-[#272138] text-sm text-intg-text-1 placeholder:text-intg-text-3 focus:border-intg-text-3 focus:outline-none"
                    disabled={maxCharacterCount === stripHtmlTags(defaultValue!)?.length}
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
