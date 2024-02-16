import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { SingleValue } from "react-select";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { Option, ReactSelect } from "../ReactSelect";

enum BooleanOptionsShapeEnum {
    BUTTON = "button",
    THUMB = "thumb",
}

const booleanOptionsShape = [
    { label: "button", value: BooleanOptionsShapeEnum.BUTTON },
    { label: "thumb", value: BooleanOptionsShapeEnum.THUMB },
];

export const BooleanSettings = () => {
    const { question, updateSettings } = useQuestion();

    if (!question || question?.type !== SurveyQuestionTypeEnum.Boolean) {
        return null;
    }

    return (
        <div className="space-y-6">
            <EditorTextInput
                label="Positive text"
                placeholder="Positive text"
                defaultValue={question?.settings?.positiveText}
                onChange={(e) => updateSettings({ positiveText: e.target.value }, true)}
            />

            <EditorTextInput
                label="Negative text"
                placeholder="Negative text"
                defaultValue={question?.settings?.negativeText}
                onChange={(e) => updateSettings({ negativeText: e.target.value }, true)}
            />

            <ReactSelect
                label="Shape"
                options={booleanOptionsShape}
                defaultValue={booleanOptionsShape.find((option) => option.value === question?.settings?.shape)}
                onchange={(value) => updateSettings({ shape: (value as SingleValue<Option>)?.value })}
            />
        </div>
    );
};
