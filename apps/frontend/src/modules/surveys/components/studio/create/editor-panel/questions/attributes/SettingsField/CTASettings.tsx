import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { QuestionSettings } from "@/types";
import { CTAType } from "@integraflow/web/src/types";
import { SingleValue } from "react-select";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { Option, ReactSelect } from "../ReactSelect";

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

    const typedQuestion = question as SurveyQuestion;
    typedQuestion.settings;

    return (
        <>
            {question.type === SurveyQuestionTypeEnum.Cta && (
                <>
                    <EditorTextInput
                        label={"Button label"}
                        defaultValue={question.settings.text}
                        onChange={(e) => {
                            const newSettings = question.settings;
                            (newSettings as QuestionSettings).text =
                                e.target.value;
                            updateQuestionMutation({
                                settings: newSettings,
                            });
                        }}
                        characterCount={
                            question.settings.label?.split("").length
                        }
                    />
                    {question.settings.type !== CTAType.NEXT ? (
                        <div>
                            <ReactSelect
                                options={ctaTypeOptions}
                                defaultValue={ctaTypeOptions.find(
                                    (option) =>
                                        option.value === question.settings.type,
                                )}
                                label="Button type"
                                onchange={(option) => {
                                    const newSettings =
                                        question.settings as QuestionSettings;
                                    newSettings.type = (
                                        option as SingleValue<Option>
                                    )?.value;
                                    if (
                                        (option as SingleValue<Option>)
                                            ?.value === CTAType.CLOSE ||
                                        (option as SingleValue<Option>)
                                            ?.value === CTAType.HIDDEN
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
                                    defaultValue={question.settings.ctaLink}
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
