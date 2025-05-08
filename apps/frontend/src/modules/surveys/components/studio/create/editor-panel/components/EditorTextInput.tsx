import { SurveyStatusEnum } from "@/generated/graphql";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { MentionItem, MentionOption } from "@/types";
import { cn, stripHtmlTags } from "@/utils";
import { encodeText } from "@/utils/question";
import { TextInput } from "@tremor/react";
import { StringMap } from "quill";
import "quill-mention";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
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
    mentionOptions?: MentionOption[];
    defaultValue?: string;
    showMention?: boolean;
    value?: string;
    dataTestid?: string;
}

export const EditorTextInput = ({
    label,
    className,
    showCharacterCount = true,
    maxCharacterCount = 500,
    defaultValue,
    mentionOptions = [],
    onChange,
    placeholder,
    showMention = false,
    value,
    dataTestid,
}: EditorTextProps) => {
    const [displayFallbackField, setDisplayFallbackField] = useState(false);
    const [fallbackValue, setFallbackValue] = useState("");
    const [fallbackFieldPosition, setFallbackFieldPosition] = useState({ left: 0, bottom: 0 });

    const id = useId();
    const { survey } = useSurvey();

    const ref = useRef<ReactQuill>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mentionRef = useRef<HTMLSpanElement>();

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

    useEffect(() => {
        document.getElementById(id)?.addEventListener("click", handleMentionClick);
        return () => {
            document.getElementById(id)?.removeEventListener("click", handleMentionClick);
        };
    }, [id]);

    const handleFallbackChange = () => {
        if (!ref.current?.unprivilegedEditor) {
            return;
        }
        onChange({
            target: {
                value: encodeText(ref.current.unprivilegedEditor.getHTML()),
            },
        } as React.ChangeEvent<HTMLInputElement>);
    };

    const calculateFallbackPosition = useCallback(() => {
        if (!mentionRef.current) {
            return;
        }
        const { left, top } = mentionRef.current.getBoundingClientRect();
        setFallbackFieldPosition({ left, bottom: window.innerHeight - top });
    }, [mentionRef]);

    useObserveScrollPosition(calculateFallbackPosition);

    const modules: StringMap = useMemo(() => {
        const tagOptions: MentionItem[] = mentionOptions.flatMap((opts) => [
            { id: opts.title, value: opts.title, type: opts.title, disabled: true },
            ...opts.items,
        ]);

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

    const calculateCharacterCount = (showMention: boolean) => {
        if (!defaultValue) return 0;

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = defaultValue;

        const mentions = tempDiv.querySelectorAll(".mention");

        mentions.forEach((mention) => mention.remove());

        const textWithoutMentions = tempDiv.textContent || "";
        const textLength = textWithoutMentions.length;

        return showMention ? textLength - 1 : textLength;
    };

    return (
        <div className={cn(`${className} ${label ? "space-y-2" : ""} relative w-full`)}>
            <style>
                {`
                    .mention{
                        background-color: #392D72;
                        border-radius: 2px;
                        padding: 4px;
                    }
                    .mention span {
                        display: inline-block;
                        max-width: 100px;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: clip
                    }
                    .ql-mention-list-container {
                        background-color:#181325;
                        border: 1px solid #392D72;
                        border-radius:8px;
                        overflow-y:auto;
                        overflow-x: hidden;
                        position: absolute;
                        max-height: 245px;
                        padding: 8px;
                        width: 200px;
                        z-index:1000;
                        font-family: inherit;
                        color: #AFAAC7
                    }
                    .ql-mention-list-container-bottom{
                        background-color: #181325;
                        width: 200px;
                        padding: 8px;
                    }
                    .ql-mention-list {
                        width:100%;
                    }
                    .ql-mention-list-item {
                        cursor: pointer;
                        font-size: 14px;
                        padding:8px;
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .ql-mention-list-item:hover {
                        background-color:#272138;
                        border-radius:8px;
                    }
                    .ql-mention-list-item[data-disabled="true"]{
                        pointer-events:none;
                        font-weight:600;
                        font-size: 14px;
                        margin-bottom: -6px;
                    }
                    .ql-editor.ql-blank::before {
                        color: #9582C0;
                        font-style: normal;
                    }
                    .mention[aria-disabled="true"]{
                        background-color: purple;
                    }
                `}
            </style>
            <label htmlFor={label} className="text-sm text-intg-text-2">
                {label}
            </label>

            {displayFallbackField && (
                <input
                    type="text"
                    ref={inputRef}
                    defaultValue={fallbackValue}
                    placeholder="Fallback"
                    autoFocus={true}
                    onChange={(e) => {
                        if (mentionRef.current) {
                            mentionRef.current.setAttribute("data-fallback", e.target.value);
                            handleFallbackChange();
                        }
                    }}
                    className="mention-input min-h-[30px] border-0 bg-intg-bg-4 px-[10px] py-0 text-xs text-intg-text"
                    onBlur={() => {
                        setDisplayFallbackField(false);
                        setFallbackValue("");
                    }}
                    style={{
                        position: "fixed",
                        zIndex: 9,
                        left: fallbackFieldPosition.left,
                        bottom: fallbackFieldPosition.bottom + 5,
                    }}
                    disabled={maxCharacterCount === stripHtmlTags(defaultValue ?? "")?.length}
                />
            )}
            {showMention ? (
                <ReactQuill
                    id={id}
                    ref={ref}
                    theme="bubble"
                    onChange={(value) => {
                        onChange({
                            target: {
                                value,
                            },
                        } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    style={{
                        width: "100%",
                        backgroundColor: "#272138",
                        borderRadius: "8px",
                    }}
                    formats={["mention"]}
                    modules={modules}
                    readOnly={survey?.status === SurveyStatusEnum.Active}
                />
            ) : (
                <TextInput
                    onChange={(e) => {
                        onChange(e);
                    }}
                    value={value}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    data-testid={dataTestid}
                    className="rounded-lg border border-transparent bg-[#272138] text-sm text-intg-text-1 placeholder:text-intg-text-3 focus:border-intg-text-3 focus:outline-none"
                    disabled={maxCharacterCount === stripHtmlTags(defaultValue ?? "")?.length}
                    readOnly={survey?.status === SurveyStatusEnum.Active}
                />
            )}
            {showCharacterCount && (
                <div className="absolute bottom-0 right-0 translate-y-1/2 rounded bg-[#2B2045] p-1 text-xs text-intg-text">
                    {calculateCharacterCount(showMention)} / {maxCharacterCount}
                </div>
            )}
        </div>
    );
};
