import { SurveyStatusEnum } from "@/generated/graphql";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { Button, Header } from "@/ui";
import { toast } from "@/utils/toast";

export default function Publish() {
    const { survey, updateSurvey } = useSurvey();
    const { parsedQuestions } = useSurvey();

    const publishSurvey = async () => {
        if (!survey) return;

        await updateSurvey(survey, {
            status: SurveyStatusEnum.Active,
        });
        toast.success("Survey published successfully");
    };

    const pauseSurvey = async () => {
        if (!survey) return;

        await updateSurvey(survey, {
            status: SurveyStatusEnum.Paused,
        });
        toast.success("Survey paused successfully");
    };

    return (
        <div className="px-4 pb-6 text-intg-text">
            <div className="flex flex-col gap-[26px] rounded-lg bg-intg-bg-9 p-6">
                <Header variant="3" font="medium" title="Publish" />

                <Button
                    size="sm"
                    className="!w-[87px]"
                    text={survey?.status === SurveyStatusEnum.Active ? "Pause" : "Publish"}
                    ping={survey?.status === SurveyStatusEnum.Paused || survey?.status === SurveyStatusEnum.Draft}
                    disabled={parsedQuestions.length === 0}
                    onClick={() => {
                        if (survey?.status === SurveyStatusEnum.Paused || survey?.status === SurveyStatusEnum.Draft) {
                            publishSurvey();
                        } else if (survey?.status === SurveyStatusEnum.Active) {
                            pauseSurvey();
                        }
                    }}
                />
            </div>
        </div>
    );
}
