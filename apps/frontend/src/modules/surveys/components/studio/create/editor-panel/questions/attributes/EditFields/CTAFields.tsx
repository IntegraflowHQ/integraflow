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

    useEffect(() => {
        if (question?.description) {
            setShowDescription(true);
        }
    }, [question?.description]);

    return (
        <div>
            <EditorTextInput
                placeholder=""
                options={tagOptions(parsedQuestions, question!)}
                onChange={(e) => {
                    updateQuestion(
                        {
                            label: e.target.value,
                        },
                        true,
                    );
                }}
                defaultValue={question?.label}
            />

            {showDescription ? (
                <div className="mt-4 flex items-center justify-between gap-4">
                    <EditorTextInput
                        label={"Description"}
                        placeholder=""
                        className="flex-1"
                        defaultValue={question?.description}
                        onChange={(e) => {
                            updateQuestion(
                                {
                                    description: e.target.value,
                                },
                                true,
                            );
                        }}
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
                classname={`${showDescription ? "hidden" : "block"}`}
                text="Add description"
                onclick={() => setShowDescription(true)}
            />
        </div>
    );
};
