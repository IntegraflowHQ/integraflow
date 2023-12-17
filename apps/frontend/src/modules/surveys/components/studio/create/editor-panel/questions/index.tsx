import { addEllipsis, cn } from "@/utils";
import * as Accordion from "@radix-ui/react-accordion";
import { useState } from "react";
import { QuestionOptions } from "./attributes/QuestionTypes";

import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { questionTypes } from "@/utils/survey";
import { LucideTrash2 } from "lucide-react";
import { QuestionPanel } from "./QuestionPanel";

export default function UpdateQuestion() {
    const { parsedQuestions } = useSurvey();

    const { deleteQuestionMutation, openQuestion, setOpenQuestion } =
        useQuestion();
    const [showDeleteButton, setShowDeleteButton] = useState<
        SurveyQuestion | undefined
    >(undefined);
    const [currentQuestionType, setCurrentQuestionType] = useState<
        SurveyQuestionTypeEnum | undefined
    >();


    return (
        <div className="h-full w-full space-y-4 pt-2">
            <div>
                <Accordion.Root
                    type="single"
                    collapsible={true}
                    value={openQuestion?.id}
                    className="space-y-4"
                    defaultValue={parsedQuestions?.[0]?.id}
                >
                    {parsedQuestions?.map((question) => {
                        return (
                            <Accordion.Item
                                onClick={() => {
                                    // setCurrentQuestionType(question.type);
                                    setOpenQuestion(question);
                                }}
                                value={question.id}
                                key={question.id}
                            >
                                <Accordion.Header>
                                    <Accordion.Trigger
                                        value={question.id}
                                        // onMouseEnter={() => {
                                        //     setShowDeleteButton(question);
                                        // }}
                                        // onMouseLeave={() => {
                                        //     setShowDeleteButton(undefined);
                                        // }}
                                        onClick={() => {
                                            // setOpenQuestion(question);
                                        }}
                                        className={cn(
                                            ` ${
                                                openQuestion?.id === question.id
                                                    ? "hidden"
                                                    : "block"
                                            } text-intg-text-7" flex w-full items-center justify-between gap-2 rounded-lg bg-intg-bg-9 p-4`,
                                        )}
                                    >
                                        <div
                                            className="flex items-center gap-4 border"
                                            // onClick={() =>
                                            //     setOpenQuestion(question)
                                            // }
                                        >
                                            <div>
                                                <img
                                                    src={
                                                        questionTypes.find(
                                                            (type) =>
                                                                type.type ===
                                                                question.type,
                                                        )?.icon
                                                    }
                                                    alt="icon"
                                                />
                                            </div>
                                            <div className="text-sm font-bold text-intg-text-9">
                                                {question.orderNumber < 10
                                                    ? `0${question.orderNumber}`
                                                    : question.orderNumber}
                                            </div>
                                            <div className="w-[415px] rounded-lg bg-intg-bg-15 px-[16px] py-4 text-start text-intg-text-1 ">
                                                {addEllipsis(
                                                    "Lorem ipsum dolor sit, ametconsectetur adipisicing elit.",
                                                    40,
                                                )}
                                            </div>
                                        </div>

                                        {showDeleteButton?.id ===
                                            question.id && (
                                            <div className="flex gap-6">
                                                <LucideTrash2
                                                    color="purple"
                                                    onClick={() => {
                                                        deleteQuestionMutation(
                                                            showDeleteButton,
                                                        );
                                                        // setOpenQuestion(
                                                        //     undefined,
                                                        // );
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </Accordion.Trigger>
                                </Accordion.Header>
                                <Accordion.Content>
                                    <QuestionPanel
                                        currentQuestionType={
                                            currentQuestionType
                                        }
                                        question={question}
                                    />
                                </Accordion.Content>
                            </Accordion.Item>
                        );
                    })}
                </Accordion.Root>
            </div>
            <QuestionOptions setCurrentQuestionType={setCurrentQuestionType} />
        </div>
    );
}
