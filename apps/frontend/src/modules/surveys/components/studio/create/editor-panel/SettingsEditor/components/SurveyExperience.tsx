import { SurveyUpdateInput } from "@/generated/graphql";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { Switch } from "@/ui";
import { toast } from "@/utils/toast";
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

    const updateSurveyPreferences = (
        updatedPrefernece: SurveyExperienceProps,
    ) => {
        if (surveyId) {
            updateSurvey({
                settings: updatedPrefernece as Partial<SurveyUpdateInput>,
            });
        }
    };

    const handleSubmitText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setSurveyExperience((previousState) => {
            const updatedState = {
                ...previousState,
                [name]: value,
            };

            try {
                updateSurveyPreferences(updatedState);
                toast.success("Survey experience updated successfully");
            } catch (err) {
                toast.error("Something went wrong. Try again later");
            }

            return updatedState;
        });
    };

    const handleSwitches = (name: string, value: boolean) => {
        setSurveyExperience((previousState) => {
            const updatedState = {
                ...previousState,
                [name]: value,
            };

            try {
                updateSurveyPreferences(updatedState);
                toast.success("Survey experience updated successfully");
            } catch (err) {
                toast.error("Something went wrong. Try again later");
            }

            return updatedState;
        });
    };

    React.useEffect(() => {
        // sometimes... the survey settings JSON is undefined
        // so we need to parse it first before we can use it
        if (surveySettings) {
            const parsedSettingsRes = JSON.parse(surveySettings);

            if (parsedSettingsRes) {
                setSurveyExperience((previousState) => ({
                    ...previousState,
                    ...parsedSettingsRes,
                }));
            }
        }
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
