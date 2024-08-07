import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { CTAType } from "@/types";
import { getQuestionIcon } from "@/utils/question";

type Props = {
    questionIndex: number;
};

export const TabHeader = ({ questionIndex }: Props) => {
    const { question } = useQuestion();

    if (!question) {
        return null;
    }

    return (
        <div className="flex items-center gap-4">
            <img src={getQuestionIcon(question.type, question.settings.type as CTAType)} alt="icon" />

            <span className="text-sm font-bold text-intg-text-9">
                {questionIndex + 1 < 10 ? `0${questionIndex + 1}` : questionIndex + 1}
            </span>
            <span className="text-sm font-bold">Question</span>
        </div>
    );
};
