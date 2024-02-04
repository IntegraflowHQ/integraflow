import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useState } from "react";
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
    const [rightText, setRightText] = useState(question.settings.rightText);
    const [leftText, setLeftText] = useState(question.settings.leftText);
    return (
        <>
            {question.type === SurveyQuestionTypeEnum.Nps ||
            question.type === SurveyQuestionTypeEnum.NumericalScale ? (
                <>
                    <div className="flex items-center justify-between gap-4">
                        <p>Text on the left</p>
                        <div className="w-[330px]">
                            <EditorTextInput />
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <p>Text on the right</p>
                        <div className="w-[330px]">
                            <EditorTextInput />
                        </div>
                    </div>
                </>
            ) : null}
            {question.type === SurveyQuestionTypeEnum.Rating ? (
                <>
                    <EditorTextInput
                        label={"Positive text"}
                        placeholder="Positive text"
                    />
                    <EditorTextInput
                        label={"Negative text"}
                        placeholder="Negative text"
                    />
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
                        onChange={(e) => {
                            setRightText(e.target.value);
                            const newSettings = question.settings;
                            newSettings.rightText = e.target.value;
                            updateQuestionMutation({
                                settings: newSettings,
                            });
                        }}
                        characterCount={rightText?.split("").length}
                    />
                    <EditorTextInput
                        label={"Left text"}
                        placeholder=""
                        onChange={(e) => {
                            setLeftText(e.target.value);
                            const newSettings = question.settings;
                            newSettings.negativeText = e.target.value;
                            updateQuestionMutation({
                                settings: newSettings,
                            });
                        }}
                        characterCount={leftText?.split("").length}
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
