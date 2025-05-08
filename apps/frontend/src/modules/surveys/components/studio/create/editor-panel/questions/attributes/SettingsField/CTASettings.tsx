import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { CTAType } from "@/types";
import { SingleValue } from "react-select";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { Option, ReactSelect } from "../ReactSelect";

const ctaTypeOptions = [
    { label: "Link", value: CTAType.LINK },
    { label: "Close", value: CTAType.CLOSE },
    { label: "Hidden", value: CTAType.HIDDEN },
];

export const CTASettings = () => {
    const { question, updateSettings } = useQuestion();

    if (!question || question?.type !== SurveyQuestionTypeEnum.Cta) {
        return null;
    }

    return (
        <>
            <EditorTextInput
                dataTestid="button-label"
                label="Button label"
                defaultValue={question?.settings.text}
                onChange={(e) => {
                    updateSettings({ text: e.target.value }, true);
                }}
            />

            {question.settings.type !== CTAType.NEXT && (
                <div>
                    <ReactSelect
                        options={ctaTypeOptions}
                        defaultValue={ctaTypeOptions.find((option) => option.value === question?.settings.type)}
                        label="Button type"
                        dataTestid="button-type-indicator"
                        onchange={(option) => {
                            const newSettings = {
                                ...question.settings,
                                type: (option as SingleValue<Option>)?.value,
                            };
                            if (
                                (option as SingleValue<Option>)?.value === CTAType.CLOSE ||
                                (option as SingleValue<Option>)?.value === CTAType.HIDDEN
                            ) {
                                newSettings.link = "";
                            }
                            updateSettings(newSettings);
                        }}
                    />

                    {question?.settings.type === CTAType.LINK && (
                        <EditorTextInput
                            dataTestid="button-link"
                            maxCharacterCount={100}
                            label="Button link"
                            defaultValue={question?.settings.link}
                            onChange={(e) => {
                                updateSettings({ link: e.target.value });
                            }}
                        />
                    )}
                </div>
            )}
        </>
    );
};
