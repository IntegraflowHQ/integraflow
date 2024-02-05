import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useEffect, useState } from "react";
import { EditorTextInput } from "../../../components/EditorTextInput";
import MinusButton from "../Buttons/MinimizeButton";
import TextButton from "../Buttons/TextButton";

type Props = {
    question: SurveyQuestion;
};

export const CTAFields = ({ question }: Props) => {
    const { updateQuestionMutation } = useQuestion();

    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        if (question?.description) {
            setShowDescription(true);
        }
    }, [question?.description]);

    return (
        <>
            <div>
                <EditorTextInput
                    placeholder=""
                    onChange={(e) => {
                        updateQuestionMutation({
                            label: e.target.value,
                        });
                    }}
                    defaultValue={question?.label}
                    characterCount={question?.label?.split("").length}
                />
                {showDescription ? (
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <EditorTextInput
                            label={"Description"}
                            placeholder=""
                            className="flex-1"
                            defaultValue={question?.description}
                            characterCount={
                                question?.description?.split("").length
                            }
                            onChange={(e) => {
                                updateQuestionMutation({
                                    description: e.target.value,
                                });
                            }}
                        />
                        <div>
                            <MinusButton
                                onclick={() => {
                                    setShowDescription(false);
                                    updateQuestionMutation({
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
        </>
    );
};
