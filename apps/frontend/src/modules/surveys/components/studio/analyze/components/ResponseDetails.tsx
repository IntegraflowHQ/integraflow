import { PropertyDefinition, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useProject } from "@/modules/projects/hooks/useProject";
import useAnalyze from "@/modules/surveys/hooks/useAnalyze";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { ArrowLeft } from "@/ui/icons";
import { cn } from "@/utils";
import { decodeAnswerLabelOrDescription, emptyLabel, getQuestionIcon } from "@/utils/question";
import Answer from "./Answer";
import { ChannelInfo } from "./ChannelInfo";

type Props = React.HtmlHTMLAttributes<HTMLDivElement> & {
    onBackPress: () => void;
};

export const ResponseDetails = ({ onBackPress, ...props }: Props) => {
    const { parsedQuestions } = useSurvey();
    const { activeResponse } = useAnalyze();
    const { personProperties } = useProject();

    if (!activeResponse) {
        return null;
    }

    const answers = Object.entries(activeResponse.response.response).sort(
        ([_, a], [__, b]) => a[0].orderNumber - b[0].orderNumber,
    );

    return (
        <div className="flex gap-[23px]" {...props}>
            <div className="min-h-[70vh] w-full rounded-lg bg-intg-bg-15 px-[25px] py-5">
                <button className="mb-[25px] flex items-center gap-2 text-white" onClick={onBackPress}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>

                <div className="flex flex-col gap-6">
                    {answers.map(([questionRef, answer]) => {
                        const question = parsedQuestions.find((q) => q.reference === questionRef);

                        return (
                            <div className="space-y-2" key={questionRef}>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={getQuestionIcon(
                                            answer[0].hasOwnProperty("type")
                                                ? (answer[0].type as unknown as SurveyQuestionTypeEnum)
                                                : (question?.type as SurveyQuestionTypeEnum) ??
                                                      ("type" as SurveyQuestionTypeEnum),
                                            answer[0].ctaType,
                                        )}
                                        alt="icon"
                                    />

                                    {question ? (
                                        <h3
                                            className={cn(
                                                "text-sm -tracking-[0.41px]",
                                                question.label === emptyLabel || !question.label
                                                    ? "italic text-intg-error-text"
                                                    : "text-intg-text-2",
                                            )}
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    question.label === emptyLabel || !question.label
                                                        ? "You did not provide a label for this question"
                                                        : decodeAnswerLabelOrDescription(
                                                              question.label,
                                                              parsedQuestions,
                                                              answers,
                                                              personProperties as PropertyDefinition[],
                                                              activeResponse?.response.userAttributes,
                                                              question,
                                                          ),
                                            }}
                                        />
                                    ) : (
                                        <h3 className="text-sm italic -tracking-[0.41px] text-intg-error-text">
                                            Deleted question
                                        </h3>
                                    )}
                                </div>

                                <Answer answer={answer} question={question} />
                            </div>
                        );
                    })}
                </div>
            </div>

            <ChannelInfo />
        </div>
    );
};
