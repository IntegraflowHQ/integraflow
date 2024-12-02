import { SurveyQuestionTypeEnum, SurveyStatusEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { Switch } from "@/ui";

export const TextSettings = () => {
    const { survey } = useSurvey();
    const { question, updateQuestion } = useQuestion();

    if (!question || question?.type !== SurveyQuestionTypeEnum.Text) {
        return null;
    }

    return (
        <div className="rounded bg-[#272138]">
            <Switch
                name="Long_answer"
                label="Long Answer"
                dataTestid="toggle-answer-length"
                defaultValue={!question?.settings.singleLine}
                onChange={(e) => {
                    updateQuestion({
                        settings: {
                            ...question?.settings,
                            singleLine: !e.target.value,
                        },
                    });
                }}
                disabled={survey?.status === SurveyStatusEnum.Active}
            />
        </div>
    );
};
