import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { Switch } from "@/ui";

export const TextSettings = () => {
    const { question, updateQuestion } = useQuestion();

    if (!question || question?.type !== SurveyQuestionTypeEnum.Text) {
        return null;
    }

    return (
        <div className="rounded bg-[#272138]">
            <Switch
                name="Long_answer"
                label="Long Answer"
                defaultValue={!question?.settings.singleLine}
                onChange={(e) => {
                    updateQuestion({
                        settings: {
                            ...question?.settings,
                            singleLine: !e.target.value,
                        },
                    });
                }}
            />
        </div>
    );
};
