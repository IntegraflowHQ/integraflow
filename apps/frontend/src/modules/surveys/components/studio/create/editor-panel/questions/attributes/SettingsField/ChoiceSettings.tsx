import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { QuestionSettings } from "@/types";
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
    const { updateQuestionMutation, openQuestion } = useQuestion();
    const [rangeOption, setRangeOption] = useState(limitRange[0].value);

    const updateSettings = (newSettings: QuestionSettings) => {
        updateQuestionMutation({
            settings: { ...openQuestion?.settings, ...newSettings },
        });
    };

    const handleMaxChange = (
        option: SingleValue<Option> | MultiValue<Option>,
    ) => {
        const newSettings = openQuestion?.settings ?? {};
        if (!newSettings?.choice) {
            newSettings.choice = {
                min: 0,
                max: 0,
            };
        }
        newSettings.choice.max = (option as SingleValue<Option>)?.value;
        updateSettings(newSettings);
    };
    const handleMinChange = (
        option: SingleValue<Option> | MultiValue<Option>,
    ) => {
        const newSettings = openQuestion?.settings ?? {};
        if (!newSettings?.choice) {
            newSettings.choice = {
                min: 0,
                max: 0,
            };
        }
        newSettings.choice.min = (option as SingleValue<Option>)?.value;
        updateSettings(newSettings);
    };
    const handleExactRangeChange = (
        option: SingleValue<Option> | MultiValue<Option>,
    ) => {
        const newSettings = openQuestion?.settings ?? {};
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

    return (
        <>
            {openQuestion?.type === SurveyQuestionTypeEnum.Single ||
            openQuestion?.type === SurveyQuestionTypeEnum.Dropdown ||
            openQuestion?.type === SurveyQuestionTypeEnum.Multiple ? (
                <>
                    <div className="rounded bg-[#272138] p-3">
                        <Switch
                            name="randomizeAnswers"
                            label="Randomize answers"
                            defaultValue={openQuestion?.settings?.randomize}
                            onChange={(e) => {
                                const newSettings = openQuestion?.settings;
                                newSettings.randomize = e.target.value;
                                updateQuestionMutation({
                                    settings: newSettings,
                                });
                            }}
                        />
                    </div>
                    <div className="rounded bg-[#272138] p-3">
                        <Switch
                            name="randomizeAnswersExceptLast"
                            label="Randomize except last"
                            defaultValue={
                                openQuestion?.settings.randomizeExceptLast
                            }
                            onChange={(e) => {
                                const newSettings = openQuestion?.settings;
                                newSettings.randomize = e.target.value;
                                updateQuestionMutation({
                                    settings: newSettings,
                                });
                            }}
                        />
                    </div>
                </>
            ) : null}

            {openQuestion?.type === SurveyQuestionTypeEnum.Multiple && (
                <div className="flex gap-2">
                    <div className="flex-1">
                        <p className="text-sm">Selection limit Range</p>
                        <ReactSelect
                            options={limitRange}
                            defaultValue={limitRange[0]}
                            onchange={(option) => {
                                setRangeOption(
                                    (option as SingleValue<Option>)?.value,
                                );
                            }}
                        />
                    </div>
                    {rangeOption === LimitRange.RANGE ? (
                        <MinMaxSelector
                            options={rangeOptions(openQuestion!)}
                            maxValue={rangeOptions(openQuestion!).find((v) => {
                                return (
                                    v.value ===
                                    openQuestion?.settings.choice?.max
                                );
                            })}
                            minValue={rangeOptions(openQuestion!).find((v) => {
                                return (
                                    v.value ===
                                    openQuestion?.settings.choice?.min
                                );
                            })}
                            maxChange={(option) => handleMaxChange(option)}
                            minChange={(option) => handleMinChange(option)}
                        />
                    ) : null}
                    {rangeOption === LimitRange.EXACT ? (
                        <div className="flex-1">
                            <p className="text-sm">Exact</p>
                            <ReactSelect
                                onchange={(option) =>
                                    handleExactRangeChange(option)
                                }
                                defaultValue={rangeOptions(openQuestion!).find(
                                    (option) =>
                                        option.value ===
                                        openQuestion?.settings.choice?.max,
                                )}
                                options={rangeOptions(openQuestion!)}
                            />
                        </div>
                    ) : null}
                </div>
            )}
        </>
    );
};
