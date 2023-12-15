import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { cn } from "@/utils";
import { useEffect, useState } from "react";
import { EditorTextInput } from "../../../components/EditorTextInput";
import MinusButton from "../Buttons/MinimizeButton";
import TextButton from "../Buttons/TextButton";

export const CTAFields = () => {
    const { updateQuestionMutation, currentQuestion } = useQuestion();

    const [showDescription, setShowDescription] = useState(false);
    const [titleText, setTitleText] = useState("");
    const [descriptionText, setDescriptionText] = useState("");

    useEffect(() => {
        if (currentQuestion?.node.description) {
            setShowDescription(true);
        }
    }, [showDescription, currentQuestion?.node.description]);

    return (
        <>
            <div>
                <EditorTextInput
                    placeholder="Could you please fill out our quick survey"
                    onChange={(e) => {
                        const newTitleText = e.target.value;
                        setTitleText(newTitleText);
                        updateQuestionMutation({
                            label: newTitleText,
                        });
                        // updateQuestionMutation({
                        //     label: newTitleText,
                        //     orderNumber: currentQuestion?.node.orderNumber,
                        // });
                    }}
                    value={currentQuestion?.node.label || ""}
                    characterCount={titleText.split("").length}
                />
                <div className="mt-4 flex justify-between gap-4">
                    <EditorTextInput
                        label={"Description"}
                        placeholder="Add description"
                        className="flex-1"
                        value={currentQuestion?.node.description || ""}
                        characterCount={descriptionText.split("").length}
                        onChange={(e) => {
                            const newDescriptionText = e.target.value;
                            setDescriptionText(newDescriptionText);
                            updateQuestionMutation({
                                description: newDescriptionText,
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
                                updateQuestionMutation({
                                    description: "",
                                });
                                setShowDescription(false);
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
