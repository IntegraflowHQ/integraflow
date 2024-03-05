import { PropertyDefinition } from "@/generated/graphql";
import { useProject } from "@/modules/projects/hooks/useProject";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { decodeText, encodeText, tagOptions } from "@/utils/question";
import { useEffect, useState } from "react";
import { EditorTextInput } from "../../../components/EditorTextInput";
import MinusButton from "../Buttons/MinimizeButton";
import TextButton from "../Buttons/TextButton";

export const CTAFields = () => {
    const { updateQuestion, question } = useQuestion();
    const { parsedQuestions } = useSurvey();
    const [showDescription, setShowDescription] = useState(false);
    const { personProperties } = useProject();

    useEffect(() => {
        if (question?.description) {
            setShowDescription(true);
        }
    }, [question?.description]);

    const mentionOptions = !question
        ? []
        : tagOptions(parsedQuestions, question, personProperties as PropertyDefinition[]);

    return (
        <div>
            <EditorTextInput
                placeholder=""
                showMention={true}
                mentionOptions={mentionOptions}
                onChange={(e) => {
                    updateQuestion(
                        {
                            label: encodeText(e.target.value),
                        },
                        true,
                    );
                }}
                defaultValue={decodeText(question?.label ?? "", mentionOptions)}
                maxCharacterCount={225}
            />

            {showDescription ? (
                <div className="mt-4 flex items-center justify-between gap-4">
                    <EditorTextInput
                        showMention={true}
                        label={"Description"}
                        placeholder=""
                        className="flex-1"
                        mentionOptions={mentionOptions}
                        defaultValue={decodeText(question?.description ?? "", mentionOptions)}
                        onChange={(e) => {
                            updateQuestion(
                                {
                                    description: encodeText(e.target.value),
                                },
                                true,
                            );
                        }}
                        maxCharacterCount={5000}
                    />

                    <div className="self-end">
                        <MinusButton
                            onclick={() => {
                                setShowDescription(false);
                                updateQuestion({
                                    description: "",
                                });
                            }}
                        />
                    </div>
                </div>
            ) : null}

            <TextButton
                classname={`${showDescription ? "hidden" : "block"}`}
                text="Add description"
                onclick={() => setShowDescription(true)}
            />
        </div>
    );
};
