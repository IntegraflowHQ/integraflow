import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { QuestionOption } from "@/types";
import {
    createRangeOptions,
    generateNumericalOptions,
} from "@/utils/defaultOptions";
import { useState } from "react";
import { SingleValue } from "react-select";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { Option, ReactSelect } from "../ReactSelect";

type Props = {
    question: SurveyQuestion;
};

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
];
const numericalOptions = generateNumericalOptions(2, 10);
const ratingOptions = generateNumericalOptions(2, 10);

export const RatingFields = ({ question }: Props) => {
    const { updateQuestionMutation } = useQuestion();
    const [scaleStyle, setScaleStyle] = useState<string | number | undefined>(
        scaleStyleOptions.find((option) => option.value === question.type)
            ?.value,
    );
    return (
        <div>
            {question.type === SurveyQuestionTypeEnum.Rating ||
            question.type === SurveyQuestionTypeEnum.Csat ||
            question.type === SurveyQuestionTypeEnum.NumericalScale ? (
                <>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <ReactSelect
                                label="Scale Style"
                                options={scaleStyleOptions}
                                defaultValue={scaleStyleOptions.find(
                                    (option) => option.value === question.type,
                                )}
                                onchange={(value) => {
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
                                            question.options?.length,
                                    )}
                                    onchange={(option) => {
                                        updateQuestionMutation({
                                            options: createRangeOptions(
                                                question.type,
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
                                            question.options?.length,
                                    )}
                                    onchange={(option) => {
                                        updateQuestionMutation({
                                            options: createRangeOptions(
                                                question.type,
                                                (option as SingleValue<Option>)
                                                    ?.value as number,
                                            ),
                                        });
                                    }}
                                />
                            </div>
                        ) : null}
                    </div>
                    {scaleStyle === SurveyQuestionTypeEnum.Csat ? (
                        <div>
                            <p>Scale labels:</p>
                            {question.options?.map(
                                (option: QuestionOption, index: number) => {
                                    return (
                                        <div
                                            key={option.id}
                                            className="flex items-center gap-2"
                                        >
                                            <EditorTextInput
                                                value={option.label}
                                                onChange={(e) => {
                                                    const newOptions =
                                                        question.options;
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
                </>
            ) : null}
        </div>
    );
};
