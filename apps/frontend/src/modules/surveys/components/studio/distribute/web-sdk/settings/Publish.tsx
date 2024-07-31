import { SurveyStatusEnum } from "@/generated/graphql";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { Button } from "@/ui";
import { Info } from "@/ui/icons";
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
                <header className="inline-flex items-center gap-2">
                    <h3 className="text-base font-medium text-white">Publish</h3>
                    <Info />
                </header>

                <Button
                    size="sm"
                    className="!w-[87px]"
                    text={survey?.status === SurveyStatusEnum.Active ? "Pause" : "Publish"}
                    disabled={parsedQuestions.length === 0}
                    onClick={() => {
                        if (survey?.status === SurveyStatusEnum.Paused || survey?.status === SurveyStatusEnum.Draft) {
                            publishSurvey();
                        } else if (survey?.status === SurveyStatusEnum.Active) {
                            pauseSurvey();
                        }
                    }}
                />
                <p className="text-sm">Manage your survey status: publish to go live or pause to stop.</p>
            </div>
        </div>
    );
}
