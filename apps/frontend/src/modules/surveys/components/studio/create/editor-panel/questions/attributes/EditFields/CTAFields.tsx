import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { cn } from "@/utils";
import { useEffect, useState } from "react";
import { EditorTextInput } from "../../../components/EditorTextInput";
import MinusButton from "../Buttons/MinimizeButton";
import TextButton from "../Buttons/TextButton";

export const CTAFields = () => {
    const { updateQuestionMutation, openQuestion } = useQuestion();

    const [showDescription, setShowDescription] = useState(false);
    const [titleText, setTitleText] = useState(openQuestion?.label);
    const [descriptionText, setDescriptionText] = useState(
        openQuestion?.description,
    );

    console.log(openQuestion?.description);

    // useEffect(() => {
    //     if (openQuestion?.description) {
    //         setShowDescription(true);
    //     }
    // }, [showDescription, openQuestion?.description]);

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
                <div className="mt-4 flex justify-between gap-4">
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
                        classname={cn(
                            `${showDescription ? "block" : "hidden"}`,
                        )}
                    />
                    <div
                        className={cn(
                            ` ${showDescription ? "block" : "hidden"} mt-6 w-6`,
                        )}
                    >
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
                <TextButton
                    classname={`${showDescription ? "hidden" : "block"}`}
                    text="Add description"
                    onclick={() => setShowDescription(true)}
                />
            </div>
        </>
    );
};
