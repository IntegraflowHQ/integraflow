import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { Switch } from "@/ui";
import { useEffect, useState } from "react";
import { EditorTextInput } from "../../../components/EditorTextInput";

export const FormSettings = () => {
    const { question, updateQuestion } = useQuestion();

    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        if (question?.settings.disclaimerText) {
            setShowDisclaimer(true);
        }
        if (question?.settings.consentText) {
            setShowConsent(true);
        }
    }, [question?.settings.disclaimerText, question?.settings.consentText]);

    if (!question || question?.type !== SurveyQuestionTypeEnum.Form) {
        return null;
    }

    return (
        <div>
            <div className="space-y-6">
                <div>
                    <div className="rounded bg-[#272138]">
                        <Switch
                            name="disclaimer"
                            label="Show Disclaimer"
                            defaultValue={question?.settings.disclaimer}
                            onChange={(e) => {
                                const newSettings = { ...question?.settings };
                                newSettings.disclaimer = e.target.value;
                                if (e.target.value === false) {
                                    newSettings.disclaimerText = "";
                                }

                                updateQuestion({
                                    settings: newSettings,
                                });
                                setShowDisclaimer(!showDisclaimer);
                            }}
                        />
                    </div>

                    {showDisclaimer ? (
                        <EditorTextInput
                            onChange={(e) => {
                                const newSettings = { ...question?.settings };
                                newSettings.disclaimerText = e.target.value;
                                updateQuestion(
                                    {
                                        settings: newSettings,
                                    },
                                    true,
                                );
                            }}
                            defaultValue={question?.settings.disclaimerText}
                            label={"Disclaimer content"}
                            placeholder="Type in your disclaimer here"
                        />
                    ) : null}
                </div>
                <div>
                    <div className="rounded bg-[#272138]">
                        <Switch
                            name="consent"
                            label="Consent checkbox"
                            defaultValue={question?.settings.consent}
                            onChange={(e) => {
                                const newSettings = { ...question?.settings };
                                newSettings.consent = e.target.value;
                                if (e.target.value === false) {
                                    newSettings.consentText = "";
                                }
                                updateQuestion({
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
                                const newSettings = { ...question?.settings };
                                newSettings.consentText = e.target.value;
                                updateQuestion(
                                    {
                                        settings: newSettings,
                                    },
                                    true,
                                );
                            }}
                            defaultValue={question.settings.consentText}
                            placeholder="Type in consent label here"
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
};
