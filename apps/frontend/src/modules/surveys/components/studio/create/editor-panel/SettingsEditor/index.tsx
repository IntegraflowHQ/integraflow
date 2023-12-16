import { Tab } from "@/ui";
import { SurveyExperience } from "./components/SurveyExperience";

const SETTINGS_TAB = [
    {
        tabId: crypto.randomUUID(),
        tabName: "Survey experience",
        tabContent: <SurveyExperience />,
    },
];

export const UpdateSettingsEditor = () => {
    return (
        <div className="h-fit rounded-md bg-intg-bg-9 px-4 py-2">
            <Tab tabData={SETTINGS_TAB} />
        </div>
    );
};
