import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { QuestionOption } from "@/types";
import { generateNumericalOptions } from "@/utils/question";
import { createRangeOptions } from "@/utils/question/defaultOptions";
import { useState } from "react";
import { SingleValue } from "react-select";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { Option, ReactSelect } from "../ReactSelect";

const scaleStyleOptions = [
    {
        label: "shapes",
        value: SurveyQuestionTypeEnum.Rating,
    },
    {
        label: "Numerical",
        value: SurveyQuestionTypeEnum.NumericalScale,
    },
    {
        label: "Classic CSAT",
        value: SurveyQuestionTypeEnum.Csat,
    },
    {
        label: "CES",
        value: "CES",
    },
];
const numericalOptions = generateNumericalOptions(2, 10);
const ratingOptions = generateNumericalOptions(2, 10);

export const RatingFields = () => {
    const { updateQuestionMutation, openQuestion } = useQuestion();
    const [scaleStyle, setScaleStyle] = useState<string | number | undefined>(
        scaleStyleOptions.find((option) => option.value === openQuestion?.type)
            ?.value,
    );
    console.log(scaleStyle);
    return (
        <div>
            {openQuestion?.type === SurveyQuestionTypeEnum.Rating ||
            openQuestion?.type === SurveyQuestionTypeEnum.Csat ||
            openQuestion?.type === SurveyQuestionTypeEnum.NumericalScale ||
            openQuestion?.type === "CES" ? (
                <div className="space-y-6">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <ReactSelect
                                label="Scale Style"
                                options={scaleStyleOptions}
                                defaultValue={scaleStyleOptions.find(
                                    (option) =>
                                        option.value === openQuestion?.type,
                                )}
                                onchange={(value) => {
                                    console.log(value);
                                    setScaleStyle(
                                        (value as SingleValue<Option>)?.value,
                                    );

                                    updateQuestionMutation({
                                        type: (value as SingleValue<Option>)
                                            ?.value as SurveyQuestionTypeEnum,
                                        options: createRangeOptions(
                                            (value as SingleValue<Option>)
                                                ?.value as SurveyQuestionTypeEnum,
                                            5,
                                        ),
                                    });
                                }}
                            />
                        </div>
                        {scaleStyle ===
                        SurveyQuestionTypeEnum.NumericalScale ? (
                            <div className="flex-1">
                                <ReactSelect
                                    options={numericalOptions}
                                    label="Range"
                                    defaultValue={numericalOptions.find(
                                        (option) =>
                                            option.value ===
                                            openQuestion?.options?.length,
                                    )}
                                    onchange={(option) => {
                                        updateQuestionMutation({
                                            options: createRangeOptions(
                                                openQuestion?.type,
                                                (option as SingleValue<Option>)
                                                    ?.value as number,
                                            ),
                                        });
                                    }}
                                />
                            </div>
                        ) : null}
                        {scaleStyle === SurveyQuestionTypeEnum.Rating ? (
                            <div className="flex-1">
                                <ReactSelect
                                    options={ratingOptions}
                                    label="Range"
                                    defaultValue={ratingOptions.find(
                                        (option) =>
                                            option.value ===
                                            openQuestion?.options?.length,
                                    )}
                                    onchange={(option) => {
                                        updateQuestionMutation({
                                            options: createRangeOptions(
                                                openQuestion?.type,
                                                (option as SingleValue<Option>)
                                                    ?.value as number,
                                            ),
                                        });
                                    }}
                                />
                            </div>
                        ) : null}
                    </div>
                    {scaleStyle === SurveyQuestionTypeEnum.Csat ||
                    scaleStyle === "CES" ? (
                        <div>
                            <p>Scale labels:</p>
                            {openQuestion?.options?.map(
                                (option: QuestionOption, index: number) => {
                                    console.log("openQuestion: ", openQuestion);
                                    console.log(option);
                                    return (
                                        <div key={option.id} className="mb-4">
                                            <EditorTextInput
                                                defaultValue={option.label}
                                                onChange={(e) => {
                                                    const newOptions =
                                                        openQuestion?.options;
                                                    newOptions[index].label =
                                                        e.target.value;
                                                    updateQuestionMutation({
                                                        options: newOptions,
                                                    });
                                                }}
                                            />
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};
