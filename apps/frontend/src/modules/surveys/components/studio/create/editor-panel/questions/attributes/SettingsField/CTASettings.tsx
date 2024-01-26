import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { CTAType } from "@integraflow/web/src/types";
import { useState } from "react";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { ReactSelect } from "../ReactSelec";

type Props = {
    question: SurveyQuestion;
};
const ctaTypeOptions = [
    {
        label: "link",
        value: CTAType.LINK,
    },
    {
        label: "close",
        value: CTAType.CLOSE,
    },
    {
        label: "hidden",
        value: CTAType.HIDDEN,
    },
];

export const CTASettings = ({ question }: Props) => {
    const { updateQuestionMutation } = useQuestion();
    const [buttonLabel, setButtonLabel] = useState(question.settings.text);

    return (
        <>
            {question.type === SurveyQuestionTypeEnum.Cta && (
                <>
                    <EditorTextInput
                        label={"Button label"}
                        placeholder=""
                        onChange={(e) => {
                            setButtonLabel(e.target.value);
                            const newSettings = question.settings;
                            newSettings.consentText = e.target.value;
                            updateQuestionMutation({
                                settings: newSettings,
                            });
                        }}
                        characterCount={buttonLabel?.split("").length}
                    />
                    {question.settings.ctaType !== CTAType.NEXT ? (
                        <div>
                            <ReactSelect
                                options={ctaTypeOptions}
                                defaultValue={ctaTypeOptions.find(
                                    (option) =>
                                        option.value ===
                                        question.settings.ctaType,
                                )}
                                label="Button type"
                                onchange={(option) => {
                                    const newSettings = question.settings;
                                    newSettings.ctaType = option?.value;
                                    if (
                                        option?.value === CTAType.CLOSE ||
                                        option?.value === CTAType.HIDDEN
                                    ) {
                                        newSettings.link = "";
                                    }
                                    updateQuestionMutation({
                                        settings: newSettings,
                                    });
                                }}
                            />
                            {question.settings.ctaType === CTAType.LINK ? (
                                <EditorTextInput
                                    label={"Button link"}
                                    placeholder=""
                                    onChange={(e) => {
                                        const newSettings = question.settings;
                                        newSettings.link = e.target.value;
                                        updateQuestionMutation({
                                            settings: newSettings,
                                        });
                                    }}
                                    characterCount={
                                        question.settings.ctaLink?.split("")
                                            .length
                                    }
                                />
                            ) : null}
                        </div>
                    ) : null}
                </>
            )}
        </>
    );
};
