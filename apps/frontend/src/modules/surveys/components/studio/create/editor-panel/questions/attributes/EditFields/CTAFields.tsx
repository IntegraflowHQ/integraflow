import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { recallOptions, userAttributeOptions } from "@/utils/question";
import { useEffect, useState } from "react";
import { EditorTextInput } from "../../../components/EditorTextInput";
import MinusButton from "../Buttons/MinimizeButton";
import TextButton from "../Buttons/TextButton";

export const CTAFields = () => {
    const { updateQuestionMutation, openQuestion } = useQuestion();
    const { parsedQuestions } = useSurvey();

    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        if (openQuestion?.description) {
            setShowDescription(true);
        }
    }, [openQuestion?.description]);

    return (
        <>
            <div>
                <EditorTextInput
                    placeholder=""
                    options={recallOptions(parsedQuestions, openQuestion!)}
                    attributes={userAttributeOptions}
                    onChange={(e) => {
                        updateQuestionMutation({
                            label: e.target.value,
                        });
                    }}
                    defaultValue={openQuestion?.label}
                    characterCount={openQuestion?.label?.split("").length}
                />
                {showDescription ? (
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <EditorTextInput
                            label={"Description"}
                            placeholder=""
                            className="flex-1"
                            defaultValue={openQuestion?.description}
                            characterCount={
                                openQuestion?.description?.split("").length
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
