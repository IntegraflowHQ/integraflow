import { SurveyUpdateInput } from "@/generated/graphql";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { Switch } from "@/ui";
import React from "react";
import { EditorTextInput } from "../../components/EditorTextInput";

interface SurveyExperienceProps {
    close: boolean;
    showProgressBar: boolean;
    showBranding: boolean;
    submitText: string;
}

export const SurveyExperience = () => {
    const { updateSurvey, survey } = useSurvey();
    const surveyId = survey?.survey?.id;
    const surveySettings = survey?.survey?.settings;

    // const parsedRes = JSON.parse(surveySettings);
    // console.log(`parsed Response: ${parsedRes}`);

    const [surveyExperience, setSurveyExperience] =
        React.useState<SurveyExperienceProps>({
            close: false,
            showProgressBar: false,
            showBranding: false,
            submitText: "",
        });

    const updateSurveyPreferences = () => {
        if (surveyId) {
            updateSurvey({
                settings: surveyExperience as Partial<SurveyUpdateInput>,
            });
        }
    };

    const handleSubmitText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setSurveyExperience((previousState) => ({
            ...previousState,
            [name]: value,
        }));

        updateSurveyPreferences();
    };

    const handleSwitches = (name: string, value: boolean) => {
        setSurveyExperience((previousState) => ({
            ...previousState,
            [name]: value,
        }));

        updateSurveyPreferences();
    };

    React.useEffect(() => {
        // sometimes... the survey settings JSON is undefined
        // so we need to parse it first before we can use it
        if (surveySettings) {
            console.log(`surveySettings: ${JSON.parse(surveySettings)}`);

            const parsedSettingsRes = JSON.parse(surveySettings);

            if (parsedSettingsRes) {
                setSurveyExperience((previousState) => ({
                    ...previousState,
                    ...parsedSettingsRes,
                }));
            }
        }

        console.log(`data from the server: ${surveySettings}`);
    }, []);

    return (
        <div className="w-full flex-col py-3">
            <div className="flex flex-col gap-4">
                <Switch
                    name="showProgressBar"
                    label="progress bar"
                    value={surveyExperience.showProgressBar}
                    onChange={(event) =>
                        handleSwitches(
                            "showProgressBar",
                            event?.target.value as boolean,
                        )
                    }
                />

                <Switch
                    name="showBranding"
                    value={surveyExperience.showBranding}
                    label="remove integraflow branding"
                    onChange={(event) =>
                        handleSwitches(
                            "showBranding",
                            event.target.value as boolean,
                        )
                    }
                />

                <Switch
                    name="close"
                    label="close button"
                    value={surveyExperience.close}
                    onChange={(event) =>
                        handleSwitches("close", event.target.value as boolean)
                    }
                />
            </div>

            <hr className="border-1 my-6 border-intg-bg-14" />

            <EditorTextInput
                name="submitText"
                placeholder="Submit"
                label="Proceed to next question"
                value={surveyExperience.submitText}
                onChange={(event) => handleSubmitText(event)}
                characterCount={surveyExperience.submitText.length}
            />
        </div>
    );
};
