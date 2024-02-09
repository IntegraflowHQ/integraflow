import { addEllipsis } from "@/utils";
import * as Accordion from "@radix-ui/react-accordion";
import { useEffect, useState } from "react";
import { QuestionOptions } from "./attributes/QuestionTypes";

import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { ParsedQuestion } from "@/types";
import { questionTypes } from "@/utils/survey";
import { QuestionPanel } from "./QuestionPanel";

export default function UpdateQuestion() {
    const { parsedQuestions } = useSurvey();

    const { openQuestion, setOpenQuestion } = useQuestion();

    const [currentQuestionType, setCurrentQuestionType] = useState<
        SurveyQuestionTypeEnum | undefined
    >();

    useEffect(() => {
        if (!openQuestion || !openQuestion.id) {
            setOpenQuestion(parsedQuestions[0]);
        }
    }, [parsedQuestions, openQuestion]);

    return (
        <div className="h-full w-full space-y-4 pt-2">
            <div>
                {parsedQuestions.length > 0 ? (
                    <Accordion.Root
                        type="single"
                        collapsible={true}
                        value={openQuestion?.id}
                        defaultValue={parsedQuestions[0]?.id}
                        onValueChange={(value) => {
                            if (value === "" || value === undefined) {
                                setOpenQuestion({
                                    id: "",
                                } as ParsedQuestion);
                                return;
                            }
                            setOpenQuestion(
                                parsedQuestions.find(
                                    (question) => question.id === value,
                                ) as ParsedQuestion,
                            );
                        }}
                        className="space-y-4"
                    >
                        {parsedQuestions?.map((question, index) => {
                            return (
                                <Accordion.Item
                                    value={question.id}
                                    key={question.id}
                                >
                                    <Accordion.Header>
                                        <Accordion.Trigger
                                            value={question.id}
                                            className="w-full items-center  justify-between gap-2 rounded-lg bg-intg-bg-9 p-4 text-intg-text-7 data-[state=close]:flex data-[state=open]:hidden"
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
                                                <div className="text-intg-text-9 text-sm font-bold">
                                                    {index + 1 < 10
                                                        ? `0${index + 1}`
                                                        : index + 1}
                                                </div>
                                                <div className="w-[415px] rounded-lg bg-intg-bg-15 px-[16px] py-4 text-start text-sm text-intg-text-1 ">
                                                    {question.label ? (
                                                        addEllipsis(
                                                            question.label,
                                                            40,
                                                        )
                                                    ) : (
                                                        <p>
                                                            Enter your text here
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Accordion.Trigger>
                                    </Accordion.Header>
                                    <Accordion.Content>
                                        <QuestionPanel
                                            currentQuestionType={
                                                currentQuestionType
                                            }
                                            question={question}
                                            questionIndex={index}
                                        />
                                    </Accordion.Content>
                                </Accordion.Item>
                            );
                        })}
                    </Accordion.Root>
                ) : null}
            </div>
            <QuestionOptions setCurrentQuestionType={setCurrentQuestionType} />
        </div>
    );
}
