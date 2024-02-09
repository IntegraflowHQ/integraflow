import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { QuestionSettings } from "@/types";
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
    { label: "button", value: BooleanOptionsShapeEnum.BUTTON },
    { label: "thumb", value: BooleanOptionsShapeEnum.THUMB },
];

export const BooleanSettings = ({}: Props) => {
    const { updateQuestionMutation, openQuestion } = useQuestion();

    const updateSettings = (newSettings: QuestionSettings) => {
        updateQuestionMutation({
            settings: { ...openQuestion?.settings, ...newSettings },
        });
    };

    return (
        <div className="space-y-6">
            {openQuestion?.type === SurveyQuestionTypeEnum.Boolean && (
                <>
                    <EditorTextInput
                        label="Positive text"
                        placeholder="Positive text"
                        defaultValue={openQuestion?.settings?.positiveText}
                        onChange={(e) =>
                            updateSettings({
                                positiveText: e.target.value,
                            })
                        }
                        characterCount={
                            openQuestion?.settings?.positiveText?.length
                        }
                    />
                    <EditorTextInput
                        label="Negative text"
                        placeholder="Negative text"
                        defaultValue={openQuestion?.settings?.negativeText}
                        onChange={(e) =>
                            updateSettings({
                                negativeText: e.target.value,
                            })
                        }
                        characterCount={
                            openQuestion?.settings?.negativeText?.length
                        }
                    />
                    <ReactSelect
                        label="Shape"
                        options={booleanOptionsShape}
                        defaultValue={booleanOptionsShape.find(
                            (option) =>
                                option.value === openQuestion?.settings?.shape,
                        )}
                        onchange={(value) =>
                            updateSettings({
                                shape: (value as SingleValue<Option>)?.value,
                            })
                        }
                    />
                </>
            )}
        </div>
    );
};
