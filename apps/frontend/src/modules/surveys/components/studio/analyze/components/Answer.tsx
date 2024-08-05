import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { ParsedQuestion, Shape, SurveyAnswer } from "@/types";
import { emojiArray, resolveAnswer } from "@/utils/question";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import RatingIcon from "./RatingIcon";

const renderRatingIcons = (shape: Shape, rating: string, count: number) => {
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

const getBooleanAnswer = (answer: SurveyAnswer): JSX.Element | string => {
    if (answer === null || answer === undefined) {
        return "";
    }

    const shape = answer.shape;

    if (shape === "thumb") {
        if (answer.answerId === 0) {
            return <ThumbsDown fill="#9582C0" />;
        } else {
            return <ThumbsUp fill="#9582C0" />;
        }
    }

    return answer.answer ?? "";
};

export default function Answer({ question, answer }: { question?: ParsedQuestion; answer: SurveyAnswer[] }) {
    const resolvedAnswer = resolveAnswer(answer, question);

    return (
        <div className="w-full rounded-lg bg-intg-bg-21 px-4 py-3.5 text-sm font-medium text-intg-text-3">
            <div className="flex items-center gap-1 text-sm font-medium text-intg-text-3">
                {answer[0].type?.toLocaleLowerCase() !== SurveyQuestionTypeEnum.Form.toLocaleLowerCase() && (
                    <span>Answer:</span>
                )}

                <span>
                    {answer[0].type?.toLocaleLowerCase() === SurveyQuestionTypeEnum.Form.toLocaleLowerCase() ? (
                        resolvedAnswer.map((answer, i) => <div key={i}>{answer}</div>)
                    ) : answer[0].type?.toLocaleLowerCase() === SurveyQuestionTypeEnum.Multiple.toLocaleLowerCase() ? (
                        <>{resolvedAnswer.join(", ")}</>
                    ) : answer[0].type?.toLocaleLowerCase() ===
                      SurveyQuestionTypeEnum.SmileyScale.toLocaleLowerCase() ? (
                        <> {+resolvedAnswer[0] > 0 ? getEmoji(resolvedAnswer[0]) : ""}</>
                    ) : answer[0].type?.toLocaleLowerCase() === SurveyQuestionTypeEnum.Rating.toLocaleLowerCase() ? (
                        <>
                            {+resolvedAnswer[0] > 0
                                ? renderRatingIcons(
                                      answer[0].shape ?? "button",
                                      resolvedAnswer[0],
                                      answer[0].count ?? 10,
                                  )
                                : ""}
                        </>
                    ) : answer[0].type?.toLocaleLowerCase() === SurveyQuestionTypeEnum.Boolean.toLocaleLowerCase() ? (
                        <>{getBooleanAnswer(answer[0])} </>
                    ) : (
                        <> {resolvedAnswer[0]}</>
                    )}
                </span>
            </div>
        </div>
    );
}
