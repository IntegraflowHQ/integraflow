import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useState } from "react";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { ReactSelect } from "../ReactSelec";

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

    const [positiveText, setPositiveText] = useState(
        question.settings.positiveText,
    );
    const [negativeText, setNegativeText] = useState(
        question.settings.negativeText,
    );

    return (
        <div className="space-y-6">
            {question.type === SurveyQuestionTypeEnum.Boolean && (
                <>
                    <EditorTextInput
                        label={"Positive text"}
                        placeholder="Positive text"
                        value={positiveText}
                        onChange={(e) => {
                            setPositiveText(e.target.value);
                            updateQuestionMutation({
                                settings: {
                                    ...question.settings,
                                    positiveText: e.target.value,
                                },
                            });
                        }}
                        characterCount={positiveText?.split("").length}
                    />
                    <EditorTextInput
                        label={"Negative text"}
                        placeholder="Negative text"
                        value={negativeText}
                        onChange={(e) => {
                            setNegativeText(e.target.value);
                            updateQuestionMutation({
                                settings: {
                                    ...question.settings,
                                    negativeText: e.target.value,
                                },
                            });
                        }}
                        characterCount={negativeText?.split("").length}
                    />
                    <ReactSelect
                        options={booleanOptionsShape}
                        defaultValue={booleanOptionsShape.find(
                            (option) =>
                                option.value === question.settings.shape,
                        )}
                        onchange={(value) => {
                            updateQuestionMutation({
                                settings: {
                                    ...question.settings,
                                    shape: value?.value,
                                },
                            });
                        }}
                    />
                </>
            )}
        </div>
    );
};
