import { ProjectTheme, SurveyStatusEnum } from "@/generated/graphql";
import { useOnboarding } from "@/modules/onboarding/hooks/useOnboarding";
import { ROUTES } from "@/routes";
import { Announce, Button, GlobalSpinner } from "@/ui";
import { parseTheme } from "@/utils";
import { toast } from "@/utils/toast";
import * as Tabs from "@radix-ui/react-tabs";
import debounce from "lodash.debounce";
import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSurvey } from "../../hooks/useSurvey";
import { useStudioStore } from "../../states/studio";
import Analyze from "./analyze";
import Create from "./create";
import Distribute from "./distribute";

const tabs = [
    { label: "Create", screen: Create },
    {
        label: "Distribute",
        screen: Distribute,
    },
    { label: "Analyze", screen: Analyze },
];

export default function Studio() {
    const params = useParams();
    const navigate = useNavigate();
    const { loading, survey, parsedQuestions, updateSurvey } = useSurvey();
    const [surveyTitle, setSurveyTitle] = useState("");
    const { enableStudioMode, disableStudioMode } = useStudioStore((state) => state);
    const [activeTab, setActiveTab] = useState(tabs[0].label);
    const { updateStudio } = useStudioStore((state) => state);
    const { steps: onboardingSteps, markAsCompleted } = useOnboarding();
    const surveyPublishIndex = onboardingSteps.findIndex((s) => s.key === "publish");

    const { orgSlug, projectSlug } = params;
    const surveyName = survey?.name;

    useEffect(() => {
        if (survey?.theme && survey?.theme.colorScheme && survey?.theme?.name) {
            updateStudio({ theme: parseTheme(survey.theme as ProjectTheme) });
        }
    }, []);

    const updateSurveyTitle = React.useCallback(
        debounce((value: string) => {
            if (survey && value.trim() !== "" && value !== surveyName) {
                updateSurvey(survey, { name: value });
            }
        }, 1000),
        [survey, surveyName],
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSurveyTitle(value);
        updateSurveyTitle(value);
    };

    const closeStudio = () => {
        disableStudioMode();
        navigate(ROUTES.SURVEY_LIST.replace(":orgSlug", orgSlug!).replace(":projectSlug", projectSlug!));
    };

    React.useEffect(() => {
        if (surveyName) {
            setSurveyTitle(surveyName);
        }
    }, [survey, surveyName]);

    React.useEffect(() => {
        enableStudioMode();

        return () => {
            disableStudioMode();
        };
    }, []);

    const publishSurvey = async () => {
        if (!survey) return;

        await updateSurvey(survey, {
            status: SurveyStatusEnum.Active,
        });
        toast.success("Survey published successfully");

        if (surveyPublishIndex === -1) {
            return;
        }

        markAsCompleted(surveyPublishIndex);
    };

    const pauseSurvey = async () => {
        if (!survey) return;

        await updateSurvey(survey, {
            status: SurveyStatusEnum.Paused,
        });
        toast.success("Survey paused successfully");
    };

    if (loading || !survey) return <GlobalSpinner />;

    return (
        <Tabs.Root className="h-full w-full" value={activeTab} onValueChange={setActiveTab}>
            <header className="fixed z-10 flex w-full items-center justify-between border-b border-intg-bg-4 bg-[#090713] py-[22px] pl-10 pr-12">
                <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Enter Title"
                    value={surveyTitle}
                    onChange={(e) => handleChange(e)}
                    className="w-[120px] text-ellipsis bg-transparent px-2 py-1 text-sm text-white"
                />

                <Tabs.List className="flex gap-[15px]">
                    {tabs.map((tab, index) => (
                        <Tabs.Trigger
                            key={tab.label}
                            value={tab.label}
                            className={`rounded-md px-3 py-2 text-sm text-intg-text transition-all ease-in hover:bg-[#272138] data-[state=active]:bg-[#272138] data-[state=active]:text-white`}
                            disabled={index !== 0 && parsedQuestions.length === 0}
                        >
                            {tab.label}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                <div className="flex gap-[35px]">
                    {survey.status === SurveyStatusEnum.Active ? (
                        <Announce text="You have published this survey." variant="green" />
                    ) : (
                        <div className="w-[195px]" />
                    )}

                    {activeTab === tabs[2].label && survey.status !== SurveyStatusEnum.Active ? (
                        <div className="w-[87px]" />
                    ) : (
                        <Button
                            size="sm"
                            className="!w-[87px]"
                            ping={
                                survey?.status !== SurveyStatusEnum.Active &&
                                parsedQuestions.length !== 0 &&
                                activeTab === tabs[1].label
                            }
                            text={
                                survey.status === SurveyStatusEnum.Active
                                    ? "Pause"
                                    : activeTab === tabs[1].label
                                      ? "Publish"
                                      : "Next"
                            }
                            disabled={parsedQuestions.length === 0}
                            onClick={() => {
                                if (survey.status === SurveyStatusEnum.Active) {
                                    pauseSurvey();
                                    return;
                                }

                                if (activeTab === tabs[1].label) {
                                    publishSurvey();
                                    return;
                                }

                                setActiveTab(tabs[1].label);
                            }}
                        />
                    )}

                    <button onClick={closeStudio}>
                        <XIcon color="#AFAAC7" />
                    </button>
                </div>
            </header>

            {tabs.map(({ screen: Screen, label }) => (
                <Tabs.Content key={label} value={label}>
                    <Screen />
                </Tabs.Content>
            ))}
        </Tabs.Root>
    );
}
