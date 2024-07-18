import RatingIcon from "@/assets/icons/studio/RatingIcon";
import { PropertyDefinition, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useProject } from "@/modules/projects/hooks/useProject";
import useAnalyze from "@/modules/surveys/hooks/useAnalyze";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { ParsedQuestion } from "@/types";
import { ArrowLeft } from "@/ui/icons";
import {
    decodeAnswerLabelOrDescription,
    emojiArray,
    emptyLabel,
    getQuestionIcon,
    resolveAnswer,
} from "@/utils/question";
import { ThumbsDown, ThumbsUp } from "lucide-react";
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

    const renderRatingIcons = (
        shape: "star" | "thumb" | "heart" | "button" | undefined,
        rating: string,
        count: number,
    ) => {
        const icons = [];
        const parsedRating = parseInt(rating);

        for (let i = 1; i <= count; i++) {
            icons.push(
                <RatingIcon key={i} shape={shape} color={"#9582C0"} fill={i <= parsedRating ? "#9582C0" : "#2E2743"} />,
            );
        }
        return <>{icons}</>;
    };

    const getEmoji = (index: string) => {
        const parsedIndex = parseInt(index);
        if (parsedIndex < 1 || parsedIndex > 5) {
            return null;
        }
        const Emoji = emojiArray[parsedIndex - 1];
        return <Emoji />;
    };

    const getBooleanAnswer = (q: ParsedQuestion, answer: string): JSX.Element | string => {
        if (answer === null || answer === undefined || answer === "") {
            return "";
        }

        const parsedString = parseInt(answer);

        if (q.settings.shape === "button") {
            if (parsedString === 0) {
                return q.settings.negativeText as string;
            } else if (parsedString === 1) {
                return q.settings.positiveText as string;
            }
        } else if (q.settings.shape === "thumb") {
            if (parsedString === 0) {
                return <ThumbsDown fill="#9582C0" />;
            } else if (parsedString === 1) {
                return <ThumbsUp fill="#9582C0" />;
            }
        }

        return "";
    };

    return (
        <div className="flex gap-[23px]" {...props}>
            <div className="w-full rounded-lg bg-intg-bg-15 px-[25px] py-5">
                <button className="mb-[25px] flex items-center gap-2 text-white" onClick={onBackPress}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>

                <div className="flex flex-col gap-6">
                    {parsedQuestions.map((q, index) => {
                        const resolvedAnswer = resolveAnswer(q, activeResponse.response);
                        return (
                            <div className="flex w-full flex-col gap-2" key={q.id}>
                                <div className="flex items-center gap-2">
                                    <img src={getQuestionIcon(q)} alt="icon" />

                                    <strong className="text-base font-bold leading-5 -tracking-[0.41px] text-intg-text-12">
                                        {index < 9 ? `0${index + 1}` : `${index + 1}`}
                                    </strong>

                                    {q.label === emptyLabel || !q.label ? (
                                        <h3 className="text-sm italic -tracking-[0.41px] text-intg-error-text">
                                            You did not provide a label for this question
                                        </h3>
                                    ) : (
                                        <h3
                                            className="text-sm -tracking-[0.41px] text-intg-text-2"
                                            dangerouslySetInnerHTML={{
                                                __html: decodeAnswerLabelOrDescription(
                                                    q.label,
                                                    parsedQuestions,
                                                    activeResponse.response,
                                                    personProperties as PropertyDefinition[],
                                                    activeResponse?.response.userAttributes,
                                                    q,
                                                ),
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="w-full rounded-lg bg-intg-bg-21 px-4 py-3.5 text-sm font-medium text-intg-text-3">
                                    <div className="flex items-center gap-1 text-sm font-medium text-intg-text-3">
                                        {q.type !== SurveyQuestionTypeEnum.Form && <span>Answer:</span>}
                                        <span>
                                            {q.type === SurveyQuestionTypeEnum.Form ? (
                                                resolvedAnswer.map((answer, i) => <div key={i}>{answer}</div>)
                                            ) : q.type === SurveyQuestionTypeEnum.Multiple ? (
                                                <>{resolvedAnswer.join(", ")}</>
                                            ) : q.type === SurveyQuestionTypeEnum.SmileyScale ? (
                                                <> {+resolvedAnswer[0] > 0 ? getEmoji(resolvedAnswer[0]) : ""}</>
                                            ) : q.type === SurveyQuestionTypeEnum.Rating ? (
                                                <>
                                                    {+resolvedAnswer[0].length > 0
                                                        ? renderRatingIcons(
                                                              q.settings.shape,
                                                              resolvedAnswer[0],
                                                              q.options.length,
                                                          )
                                                        : ""}
                                                </>
                                            ) : q.type === SurveyQuestionTypeEnum.Boolean ? (
                                                <>{getBooleanAnswer(q, resolvedAnswer[0])} </>
                                            ) : (
                                                <> {resolvedAnswer[0]}</>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col gap-3 p-3.5">
                <ChannelInfo />
            </div>
        </div>
    );
};
