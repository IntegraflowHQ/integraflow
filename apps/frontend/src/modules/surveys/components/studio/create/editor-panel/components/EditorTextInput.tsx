import { cn, stripHtmlTags } from "@/utils";
import { StringMap } from "quill";
import "quill-mention";
import { useEffect, useMemo, useRef, useState } from "react";
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

export const EditorTextInput = ({
    label,
    className,
    showCharacterCount = true,
    maxCharacterCount = 500,
    defaultValue,
    options,
    onChange,
    showMention = true,
}: EditorTextProps) => {
    const [textContent, setTextContent] = useState(decode(defaultValue ?? ""));
    const [displayInputField, setDisplayInputField] = useState(false);
    const [fallbackValue, setFallbackValue] = useState(" ");
    const [inputFieldPosition, setInputFieldPosition] = useState({ left: 0, bottom: 0 });

    const ref = useRef<ReactQuill>(null);
    const mentionRef = useRef<HTMLSpanElement>();
    console.log("textContent: ", textContent);

    useEffect(() => {
        if (!ref.current) {
            return;
        }
        console.log("fallback: ", fallbackValue);
        const editor = ref.current.getEditor();
        const unprivilegedEditor = ref.current.makeUnprivilegedEditor(editor);
        onChange({
            target: {
                value: encode(unprivilegedEditor?.getHTML()),
            },
        } as React.ChangeEvent<HTMLInputElement>);
        // console.log(unprivilegedEditor.getHTML());
    }, [fallbackValue]);

    // useEffect(() => {
    //     const calculateFallbackPosition = () => {
    //         if (!mentionRef.current) {
    //             return;
    //         }

    //         const { left, top } = mentionRef.current.getBoundingClientRect();

    //         setDisplayInputField(true);
    //         setInputFieldPosition({ left, bottom: window.innerHeight - top });
    //     };

    //     mentionRef.current?.addEventListener("scroll", calculateFallbackPosition);
    //     window.addEventListener("resize", calculateFallbackPosition);

    //     return () => {
    //         mentionRef.current?.removeEventListener("", calculateFallbackPosition);
    //         window.removeEventListener("resize", calculateFallbackPosition);
    //     };
    // }, [mentionRef]);

    useEffect(() => {
        const handleMentionClick = (event) => {
            const mentionSpan = event.target.closest(".mention");

            if (mentionSpan) {
                mentionRef.current = mentionSpan;
                const { left, top } = mentionSpan.getBoundingClientRect();
                setDisplayInputField(true);
                setInputFieldPosition({ left, bottom: window.innerHeight - top });
            }
        };

        document.addEventListener("click", handleMentionClick);
        return () => {
            document.removeEventListener("click", handleMentionClick);
        };
    }, [displayInputField]);

    useEffect(() => {
        const handleInputChange = (event) => {
            const mentionSpan = document.querySelector('.mention[data-fallback="true"]');
            if (mentionSpan) {
                mentionSpan.setAttribute("data-fallback", event.target.value);
            }
        };

        const inputField = document.querySelector(".mention-input");
        if (inputField) {
            inputField.addEventListener("input", handleInputChange);
        }

        return () => {
            if (inputField) {
                inputField.removeEventListener("input", handleInputChange);
            }
        };
    }, []);

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
                source: function (searchTerm, renderList, mentionChar) {
                    if (searchTerm.startsWith(" ")) {
                        renderList([]);
                        return;
                    }
                    renderList(options);
                },
                onSelect: function (item, insertItem) {
                    const newItem = item;
                    const details = newItem.id.split(" ");
                    insertItem({ ...newItem, value: item.value, id: details[0], type: details[1], fallback: " " });
                },
            },
        };
    }, []);

    function resolveQuestionIndex(questionId: string): string {
        const option = options?.find((o) => {
            const optionId = o.id.split(" ")[0];
            return questionId === optionId;
        });

        return option?.value as string;
    }

    function encode(textContent: string): string {
        const encodedText = textContent.replace(
            /<span class="mention"([^>]*)data-id="([^"]*)"([^>]*)data-type="([^"]*)"([^>]*)data-fallback="([^"]*)"([^>]*)>(.*?)<\/span>/g,
            (_, __, dataId, ___, dataType, ____, fallback) => {
                console.log(dataId, dataType, fallback);
                if (dataId === "attribute") {
                    return `{{${dataType}|${fallback}}}`;
                }
                return `{{${dataType}:${dataId}|${fallback}}}`;
            },
        );

        return encodedText.split("</span>").join("");
    }

    function decode(encodedText: string): string {
        const decodedText = encodedText
            .replace(/{{answer:([^}]+)\|([^}]+)}}/g, (_, id, fallback) => {
                return `<span class="mention" data-index="4" data-denotation-char="" data-value="${resolveQuestionIndex(id)}" data-id="${id}" data-type="answer" data-fallback="${fallback}">﻿<span contenteditable="false">${resolveQuestionIndex(id)}</span>﻿</span>`;
            })
            .replace(/{{attribute.([^}]+)\|([^}]+)}}/g, (_, attr, fallback) => {
                return `<span class="mention" data-index="4" data-denotation-char="" data-value="${attr}" data-id="attribute" data-type="attribute.${attr}" data-fallback="${fallback}">﻿<span contenteditable="false">${attr}</span>﻿</span>`;
            });

        return decodedText + " ";
    }

    return (
        <div className={cn(`${className} w-full`)}>
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
                    width: 100px;
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
                    onChange={(e) => {
                        if (mentionRef.current) {
                            if (e.target.value === "") {
                                mentionRef.current.setAttribute("data-fallback", " ");
                                setFallbackValue(e.target.value);
                            } else if (e.target.value) {
                                mentionRef.current.setAttribute("data-fallback", e.target.value);
                                setFallbackValue(e.target.value);
                            }
                        }
                    }}
                    className="mention-input"
                    style={{
                        position: "fixed",
                        left: inputFieldPosition.left,
                        bottom: inputFieldPosition.bottom,
                    }}
                />
            )}
            {showMention ? (
                <ReactQuill
                    ref={ref}
                    theme="bubble"
                    onChange={(value, delta, source, editor) => {
                        setTextContent(value);
                        onChange({
                            target: {
                                value: encode(value),
                            },
                        } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    value={textContent}
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
                    onChange={(value, delta, source, editor) => {
                        setTextContent(value);
                        onChange({
                            target: {
                                value: encode(value),
                            },
                        } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    modules={{
                        toolbar: false,
                    }}
                    value={textContent}
                    style={{
                        height: "2.5rem",
                        width: "100%",
                        border: "1px solid red",
                        backgroundColor: "red",
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
