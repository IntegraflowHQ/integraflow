import { ROUTES } from "@/routes";
import { Button, GlobalSpinner } from "@/ui";
import { toast } from "@/utils/toast";
import * as Tabs from "@radix-ui/react-tabs";
import debounce from "lodash.debounce";
import { XIcon } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useStudioState from "../hooks/useStudioState";
import { useSurvey } from "../hooks/useSurvey";
import Analyze from "./studio/analyze";
import Create from "./studio/create";
import Distribute from "./studio/distribute";

const tabs = [
    { id: crypto.randomUUID(), label: "Create", screen: Create },
    {
        id: crypto.randomUUID(),
        label: "Distribute",
        screen: Distribute,
    },
    { id: crypto.randomUUID(), label: "Analyze", screen: Analyze },
];

export default function Studio() {
    const params = useParams();
    const navigate = useNavigate();
    const { loading, survey, updateSurvey } = useSurvey();
    const [surveyTitle, setSurveyTitle] = React.useState<string>("");
    const { enableStudioMode, disableStudioMode } = useStudioState();
    const surveyName = survey?.survey?.name;

    const { orgSlug, projectSlug } = params;

    const updateSurveyTitle = React.useCallback(
        debounce((value: string) => {
            try {
                if (value.trim() !== "" && value !== surveyName) {
                    updateSurvey({ name: value });
                    toast.success("Survey title updated successfully");
                }
            } catch (err) {
                toast.error(
                    "Failed to update survey title. Please try again later.",
                );
            }
        }, 1000),
        [survey],
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSurveyTitle(value);

        updateSurveyTitle(value);
    };

    // using the disableStudioMode state value alone doesn't cut it. We still need to navigate to the survey list page
    const closeStudio = () => {
        disableStudioMode();
        navigate(
            ROUTES.SURVEY_LIST.replace(":orgSlug", orgSlug!).replace(
                ":projectSlug",
                projectSlug!,
            ),
        );
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

    if (loading) return <GlobalSpinner />;

    return (
        <Tabs.Root className="h-full w-full" defaultValue={tabs[0].id}>
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
                            key={tab.id}
                            value={tab.id}
                            className={`rounded-md px-3 py-2 text-sm text-intg-text transition-all ease-in hover:bg-[#272138] data-[state=active]:bg-[#272138] data-[state=active]:text-white`}
                        >
                            {tab.label}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                <div className="flex gap-[35px]">
                    <Button text="Next" className="px-[16px] py-[8px]" />
                    <button onClick={closeStudio}>
                        <XIcon color="#AFAAC7" />
                    </button>
                </div>
            </header>

            {tabs.map(({ screen: Screen, id }) => (
                <Tabs.Content key={id} value={id}>
                    <Screen />
                </Tabs.Content>
            ))}
        </Tabs.Root>
    );
}
