import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { Switch } from "@/ui";
import { useEffect, useState } from "react";
import { EditorTextInput } from "../../../components/EditorTextInput";

type Props = {
    question: SurveyQuestion;
};

export const FormSettings = ({}: Props) => {
    const { updateQuestionMutation, openQuestion } = useQuestion();

    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        if (openQuestion?.settings.disclaimerText) {
            setShowDisclaimer(true);
        }
        if (openQuestion?.settings.consentText) {
            setShowConsent(true);
        }
    }, [
        openQuestion?.settings.disclaimerText,
        openQuestion?.settings.consentText,
    ]);

    return (
        <div>
            {openQuestion?.type === SurveyQuestionTypeEnum.Form ? (
                <div className="space-y-6">
                    <div>
                        <div className="rounded bg-[#272138]">
                            <Switch
                                name="disclaimer"
                                label="Show Disclaimer"
                                defaultValue={openQuestion?.settings.disclaimer}
                                onChange={(e) => {
                                    const newSettings = openQuestion?.settings;
                                    newSettings.disclaimer = e.target.value;
                                    if (e.target.value === false) {
                                        newSettings.disclaimerText = "";
                                    }

                                    updateQuestionMutation({
                                        settings: newSettings,
                                    });
                                    setShowDisclaimer(!showDisclaimer);
                                }}
                            />
                        </div>
                        {showDisclaimer ? (
                            <EditorTextInput
                                onChange={(e) => {
                                    const newSettings = openQuestion?.settings;
                                    newSettings.disclaimerText = e.target.value;
                                    updateQuestionMutation({
                                        settings: newSettings,
                                    });
                                }}
                                defaultValue={
                                    openQuestion?.settings.disclaimerText
                                }
                                label={"Disclaimer content"}
                                placeholder="Type in your disclaimer here"
                                characterCount={
                                    openQuestion?.settings.disclaimerText?.split(
                                        "",
                                    ).length
                                }
                            />
                        ) : null}
                    </div>
                    <div>
                        <div className="rounded bg-[#272138]">
                            <Switch
                                name="consent"
                                label="Consent checkbox"
                                defaultValue={openQuestion?.settings.consent}
                                onChange={(e) => {
                                    const newSettings = openQuestion?.settings;
                                    newSettings.consent = e.target.value;
                                    if (e.target.value === false) {
                                        newSettings.consentText = "";
                                    }
                                    updateQuestionMutation({
                                        settings: newSettings,
                                    });
                                    setShowConsent(!showConsent);
                                }}
                            />
                        </div>
                        {showConsent ? (
                            <EditorTextInput
                                label={"Consent Label"}
                                onChange={(e) => {
                                    const newSettings = openQuestion?.settings;
                                    newSettings.consentText = e.target.value;
                                    updateQuestionMutation({
                                        settings: newSettings,
                                    });
                                }}
                                defaultValue={openQuestion.settings.consentText}
                                placeholder="Type in consent label here"
                                characterCount={
                                    openQuestion.settings.consentText?.split("")
                                        .length
                                }
                            />
                        ) : null}
                    </div>
                </div>
            ) : null}
        </div>
    );
};
