import { SurveyQuestion } from "@/generated/graphql";
import { questionTypes } from "@/utils/survey";
type Props = {
    question: SurveyQuestion;
    questionIndex: number;
};

export const TabHeader = ({ question, questionIndex }: Props) => {
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
            <span className="text-intg-text-9 text-sm font-bold">
                {questionIndex + 1 < 10
                    ? `0${questionIndex + 1}`
                    : questionIndex + 1}
            </span>
            <span className="text-sm font-bold">Question</span>
        </div>
    );
};
