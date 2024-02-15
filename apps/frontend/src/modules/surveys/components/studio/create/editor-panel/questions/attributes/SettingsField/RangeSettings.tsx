import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { MultiValue, SingleValue } from "react-select";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { Option, ReactSelect } from "../ReactSelect";

enum RangeShapeEnum {
    STAR = "star",
    THUMB = "thumb",
    HEART = "heart",
}

const rangeShape = [
    { label: "Star", value: RangeShapeEnum.STAR },
    { label: "Thumb", value: RangeShapeEnum.THUMB },
    { label: "Heart", value: RangeShapeEnum.HEART },
];

const smileyCount = [
    { label: "3", value: 3 },
    { label: "5", value: 5 },
];

export const RangeSettings = () => {
    const { question, updateSettings } = useQuestion();

    if (!question) {
        return null;
    }

    return (
        <>
            {(question?.type === SurveyQuestionTypeEnum.Nps ||
                question?.type === SurveyQuestionTypeEnum.NumericalScale) && (
                <>
                    <div>
                        <p>Text on the left</p>
                        <div>
                            <EditorTextInput
                                defaultValue={question?.settings.leftText}
                                onChange={(e) => {
                                    updateSettings({ leftText: e.target.value }, true);
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <p>Text on the right</p>
                        <div>
                            <EditorTextInput
                                defaultValue={question?.settings.rightText}
                                onChange={(e) => {
                                    updateSettings({ rightText: e.target.value }, true);
                                }}
                            />
                        </div>
                    </div>
                </>
            )}

            {question?.type === SurveyQuestionTypeEnum.Rating && (
                <ReactSelect
                    label="Shape"
                    options={rangeShape}
                    defaultValue={rangeShape.find((option) => option.value === question?.settings.shape)}
                    onchange={(option) => updateSettings({ shape: (option as SingleValue<Option>)?.value })}
                />
            )}

            {question?.type === SurveyQuestionTypeEnum.SmileyScale && (
                <>
                    <EditorTextInput
                        label="Right text"
                        placeholder=""
                        defaultValue={question?.settings.rightText}
                        onChange={(e) => updateSettings({ rightText: e.target.value }, true)}
                    />
                    <EditorTextInput
                        label="Left text"
                        placeholder=""
                        defaultValue={question?.settings.leftText}
                        onChange={(e) => updateSettings({ leftText: e.target.value })}
                    />

                    <ReactSelect
                        options={smileyCount}
                        defaultValue={smileyCount.find((option) => option.value === question?.settings.count)}
                        label="Number of smileys"
                        onchange={(option: MultiValue<Option> | SingleValue<Option>) => {
                            updateSettings({ count: (option as SingleValue<Option>)?.value });
                        }}
                    />
                </>
            )}
        </>
    );
};
