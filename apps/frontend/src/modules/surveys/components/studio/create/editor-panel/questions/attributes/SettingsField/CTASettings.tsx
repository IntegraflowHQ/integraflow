import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { QuestionSettings } from "@/types";
import { CTAType } from "@integraflow/web/src/types";
import { SingleValue } from "react-select";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { Option, ReactSelect } from "../ReactSelect";

const ctaTypeOptions = [
    { label: "Link", value: CTAType.LINK },
    { label: "Close", value: CTAType.CLOSE },
    { label: "Hidden", value: CTAType.HIDDEN },
];

export const CTASettings = () => {
    const { updateQuestionMutation, openQuestion } = useQuestion();

    const updateSettings = (newSettings: QuestionSettings) => {
        updateQuestionMutation({
            settings: { ...openQuestion?.settings, ...newSettings },
        });
    };

    return (
        <>
            {openQuestion?.type === SurveyQuestionTypeEnum.Cta && (
                <>
                    <EditorTextInput
                        label="Button label"
                        defaultValue={openQuestion?.settings.text}
                        onChange={(e) => {
                            const newSettings = {
                                ...openQuestion.settings,
                                text: e.target.value,
                            };
                            updateSettings(newSettings);
                        }}
                        characterCount={
                            openQuestion?.settings.label?.length ?? 0
                        }
                    />
                    {openQuestion.settings.type !== CTAType.NEXT && (
                        <div>
                            <ReactSelect
                                options={ctaTypeOptions}
                                defaultValue={ctaTypeOptions.find(
                                    (option) =>
                                        option.value ===
                                        openQuestion?.settings.type,
                                )}
                                label="Button type"
                                onchange={(option) => {
                                    const newSettings = {
                                        ...openQuestion.settings,
                                        type: (option as SingleValue<Option>)
                                            ?.value,
                                    };
                                    if (
                                        (option as SingleValue<Option>)
                                            ?.value === CTAType.CLOSE ||
                                        (option as SingleValue<Option>)
                                            ?.value === CTAType.HIDDEN
                                    ) {
                                        newSettings.link = "";
                                    }
                                    updateSettings(newSettings);
                                }}
                            />
                            {openQuestion?.settings.type === CTAType.LINK && (
                                <EditorTextInput
                                    label="Button link"
                                    defaultValue={openQuestion?.settings.link}
                                    onChange={(e) => {
                                        const newSettings = {
                                            ...openQuestion.settings,
                                            link: e.target.value,
                                        };
                                        updateSettings(newSettings);
                                    }}
                                    characterCount={
                                        openQuestion?.settings.link?.length ?? 0
                                    }
                                />
                            )}
                        </div>
                    )}
                </>
            )}
        </>
    );
};
