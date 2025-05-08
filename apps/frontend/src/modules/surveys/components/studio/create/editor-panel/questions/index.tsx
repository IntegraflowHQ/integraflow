import { PropertyDefinition, SurveyStatusEnum } from "@/generated/graphql";
import { useProject } from "@/modules/projects/hooks/useProject";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { CTAType, ParsedQuestion } from "@/types";
import { decodeText, emptyLabel, getQuestionIcon, tagOptions } from "@/utils/question";
import * as Accordion from "@radix-ui/react-accordion";
import { useEffect } from "react";
import { QuestionPanel } from "./QuestionPanel";
import { QuestionOptions } from "./attributes/QuestionTypes";

export default function UpdateQuestion() {
    const { parsedQuestions, survey } = useSurvey();
    const { question, switchQuestion, clear } = useQuestion();
    const { personProperties } = useProject();

    useEffect(() => {
        if ((!question || !question.reference) && parsedQuestions.length > 0) {
            switchQuestion(parsedQuestions[0]);
        }
    }, []);

    return (
        <div className="h-full w-full space-y-4 pt-2">
            <div>
                {parsedQuestions.length > 0 ? (
                    <Accordion.Root
                        type="single"
                        collapsible={true}
                        value={question?.reference ?? ""}
                        onValueChange={(value) => {
                            if (value === "" || value === undefined) {
                                clear();
                                return;
                            }

                            switchQuestion(
                                parsedQuestions.find((question) => question.reference === value) as ParsedQuestion,
                            );
                        }}
                        className="space-y-4"
                    >
                        {parsedQuestions?.map((question, index) => {
                            return (
                                <Accordion.Item
                                    value={question.reference ?? ""}
                                    key={question.reference}
                                    data-testid={question.reference}
                                >
                                    <Accordion.Header>
                                        <Accordion.Trigger
                                            value={question.reference ?? ""}
                                            className="w-full items-center  justify-between gap-2 rounded-lg bg-intg-bg-9 p-4 text-intg-text-7 data-[state=close]:flex data-[state=open]:hidden"
                                            data-testid="question-trigger"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <img
                                                        src={getQuestionIcon(
                                                            question.type,
                                                            question.settings.type as CTAType,
                                                        )}
                                                        alt="icon"
                                                    />
                                                </div>
                                                <div className="text-sm font-bold text-intg-text-9">
                                                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                                </div>
                                                <div className="w-[415px] rounded-lg bg-intg-bg-15 px-[16px] py-4 text-start text-sm text-intg-text ">
                                                    {question.label && question.label !== emptyLabel ? (
                                                        <div
                                                            className="truncate [&>*]:inline"
                                                            dangerouslySetInnerHTML={{
                                                                __html: decodeText(
                                                                    question?.label ?? "",
                                                                    tagOptions(
                                                                        parsedQuestions,
                                                                        question,
                                                                        personProperties as PropertyDefinition[],
                                                                    ),
                                                                ),
                                                            }}
                                                        />
                                                    ) : (
                                                        <p className="text-sm text-intg-text" data-test-id="question">
                                                            Enter your question here, use '@' to recall information.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Accordion.Trigger>
                                    </Accordion.Header>
                                    <Accordion.Content>
                                        <QuestionPanel questionIndex={index} />
                                    </Accordion.Content>
                                </Accordion.Item>
                            );
                        })}
                    </Accordion.Root>
                ) : null}
            </div>

            {survey?.status !== SurveyStatusEnum.Active ? <QuestionOptions /> : null}
        </div>
    );
}
