import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { SingleValue } from "react-select";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { Option, ReactSelect } from "../ReactSelect";

type Props = {
    question: SurveyQuestion;
};

enum RangeShapeEnum {
    STAR = "star",
    THUMB = "thumb",
    HEART = "heart",
}

const rangeShape = [
    {
        label: "star",
        value: RangeShapeEnum.STAR,
    },
    {
        label: "thumb",
        value: RangeShapeEnum.THUMB,
    },
    {
        label: "heart",
        value: RangeShapeEnum.HEART,
    },
];

const smileyCount = [
    {
        label: "3",
        value: 3,
    },
    {
        label: "5",
        value: 5,
    },
];

export const RangeSettings = ({ question }: Props) => {
    const { updateQuestionMutation } = useQuestion();

    return (
        <>
            {question.type === SurveyQuestionTypeEnum.Nps ||
            question.type === SurveyQuestionTypeEnum.NumericalScale ? (
                <>
                    <div className="flex items-center justify-between gap-4">
                        <p>Text on the left</p>
                        <div className="w-[330px]">
                            <EditorTextInput
                                defaultValue={question.settings.leftText}
                                onChange={(e) => {
                                    const newSettings = question.settings;
                                    newSettings.leftText = e.target.value;
                                    updateQuestionMutation({
                                        settings: newSettings,
                                    });
                                }}
                                characterCount={
                                    question.settings.leftText?.split("").length
                                }
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <p>Text on the right</p>
                        <div className="w-[330px]">
                            <EditorTextInput
                                defaultValue={question.settings.rightText}
                                onChange={(e) => {
                                    const newSettings = question.settings;
                                    newSettings.rightText = e.target.value;
                                    updateQuestionMutation({
                                        settings: newSettings,
                                    });
                                }}
                                characterCount={
                                    question.settings.rightText?.split("")
                                        .length
                                }
                            />
                        </div>
                    </div>
                </>
            ) : null}
            {question.type === SurveyQuestionTypeEnum.Rating ? (
                <>
                    <ReactSelect
                        label="shape"
                        options={rangeShape}
                        defaultValue={rangeShape.find(
                            (option) =>
                                option.value === question.settings.shape,
                        )}
                        onchange={(option) => {
                            const newSettings = question.settings;
                            newSettings.shape = (option as SingleValue<Option>)
                                ?.value;
                            updateQuestionMutation({
                                settings: newSettings,
                            });
                        }}
                    />
                </>
            ) : null}

            {question.type === SurveyQuestionTypeEnum.SmileyScale && (
                <>
                    <EditorTextInput
                        label={"Right text"}
                        placeholder=""
                        defaultValue={question.settings.rightText}
                        onChange={(e) => {
                            const newSettings = question.settings;
                            newSettings.rightText = e.target.value;
                            updateQuestionMutation({
                                settings: newSettings,
                            });
                        }}
                        characterCount={
                            question.settings.rightText?.split("").length
                        }
                    />
                    <EditorTextInput
                        label={"Left text"}
                        placeholder=""
                        defaultValue={question.settings.leftText}
                        onChange={(e) => {
                            const newSettings = question.settings;
                            newSettings.negativeText = e.target.value;
                            updateQuestionMutation({
                                settings: newSettings,
                            });
                        }}
                        characterCount={
                            question.settings.leftText?.split("").length
                        }
                    />
                    <ReactSelect
                        options={smileyCount}
                        defaultValue={smileyCount.find(
                            (option) =>
                                option.value === question.settings.count,
                        )}
                        label="Number of smileys"
                        onchange={(option) => {
                            const newSettings = question.settings;
                            newSettings.count = (option as SingleValue<Option>)
                                ?.value;
                            updateQuestionMutation({
                                settings: newSettings,
                            });
                        }}
                    />
                </>
            )}
        </>
    );
};
