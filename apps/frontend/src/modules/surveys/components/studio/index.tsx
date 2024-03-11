import { SurveyStatusEnum } from "@/generated/graphql";
import { ROUTES } from "@/routes";
import { Button, GlobalSpinner } from "@/ui";
import { toast } from "@/utils/toast";
import * as Tabs from "@radix-ui/react-tabs";
import debounce from "lodash.debounce";
import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useStudioState from "../../hooks/useStudioState";
import { useSurvey } from "../../hooks/useSurvey";
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
    const { loading, survey, updateSurvey } = useSurvey();
    const [surveyTitle, setSurveyTitle] = useState("");
    const { enableStudioMode, disableStudioMode } = useStudioState();
    const [activeTab, setActiveTab] = useState(tabs[0].label);

    const { orgSlug, projectSlug } = params;
    const surveyName = survey?.name;

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
                    {tabs.map((tab) => (
                        <Tabs.Trigger
                            key={tab.label}
                            value={tab.label}
                            className={`rounded-md px-3 py-2 text-sm text-intg-text transition-all ease-in hover:bg-[#272138] data-[state=active]:bg-[#272138] data-[state=active]:text-white`}
                        >
                            {tab.label}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                <div className="flex gap-[35px]">
                    <Button
                        className="px-[16px] py-[8px]"
                        text={activeTab === tabs[1].label ? "Publish" : "Next"}
                        onClick={() => {
                            if (activeTab === tabs[1].label) {
                                publishSurvey();
                            } else {
                                setActiveTab(tabs[1].label);
                            }
                        }}
                    />
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
