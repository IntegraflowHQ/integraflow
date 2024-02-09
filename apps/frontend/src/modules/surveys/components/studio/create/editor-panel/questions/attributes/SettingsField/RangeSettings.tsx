import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { QuestionSettings } from "@/types";
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
    const { updateQuestionMutation, openQuestion } = useQuestion();

    const updateSettings = (newSettings: QuestionSettings) => {
        updateQuestionMutation({
            settings: { ...openQuestion?.settings, ...newSettings },
        });
    };

    return (
        <>
            {(openQuestion?.type === SurveyQuestionTypeEnum.Nps ||
                openQuestion?.type ===
                    SurveyQuestionTypeEnum.NumericalScale) && (
                <>
                    <div>
                        <p>Text on the left</p>
                        <div>
                            <EditorTextInput
                                defaultValue={openQuestion?.settings.leftText}
                                onChange={(e) =>
                                    updateSettings({ leftText: e.target.value })
                                }
                                characterCount={
                                    openQuestion?.settings.leftText?.length ?? 0
                                }
                            />
                        </div>
                    </div>
                    <div>
                        <p>Text on the right</p>
                        <div>
                            <EditorTextInput
                                defaultValue={openQuestion?.settings.rightText}
                                onChange={(e) =>
                                    updateSettings({
                                        rightText: e.target.value,
                                    })
                                }
                                characterCount={
                                    openQuestion?.settings.rightText?.length ??
                                    0
                                }
                            />
                        </div>
                    </div>
                </>
            )}

            {openQuestion?.type === SurveyQuestionTypeEnum.Rating && (
                <ReactSelect
                    label="Shape"
                    options={rangeShape}
                    defaultValue={rangeShape.find(
                        (option) =>
                            option.value === openQuestion?.settings.shape,
                    )}
                    onchange={(option) =>
                        updateSettings({
                            shape: (option as SingleValue<Option>)?.value,
                        })
                    }
                />
            )}

            {openQuestion?.type === SurveyQuestionTypeEnum.SmileyScale && (
                <>
                    <EditorTextInput
                        label="Right text"
                        placeholder=""
                        defaultValue={openQuestion?.settings.rightText}
                        onChange={(e) =>
                            updateSettings({ rightText: e.target.value })
                        }
                        characterCount={
                            openQuestion?.settings.rightText?.length ?? 0
                        }
                    />
                    <EditorTextInput
                        label="Left text"
                        placeholder=""
                        defaultValue={openQuestion?.settings.leftText}
                        onChange={(e) =>
                            updateSettings({ leftText: e.target.value })
                        }
                        characterCount={
                            openQuestion?.settings.leftText?.length ?? 0
                        }
                    />
                    <ReactSelect
                        options={smileyCount}
                        defaultValue={smileyCount.find(
                            (option) =>
                                option.value === openQuestion?.settings.count,
                        )}
                        label="Number of smileys"
                        onchange={(
                            option: MultiValue<Option> | SingleValue<Option>,
                        ) =>
                            updateSettings({
                                count: (option as SingleValue<Option>)?.value,
                            })
                        }
                    />
                </>
            )}
        </>
    );
};
