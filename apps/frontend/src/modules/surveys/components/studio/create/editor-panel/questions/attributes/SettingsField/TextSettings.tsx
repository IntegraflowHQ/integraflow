import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { Switch } from "@/ui";

type Props = {
    question: SurveyQuestion;
};

export const TextSettings = ({}: Props) => {
    const { updateQuestionMutation, openQuestion } = useQuestion();
    return (
        <>
            {openQuestion?.type === SurveyQuestionTypeEnum.Text ? (
                <div className="rounded bg-[#272138]">
                    <Switch
                        name="Long_answer"
                        label="Long Answer"
                        defaultValue={openQuestion?.settings.singleLine}
                        onChange={() => {
                            updateQuestionMutation({
                                settings: {
                                    ...openQuestion?.settings,
                                    singleLine:
                                        !openQuestion?.settings.singleLine,
                                },
                            });
                        }}
                    />
                </div>
            ) : null}
        </>
    );
};
