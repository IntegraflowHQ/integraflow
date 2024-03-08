import { SurveyUpdateInput } from "@/generated/graphql";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { SurveySettings } from "@/types";
import { Switch } from "@/ui";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { EditorTextInput } from "../../components/EditorTextInput";

const defaultSettings = '{"submitText": "", "close": true, "showBranding": true, "showProgressBar": true}';

export const SurveyExperience = () => {
    const { updateSurvey, survey } = useSurvey();
    const parsedSettings = JSON.parse(survey?.settings ?? defaultSettings) as SurveySettings;

    const handleSubmitText = useCallback(
        debounce((value: string) => {
            if (value.trim() !== "" && survey) {
                updateSurvey(survey, {
                    settings: JSON.stringify({
                        ...parsedSettings,
                        submitText: value,
                    }) as Partial<SurveyUpdateInput>,
                });
            }
        }, 1000),
        [parsedSettings],
    );

    const handleSwitches = (name: string, value: boolean) => {
        if (!survey) {
            return;
        }

        updateSurvey(survey, {
            settings: JSON.stringify({
                ...parsedSettings,
                [name]: value,
            }) as Partial<SurveyUpdateInput>,
        });
    };

    return (
        <div className="w-full flex-col py-3">
            <div className="flex flex-col gap-4">
                <Switch
                    name="showProgressBar"
                    label="progress bar"
                    value={parsedSettings.showProgressBar}
                    onChange={(event) => handleSwitches("showProgressBar", event?.target.value)}
                />

                <Switch
                    name="hideBranding"
                    value={!parsedSettings.showBranding}
                    label="remove Integraflow branding"
                    onChange={(event) => handleSwitches("showBranding", !event.target.value)}
                />

                <Switch
                    name="close"
                    label="close button"
                    value={parsedSettings.close}
                    onChange={(event) => handleSwitches("close", event.target.value)}
                />
            </div>

            <hr className="border-1 my-6 border-intg-bg-14" />

            <EditorTextInput
                placeholder="Submit"
                label="Proceed to next question"
                onChange={(e) => handleSubmitText(e.target.value)}
                defaultValue={parsedSettings.submitText}
            />
        </div>
    );
};
