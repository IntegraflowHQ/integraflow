import { useProject } from "@/modules/projects/hooks/useProject";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { tagOptions } from "@/utils/question";
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

    return (
        <div className="space-x-8px">
            <EditorTextInput
                placeholder=""
                showMention={true}
                tagOptions={tagOptions(parsedQuestions, question!, personProperties)}
                onChange={(e) => {
                    updateQuestion(
                        {
                            label: e.target.value,
                        },
                        true,
                    );
                }}
                defaultValue={question?.label}
                maxCharacterCount={225}
            />

            {showDescription ? (
                <div className="mt-4 flex items-center justify-between gap-4">
                    <EditorTextInput
                        showMention={true}
                        label={"Description"}
                        placeholder=""
                        className="flex-1"
                        tagOptions={tagOptions(parsedQuestions, question!, personProperties)}
                        defaultValue={question?.description}
                        onChange={(e) => {
                            updateQuestion(
                                {
                                    description: e.target.value,
                                },
                                true,
                            );
                        }}
                        maxCharacterCount={5000}
                    />

                    <MinusButton
                        onclick={() => {
                            setShowDescription(false);
                            updateQuestion({
                                description: "",
                            });
                        }}
                    />
                </div>
            ) : null}

            <TextButton
                classname={`${showDescription ? "hidden" : "block"} mt-2`}
                text="Add description"
                onclick={() => setShowDescription(true)}
            />
        </div>
    );
};
