import { SurveyQuestion } from "@/generated/graphql";
import { questionTypes } from "@/utils/survey";
type Props = {
    question: SurveyQuestion;
};

export const TabHeader = ({ question }: Props) => {
    return (
        <div className="flex items-center gap-4">
            <div>
                <img
                    src={
                        questionTypes.find(
                            (type) => type.type === question.type,
                        )?.icon
                    }
                    alt="icon"
                />
            </div>
            <span className="text-sm font-bold text-intg-text-9">
                {question.orderNumber < 10
                    ? `0${question.orderNumber}`
                    : question.orderNumber}
            </span>
            <span className="text-sm font-bold">Question</span>
        </div>
    );
};
