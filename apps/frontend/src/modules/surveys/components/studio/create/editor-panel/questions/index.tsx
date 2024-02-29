import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { ParsedQuestion } from "@/types";
import { addEllipsis, stripHtmlTags } from "@/utils";
import { questionTypes } from "@/utils/survey";
import * as Accordion from "@radix-ui/react-accordion";
import RatingIcon from "assets/icons/studio/rating.png";
import { useEffect } from "react";
import { QuestionPanel } from "./QuestionPanel";
import { QuestionOptions } from "./attributes/QuestionTypes";

export default function UpdateQuestion() {
    const { parsedQuestions } = useSurvey();
    const { question, switchQuestion, clear } = useQuestion();

    useEffect(() => {
        if ((!question || !question.id) && parsedQuestions.length > 0) {
            switchQuestion(parsedQuestions[0]);
        }
    }, [parsedQuestions, question]);
    const emptyLabel = "<p><br></p>";

    return (
        <div className="h-full w-full space-y-4 pt-2">
            <div>
                {parsedQuestions.length > 0 ? (
                    <Accordion.Root
                        type="single"
                        collapsible={true}
                        value={question ? question.id : ""}
                        onValueChange={(value) => {
                            if (value === "" || value === undefined) {
                                clear();
                                return;
                            }

                            switchQuestion(parsedQuestions.find((question) => question.id === value) as ParsedQuestion);
                        }}
                        className="space-y-4"
                    >
                        {parsedQuestions?.map((question, index) => {
                            return (
                                <Accordion.Item value={question.id} key={question.id}>
                                    <Accordion.Header>
                                        <Accordion.Trigger
                                            value={question.id}
                                            className="w-full items-center  justify-between gap-2 rounded-lg bg-intg-bg-9 p-4 text-intg-text-7 data-[state=close]:flex data-[state=open]:hidden"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <img
                                                        src={
                                                            [
                                                                SurveyQuestionTypeEnum.Rating,
                                                                SurveyQuestionTypeEnum.Csat,
                                                                SurveyQuestionTypeEnum.NumericalScale,
                                                                SurveyQuestionTypeEnum.Ces,
                                                            ].includes(question.type)
                                                                ? RatingIcon
                                                                : questionTypes.find(
                                                                      (type) => type.type === question.type,
                                                                  )?.icon
                                                        }
                                                        alt="icon"
                                                    />
                                                </div>
                                                <div className="text-intg-text-9 text-sm font-bold">
                                                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                                </div>
                                                <div className="w-[415px] rounded-lg bg-intg-bg-15 px-[16px] py-4 text-start text-sm text-intg-text ">
                                                    {question.label && question.label !== emptyLabel ? (
                                                        addEllipsis(stripHtmlTags(question.label), 40)
                                                    ) : (
                                                        <p className="text-sm text-intg-text">Enter your text here</p>
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
            <QuestionOptions />
        </div>
    );
}
