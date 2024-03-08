import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { Switch } from "@/ui";
import { rangeOptions } from "@/utils/question";
import { useState } from "react";
import { MultiValue, SingleValue } from "react-select";
import MinMaxSelector from "../MinMaxSelector";
import { Option, ReactSelect } from "../ReactSelect";

enum LimitRange {
    EXACT = "exact",
    RANGE = "range",
}

const limitRange = [
    {
        label: "exact number",
        value: "exact",
    },
    {
        label: "range",
        value: "range",
    },
];

export const ChoiceSettings = () => {
    const { question, updateSettings } = useQuestion();
    const [rangeOption, setRangeOption] = useState(
        question?.settings.choice?.min === question?.settings.choice?.max ? limitRange[0].value : limitRange[1].value,
    );

    const handleMaxChange = (option: SingleValue<Option> | MultiValue<Option>) => {
        const newSettings = question?.settings ? { ...question?.settings } : {};
        if (!newSettings?.choice) {
            newSettings.choice = {
                min: 0,
                max: 0,
            };
        }
        newSettings.choice.max = (option as SingleValue<Option>)?.value;
        updateSettings(newSettings);
    };

    const handleMinChange = (option: SingleValue<Option> | MultiValue<Option>) => {
        const newSettings = question?.settings ? { ...question?.settings } : {};
        if (!newSettings?.choice) {
            newSettings.choice = {
                min: 0,
                max: 0,
            };
        }
        newSettings.choice.min = (option as SingleValue<Option>)?.value;
        updateSettings(newSettings);
    };

    const handleExactRangeChange = (option: SingleValue<Option> | MultiValue<Option>) => {
        const newSettings = question?.settings ? { ...question?.settings } : {};
        if (!newSettings.choice) {
            newSettings.choice = {
                min: 0,
                max: 0,
            };
        }
        newSettings.choice.max = (option as SingleValue<Option>)?.value;
        newSettings.choice.min = (option as SingleValue<Option>)?.value;
        updateSettings(newSettings);
    };

    if (!question) {
        return null;
    }

    return (
        <>
            {question?.type === SurveyQuestionTypeEnum.Single ||
            question?.type === SurveyQuestionTypeEnum.Dropdown ||
            question?.type === SurveyQuestionTypeEnum.Multiple ? (
                <>
                    <div className="rounded bg-[#272138]">
                        <Switch
                            name="randomizeAnswers"
                            label="Randomize answers"
                            defaultValue={question?.settings?.randomize}
                            onChange={(e) => {
                                updateSettings({ randomize: e.target.value });
                            }}
                        />
                    </div>

                    <div className="rounded bg-[#272138]">
                        <Switch
                            name="randomizeAnswersExceptLast"
                            label="Randomize except last"
                            defaultValue={question?.settings.randomizeExceptLast}
                            onChange={(e) => {
                                updateSettings({ randomizeExceptLast: e.target.value });
                            }}
                        />
                    </div>
                </>
            ) : null}

            {question?.type === SurveyQuestionTypeEnum.Multiple && (
                <div className="flex gap-2">
                    <div className="flex-1">
                        <p className="text-sm">Selection limit Range</p>
                        <ReactSelect
                            options={limitRange}
                            defaultValue={
                                question?.settings.choice?.min === question?.settings.choice?.max
                                    ? limitRange[0]
                                    : limitRange[1]
                            }
                            onchange={(option) => {
                                setRangeOption((option as SingleValue<Option>)?.value);
                            }}
                        />
                    </div>

                    {rangeOption === LimitRange.RANGE ? (
                        <MinMaxSelector
                            options={rangeOptions(question!)}
                            maxValue={rangeOptions(question!).find((v) => {
                                return v.value === question?.settings.choice?.max;
                            })}
                            minValue={rangeOptions(question!).find((v) => {
                                return v.value === question?.settings.choice?.min;
                            })}
                            maxChange={(option) => handleMaxChange(option)}
                            minChange={(option) => handleMinChange(option)}
                        />
                    ) : null}

                    {rangeOption === LimitRange.EXACT ? (
                        <div className="flex-1">
                            <p className="text-sm">Exact</p>
                            <ReactSelect
                                onchange={(option) => handleExactRangeChange(option)}
                                defaultValue={rangeOptions(question!).find(
                                    (option) => option.value === question?.settings.choice?.max,
                                )}
                                options={rangeOptions(question!)}
                            />
                        </div>
                    ) : null}
                </div>
            )}
        </>
    );
};
