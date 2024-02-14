import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { questionTypes } from "@/utils/survey";
import RatingIcon from "assets/icons/studio/rating.png";

type Props = {
    questionIndex: number;
};

export const TabHeader = ({ questionIndex }: Props) => {
    const { question } = useQuestion();
    return (
        <div className="flex items-center gap-4">
            <img
                src={
                    [
                        SurveyQuestionTypeEnum.Rating,
                        SurveyQuestionTypeEnum.NumericalScale,
                        SurveyQuestionTypeEnum.Csat,
                        SurveyQuestionTypeEnum.CES,
                    ].includes(question?.type)
                        ? RatingIcon
                        : questionTypes.find((type) => type.type === question?.type)?.icon
                }
                alt="icon"
            />

            <span className="text-intg-text-9 text-sm font-bold">
                {questionIndex + 1 < 10 ? `0${questionIndex + 1}` : questionIndex + 1}
            </span>
            <span className="text-sm font-bold">Question</span>
        </div>
    );
};
