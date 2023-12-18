import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { Switch } from "@/ui";

type Props = {
    question: SurveyQuestion;
};

export const TextSettings = ({ question }: Props) => {
    const { updateQuestionMutation } = useQuestion();
    return (
        <>
            {question.type === SurveyQuestionTypeEnum.Text ? (
                <div className="rounded bg-[#272138] p-3">
                    <Switch
                        name="Long_answer"
                        label="Long Answer"
                        defaultValue={question.settings.singleLine}
                        onChange={(e) => {
                            updateQuestionMutation({
                                settings: {
                                    ...question.settings,
                                    singleLine: e.target.value,
                                },
                            });
                        }}
                    />
                </div>
            ) : null}
        </>
    );
};
