import { addEllipsis, cn } from "@/utils";
import * as Accordion from "@radix-ui/react-accordion";
import { useEffect, useMemo, useState } from "react";
import { QuestionOptions } from "./attributes/Options";

import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { questionTypes } from "@/utils/survey";
import { QuestionPanel } from "./QuestionPanel";

export default function UpdateQuestion() {
    const { getSurvey, questions, setOpenQuestion, openQuestion, surveySlug } =
        useSurvey();

    const [currentQuestionType, setCurrentQuestionType] = useState<
        SurveyQuestionTypeEnum | undefined
    >();

    const sortedQuestions = useMemo(() => {
        return [...questions].sort((a, b) => {
            return a.node.orderNumber - b.node.orderNumber;
        });
    }, [questions]);

 
    return (
        <div className="h-full w-full space-y-4 pt-2">
            <div>
                <Accordion.Root
                    type="single"
                    collapsible={true}
                    value={openQuestion}
                    className="space-y-4"
                >
                    {sortedQuestions?.map((question) => {
                        return (
                            <Accordion.Item
                                onClick={() =>
                                    setCurrentQuestionType(question.node.type)
                                }
                                value={question.node.id}
                                key={question.node.createdAt}
                            >
                                <Accordion.Header>
                                    <Accordion.Trigger
                                        className={cn(
                                            ` ${
                                                openQuestion ===
                                                question.node.id
                                                    ? "hidden"
                                                    : "block"
                                            } text-intg-text-7" flex w-full items-center justify-between gap-2 rounded-lg bg-intg-bg-9 p-4`,
                                        )}
                                        onClick={() =>
                                            setOpenQuestion(question.node.id)
                                        }
                                    >
                                        <div>
                                            <img
                                                src={
                                                    questionTypes.find(
                                                        (type) =>
                                                            type.type ===
                                                            question.node.type,
                                                    )?.icon
                                                }
                                                alt=""
                                            />
                                        </div>
                                        <div className="font-bold text-intg-text-9">
                                            {question.node.orderNumber < 10
                                                ? `0${question.node.orderNumber}`
                                                : question.node.orderNumber}
                                        </div>
                                        <div className="w-[415px] rounded-lg bg-intg-bg-15 px-[16px] py-4 text-start text-intg-text-1 ">
                                            {addEllipsis(
                                                "Lorem ipsum dolor sit, ametconsectetur adipisicing elit.",
                                                40,
                                            )}
                                        </div>
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
