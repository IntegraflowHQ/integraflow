import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { SingleValue } from "react-select";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { Option, ReactSelect } from "../ReactSelect";

type Props = {
    question: SurveyQuestion;
};

enum BooleanOptionsShapeEnum {
    BUTTON = "button",
    THUMB = "thumb",
}

const booleanOptionsShape = [
    {
        label: "button",
        value: BooleanOptionsShapeEnum.BUTTON,
    },
    {
        label: "thumb",
        value: BooleanOptionsShapeEnum.THUMB,
    },
];
export const BooleanSettings = ({ question }: Props) => {
    const { updateQuestionMutation } = useQuestion();

    return (
        <div className="space-y-6">
            {question.type === SurveyQuestionTypeEnum.Boolean && (
                <>
                    <EditorTextInput
                        label={"Positive text"}
                        placeholder="Positive text"
                        defaultValue={question.settings.positiveText}
                        onChange={(e) => {
                            updateQuestionMutation({
                                settings: {
                                    ...question.settings,
                                    positiveText: e.target.value,
                                },
                            });
                        }}
                        characterCount={
                            question.settings.positiveText?.split("").length
                        }
                    />
                    <EditorTextInput
                        label={"Negative text"}
                        placeholder="Negative text"
                        defaultValue={question.settings.negativeText}
                        onChange={(e) => {
                            updateQuestionMutation({
                                settings: {
                                    ...question.settings,
                                    negativeText: e.target.value,
                                },
                            });
                        }}
                        characterCount={
                            question.settings.negativeText?.split("").length
                        }
                    />
                    <ReactSelect
                        label="Shape"
                        options={booleanOptionsShape}
                        defaultValue={booleanOptionsShape.find(
                            (option) =>
                                option.value === question.settings.shape,
                        )}
                        onchange={(value) => {
                            updateQuestionMutation({
                                settings: {
                                    ...question.settings,
                                    shape: (value as SingleValue<Option>)
                                        ?.value,
                                },
                            });
                        }}
                    />
                </>
            )}
        </div>
    );
};
