import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { QuestionOption } from "@/types";
import { generateNumericalOptions } from "@/utils/question";
import { createOptions, createRangeOptions } from "@/utils/question/defaultOptions";
import { useState } from "react";
import { SingleValue } from "react-select";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { Option, ReactSelect } from "../ReactSelect";

const scaleStyleOptions = [
    {
        label: "Shapes",
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
        value: SurveyQuestionTypeEnum.Ces,
    },
];

const numericalOptions = generateNumericalOptions(2, 10);
const ratingOptions = generateNumericalOptions(2, 10);

export const RatingFields = () => {
    const { updateQuestion, question } = useQuestion();
    const [scaleStyle, setScaleStyle] = useState<string | number | undefined>(
        scaleStyleOptions.find((option) => option.value === question?.type)?.value,
    );

    if (
        !question ||
        ![
            SurveyQuestionTypeEnum.Rating,
            SurveyQuestionTypeEnum.Csat,
            SurveyQuestionTypeEnum.NumericalScale,
            SurveyQuestionTypeEnum.Ces,
        ].includes(question?.type)
    ) {
        return null;
    }

    return (
        <div>
            <div className="space-y-6">
                <div className="flex gap-2">
                    <div className="flex-1">
                        <ReactSelect
                            label="Scale Style"
                            options={scaleStyleOptions}
                            defaultValue={scaleStyleOptions.find((option) => option.value === question?.type)}
                            onchange={(value) => {
                                setScaleStyle((value as SingleValue<Option>)?.value);

                                updateQuestion({
                                    type: (value as SingleValue<Option>)?.value as SurveyQuestionTypeEnum,
                                    options: createOptions(
                                        (value as SingleValue<Option>)?.value as SurveyQuestionTypeEnum,
                                    ),
                                });
                            }}
                        />
                    </div>

                    {scaleStyle === SurveyQuestionTypeEnum.NumericalScale ? (
                        <div className="flex-1">
                            <ReactSelect
                                options={numericalOptions}
                                label="Range"
                                defaultValue={numericalOptions.find(
                                    (option) => option.value === question?.options?.length,
                                )}
                                onchange={(option) => {
                                    updateQuestion({
                                        options: createRangeOptions(
                                            question?.type,
                                            (option as SingleValue<Option>)?.value as number,
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
                                    (option) => option.value === question?.options?.length,
                                )}
                                onchange={(option) => {
                                    updateQuestion({
                                        options: createRangeOptions(
                                            question?.type,
                                            (option as SingleValue<Option>)?.value as number,
                                        ),
                                    });
                                }}
                            />
                        </div>
                    ) : null}
                </div>

                {scaleStyle === SurveyQuestionTypeEnum.Csat || scaleStyle === SurveyQuestionTypeEnum.Ces ? (
                    <div>
                        <p>Scale labels:</p>
                        {question?.options?.map((option: QuestionOption, index: number) => {
                            return (
                                <div key={option.id} className="mb-4">
                                    <EditorTextInput
                                        maxCharacterCount={100}
                                        defaultValue={option.label}
                                        onChange={(e) => {
                                            const newOptions = [...question.options];
                                            newOptions[index].label = e.target.value;
                                            updateQuestion(
                                                {
                                                    options: newOptions,
                                                },
                                                true,
                                            );
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </div>
    );
};
