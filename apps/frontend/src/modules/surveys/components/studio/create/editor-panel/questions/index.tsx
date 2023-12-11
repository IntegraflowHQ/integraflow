import { addEllipsis, cn } from "@/utils";
import * as Accordion from "@radix-ui/react-accordion";
import { useEffect, useState } from "react";
import { QuestionOptions } from "./attributes/Options";

import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { questionTypes } from "@/utils/survey";
import { QuestionPanel } from "./QuestionPanel";

export default function UpdateQuestion() {
    const { getSurvey, questions, setOpenQuestion, openQuestion, surveySlug } = useSurvey();
    console.log("Questions: ", questions);

    const [currentQuestionType, setCurrentQuestionType] = useState<
        SurveyQuestionTypeEnum | undefined
    >();

    useEffect(() => {
        getSurvey();
    }, [surveySlug]);

    return (
        <div className="h-full w-full space-y-4 pt-2">
            <div>
                <Accordion.Root
                    type="single"
                    collapsible={true}
                    value={openQuestion}
                    className="space-y-4"
                >
                    {questions?.map((question) => {
                        return (
                            <Accordion.Item
                                value={question.id}
                                key={question.createdAt}
                            >
                                <Accordion.Header>
                                    <Accordion.Trigger
                                        className={cn(
                                            ` ${
                                                openQuestion === question.id
                                                    ? "hidden"
                                                    : "block"
                                            } text-intg-text-7" flex w-full items-center justify-between gap-2 rounded-lg bg-intg-bg-9 p-4`,
                                        )}
                                        onClick={() => setOpenQuestion(question.id)}
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
                                                alt=""
                                            />
                                        </div>
                                        <div className="font-bold text-intg-text-9">
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
                                    </Accordion.Trigger>
                                </Accordion.Header>
                                <Accordion.Content>
                                    <QuestionPanel
                                        currentQuestionType={
                                            currentQuestionType
                                        }
                                    />
                                </Accordion.Content>
                            </Accordion.Item>
                        );
                    })}
                </Accordion.Root>
            </div>
            <QuestionOptions
                setCurrentQuestionType={setCurrentQuestionType}
            />
        </div>
    );
}
