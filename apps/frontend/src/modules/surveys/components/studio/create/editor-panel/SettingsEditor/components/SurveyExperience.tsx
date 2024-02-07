import { SurveyUpdateInput } from "@/generated/graphql";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { Switch } from "@/ui";
import debounce from "lodash.debounce";
import React from "react";
import { EditorTextInput } from "../../components/EditorTextInput";

interface SurveyExperienceProps {
    close: boolean;
    showProgressBar: boolean;
    showBranding: boolean;
    submitText: string;
}

export const SurveyExperience = () => {
    const { updateSurvey, error, survey } = useSurvey();

    const settings = survey?.survey?.settings;

    const [surveyExperience, setSurveyExperience] =
        React.useState<SurveyExperienceProps>({
            close: false,
            showProgressBar: false,
            showBranding: false,
            submitText: "",
        });

    const updateSurveyPreferences = async (
        updatedPreferences: SurveyExperienceProps,
    ) => {
        if (survey.survey && error === undefined) {
            updateSurvey(survey.survey, {
                settings: JSON.stringify(
                    updatedPreferences,
                ) as Partial<SurveyUpdateInput>,
            });
        }
    };

    const handleSubmitText = React.useCallback(
        debounce((value: string) => {
            if (value.trim() !== "") {
                updateSurveyPreferences({
                    ...surveyExperience,
                    submitText: value,
                });
            }
        }, 1000),
        [surveyExperience],
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSurveyExperience((previousState) => ({
            ...previousState,
            submitText: value,
        }));

        handleSubmitText(value);
    };

    const handleSwitches = (name: string, value: boolean) => {
        setSurveyExperience((previousState) => {
            const updatedState = {
                ...previousState,
                [name]: value,
            };

            updateSurveyPreferences(updatedState);

            return updatedState;
        });
    };

    React.useEffect(() => {
        if (settings) {
            const parsedSettingsRes = JSON.parse(settings);

            if (parsedSettingsRes) {
                setSurveyExperience((previousState) => ({
                    ...previousState,
                    ...parsedSettingsRes,
                }));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    label="remove Integraflow branding"
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
                onChange={handleChange}
                value={surveyExperience.submitText}
                characterCount={surveyExperience.submitText.length}
            />
        </div>
    );
};
