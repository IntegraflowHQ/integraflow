import { addEllipsis, cn } from "@/utils";
import * as Accordion from "@radix-ui/react-accordion";
import { useState } from "react";
import { QuestionOptions } from "./attributes/QuestionTypes";

import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { questionTypes } from "@/utils/survey";
import { QuestionPanel } from "./QuestionPanel";

export default function UpdateQuestion() {
    const { parsedQuestions } = useSurvey();

    const { openQuestion, setOpenQuestion } = useQuestion();

    const [currentQuestionType, setCurrentQuestionType] = useState<
        SurveyQuestionTypeEnum | undefined
    >();

    const [openAccordion, setOpenAccordion] = useState(openQuestion?.id || "");

    return (
        <div className="h-full w-full space-y-4 pt-2">
            <div>
                <Accordion.Root
                    type="single"
                    collapsible={true}
                    value={openAccordion}
                    onValueChange={setOpenAccordion}
                    className="space-y-4"
                >
                    {parsedQuestions?.map((question) => {
                        return (
                            <Accordion.Item
                                onClick={() => {
                                    setOpenQuestion(question);
                                }}
                                value={question.id}
                                key={question.id}
                            >
                                <Accordion.Header>
                                    <Accordion.Trigger
                                        value={question.id}
                                        className={cn(
                                            ` ${
                                                openAccordion === question.id
                                                    ? "hidden"
                                                    : "block"
                                            } flex w-full items-center justify-between gap-2 rounded-lg bg-intg-bg-9 p-4 text-intg-text-7`,
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
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
                                            <div className="w-[415px] rounded-lg bg-intg-bg-15 px-[16px] py-4 text-start text-sm text-intg-text-1 ">
                                                {question.label ? (
                                                    addEllipsis(
                                                        question.label,
                                                        40,
                                                    )
                                                ) : (
                                                    <p>Enter your text here</p>
                                                )}
                                            </div>
                                        </div>
                                    </Accordion.Trigger>
                                </Accordion.Header>
                                <Accordion.Content>
                                    <QuestionPanel
                                        setOpenAccordion={setOpenAccordion}
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
