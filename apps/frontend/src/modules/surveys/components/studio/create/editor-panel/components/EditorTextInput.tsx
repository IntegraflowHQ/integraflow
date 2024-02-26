import { cn, stripHtmlTags } from "@/utils";
import { StringMap } from "quill";
import "quill-mention";
import { useMemo, useState } from "react";
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
}

export const EditorTextInput = ({
    label,
    className,
    showCharacterCount = true,
    maxCharacterCount = 500,
    defaultValue,
    options,
    onChange,
}: EditorTextProps) => {
    const [textContent, setTextContent] = useState(decode(defaultValue ?? ""));

    const [displayFallbackField, setDisplayFallbackField] = useState(false);

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
                    insertItem({ ...newItem, value: item.value, id: details[0], type: details[1] });
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
        // Replace span tags with placeholders
        const encodedText = textContent.replace(
            /<span class="mention"([^>]*)data-id="([^"]*)"([^>]*)data-type="([^"]*)"([^>]*)>(.*?)<\/span>/g,
            (_, __, dataId, ___, dataType) => {
                if (dataId === "attribute") {
                    return `{{${dataType}}}`;
                }
                return `{{${dataType}:${dataId}}}`;
            },
        );

        return encodedText.split("</span>").join("");
    }

    function decode(encodedText: string): string {
        // Replace placeholders with actual HTML tags
        const decodedText = encodedText
            .replace(/{{answer:([^}]+)}}/g, (match, id) => {
                return `<span class="mention" data-index="4" data-denotation-char="" data-value="${resolveQuestionIndex(id)}" data-id="${id}" data-type="answer">﻿<span contenteditable="false">${resolveQuestionIndex(id)}</span>﻿</span>`;
            })
            .replace(/{{attribute.([^}]+)}}/g, (_, attr) => {
                return `<span class="mention" data-index="4" data-denotation-char="" data-value="${attr}" data-id="attribute" data-type="attribute.${attr}">﻿<span contenteditable="false">${attr}</span>﻿</span>`;
            });

        return decodedText + " ";
    }

    const handleMentionClicked = (event: Event) => {
        setDisplayFallbackField(true);
    };

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
            <ReactQuill
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
                defaultValue={defaultValue}
                style={{
                    height: "2.5rem",
                    width: "100%",
                    backgroundColor: "#272138",
                }}
                formats={["mention"]}
                modules={modules}
            />
            {showCharacterCount && (
                <div className="absolute bottom-0 right-0 translate-y-1/2 rounded bg-[#2B2045] p-1 text-xs text-intg-text">
                    {stripHtmlTags(defaultValue!)?.length}/{maxCharacterCount}
                </div>
            )}
        </div>
    );
};
