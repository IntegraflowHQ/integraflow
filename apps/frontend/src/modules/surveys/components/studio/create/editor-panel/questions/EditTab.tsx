import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { cn } from "@/utils";
import { questionTypes } from "@/utils/survey";
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
    question: SurveyQuestion
};

export const EditTab = ({ orderNumber, question }: Props) => {
    console.log(question);
    const [showDescription, setShowDescription] = useState(false);
    const [titleText, setTitleText] = useState("");
    const [descriptionText, setDescriptionText] = useState("");
    const [choiceInput, setChoiceInput] = useState("");


    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <div>
                    <img
                        src={
                            questionTypes.find(
                                (type) => type.type === question.type,
                            )?.icon
                        }
                        alt="icon"
                    />
                </div>
                <span className="font-bold text-sm text-intg-text-9">
                    {question.orderNumber < 10
                        ? `0${question.orderNumber}`
                        : question.orderNumber}
                </span>
                <span className="text-sm font-bold">Question</span>
            </div>
            {/* CTA */}
            <div>
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

            {question.type === SurveyQuestionTypeEnum.Single ||
                question.type === SurveyQuestionTypeEnum.Multiple ? (
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
                ): null}

            {/* Multiple Selection */}

            {question.type === SurveyQuestionTypeEnum.Form && (
                <div>
                    <div className="flex justify-between">
                        <p className="flex-1">Form Type</p>
                        <p className="flex-1">Label</p>
                    </div>
                    <FormOptionBlock />
                </div>
            )}
        </div>
    );
};
