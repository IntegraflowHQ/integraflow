import { PropertyDefinition, SurveyStatusEnum } from "@/generated/graphql";
import { useProject } from "@/modules/projects/hooks/useProject";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { decodeText, encodeText, tagOptions } from "@/utils/question";
import { useEffect, useMemo, useState } from "react";
import { EditorTextInput } from "../../../components/EditorTextInput";
import MinusButton from "../Buttons/MinimizeButton";
import TextButton from "../Buttons/TextButton";

export const CTAFields = () => {
    const { updateQuestion, question } = useQuestion();
    const { parsedQuestions, survey } = useSurvey();
    const [showDescription, setShowDescription] = useState(false);
    const { personProperties } = useProject();

    useEffect(() => {
        if (question?.description) {
            setShowDescription(true);
        }
    }, [question?.description]);

    const mentionOptions = useMemo(() => {
        if (!question) {
            return [];
        }

        return tagOptions(parsedQuestions, question, personProperties as PropertyDefinition[]);
    }, [parsedQuestions, personProperties, question]);

    return (
        <div>
            <EditorTextInput
                placeholder="Enter your question here, use '@' to recall information."
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
                        placeholder="Enter your description here, use '@' to recall information."
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

            {survey?.status !== SurveyStatusEnum.Active ? (
                <TextButton
                    classname={`${showDescription ? "hidden" : "block"} mt-2`}
                    text="Add description"
                    onclick={() => setShowDescription(true)}
                />
            ) : null}
        </div>
    );
};
