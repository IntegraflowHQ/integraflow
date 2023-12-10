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
        tabContent: (
            <p className="py-4 text-sm font-normal text-intg-text-2">
                Proceed to next question
            </p>
        ),
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
