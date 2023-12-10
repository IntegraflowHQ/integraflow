import { useSurveyStore } from "@/modules/surveys/states/survey";
import { cn } from "@/utils";
import { useState } from "react";
import { EditorTextInput } from "../components/EditorTextInput";
import { AddMultipleQuestions } from "./attributes/AddMultipleQuestions";
import MinimizeButton from "./attributes/Buttons/MinimizeButton";
import TextButton from "./attributes/Buttons/TextButton";
import { FormOptionBlock } from "./attributes/FormOptionBlock";
import SelectOptionBlock from "./attributes/SelectOptionBlock";

type Props = {
    questionType: string;
    orderNumber?: number;
};

export const EditTab = ({ questionType, orderNumber }: Props) => {
    const [showDescription, setShowDescription] = useState(false);
    const [titleText, setTitleText] = useState("");
    const [descriptionText, setDescriptionText] = useState("");
    const [choiceInput, setChoiceInput] = useState("");

    const { questions } = useSurveyStore();
    console.log(questions);

    return (
        <div className="space-y-6">
            {/* CTA */}
            <div className="border">
                <EditorTextInput
                    placeholder="Could you please fill out our quick survey"
                    onChange={(e) => {
                        setTitleText(e.target.value);
                    }}
                    value={titleText}
                    characterCount={titleText.split("").length}
                />
                <div className="mt-4 flex justify-between space-x-4">
                    <EditorTextInput
                        label={"Description"}
                        placeholder="Add description"
                        className="flex-1"
                        value={descriptionText}
                        characterCount={descriptionText.split("").length}
                        onChange={(e) => setDescriptionText(e.target.value)}
                        classname={cn(
                            `${showDescription ? "block" : "hidden"}`,
                        )}
                    />
                    <div
                        className={cn(
                            ` ${showDescription ? "block" : "hidden"} mt-6 w-6`,
                        )}
                    >
                        <MinimizeButton
                            onclick={() => setShowDescription(false)}
                        />
                    </div>
                </div>
                <TextButton
                    classname={`${showDescription ? "hidden" : "block"}`}
                    text="Add description"
                    onclick={() => setShowDescription(true)}
                />
            </div>
            {/* CTA */}

            {/* MUltiple Selection */}
            <div className="space-y-4">
                <div className="flex justify-between text-sm">
                    <p>Answer Choices</p>
                    <AddMultipleQuestions
                        getValue={(value) => console.log(value)}
                    />
                </div>
                <div>
                    <SelectOptionBlock
                        onChange={(e) => setChoiceInput(e.target.value)}
                        characterCount={choiceInput.split("").length}
                    />
                </div>
                <TextButton
                    text={"Add an answer at choice"}
                    onclick={() => {}}
                />
            </div>
            {/* Multiple Selection */}

            <div>
                <div className="flex justify-between">
                    <p className="flex-1">Form Type</p>
                    <p className="flex-1">Label</p>
                </div>
                <FormOptionBlock />
            </div>
        </div>
    );
};
