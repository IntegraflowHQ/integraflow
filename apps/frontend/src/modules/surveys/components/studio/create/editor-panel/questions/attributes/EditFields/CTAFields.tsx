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
    const [titleText, setTitleText] = useState(question?.label);
    const [descriptionText, setDescriptionText] = useState(
        question?.description,
    );

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
                        setTitleText(e.target.value);
                        updateQuestionMutation({
                            label: e.target.value,
                        });
                    }}
                    value={titleText}
                    characterCount={titleText?.split("").length}
                />
                {showDescription ? (
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <EditorTextInput
                            label={"Description"}
                            placeholder=""
                            className="flex-1"
                            value={descriptionText}
                            characterCount={descriptionText?.split("").length}
                            onChange={(e) => {
                                setDescriptionText(e.target.value);
                                updateQuestionMutation({
                                    description: e.target.value,
                                });
                            }}
                        />
                        <div>
                            <MinusButton
                                onclick={() => {
                                    setDescriptionText("");
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
