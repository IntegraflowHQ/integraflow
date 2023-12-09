import { Tab } from "@/ui";
import { ThemesMenu } from "../DesignEditor/components/ThemesMenu";
import { SurveyExperience } from "./components/SurveyExperience";

const SETTINGS_TAB = [
    {
        tabId: crypto.randomUUID(),
        tabName: "Survey experience",
        tabContent: <SurveyExperience />,
    },
    {
        tabId: crypto.randomUUID(),
        tabName: "Messages",
        tabContent: <p className="text-sm font-normal text-white">Tab 2</p>,
    },
];

export const UpdateSettingsEditor = () => {
    return (
        <div className="h-fit rounded-md bg-intg-bg-9 px-4 py-2">
            <Tab
                tabControls
                tabData={SETTINGS_TAB}
                tabMoreOptionsMenu={<ThemesMenu />}
            />
        </div>
    );
};
