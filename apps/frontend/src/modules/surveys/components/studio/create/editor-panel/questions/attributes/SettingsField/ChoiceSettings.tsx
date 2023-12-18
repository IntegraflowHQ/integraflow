import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { Switch } from "@/ui";
import { useState } from "react";
import { ReactSelect } from "../ReactSelect";

type Props = {
    question: SurveyQuestion;
};

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

export const ChoiceSettings = ({ question }: Props) => {
    const { updateQuestionMutation } = useQuestion();

    const [rangeOption, setRangeOption] = useState(limitRange[0].value);

    console.log(question.settings.choice);

    return (
        <>
            {question.type === SurveyQuestionTypeEnum.Single ||
            question.type === SurveyQuestionTypeEnum.Dropdown ||
            question.type === SurveyQuestionTypeEnum.Multiple ? (
                <>
                    <div className="rounded bg-[#272138] p-3">
                        <Switch
                            name="randomizeAnswers"
                            label="Randomize answers"
                            defaultValue={question.settings.randomizeAnswers}
                            onChange={(e) => {
                                const newSettings = question.settings;
                                newSettings.randomizeAnswers = e.target.value;
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
                                question.settings.randomizeAnswersExceptLast
                            }
                            onChange={(e) => {
                                const newSettings = question.settings;
                                newSettings.randomizeAnswersExceptLast =
                                    e.target.value;
                                updateQuestionMutation({
                                    settings: newSettings,
                                });
                            }}
                        />
                    </div>
                </>
            ) : null}

            {question.type === SurveyQuestionTypeEnum.Multiple && (
                <div className="flex gap-2">
                    <div className="flex-1">
                        <p className="text-sm">Selection limit Range</p>
                        <ReactSelect
                            options={limitRange}
                            defaultValue={limitRange[0]}
                            onchange={(option) => {
                                setRangeOption(option?.value as string);
                            }}
                        />
                    </div>
                    {rangeOption === LimitRange.RANGE ? (
                        <>
                            <div className="flex-1">
                                <p className="text-sm">Min</p>
                                <ReactSelect
                                    onchange={(option) => {
                                        const newSettings = question.settings;
                                        newSettings.choice.min = option?.value;
                                        if (
                                            newSettings.choice.max <
                                            newSettings.choice.min
                                        ) {
                                            newSettings.choice.max =
                                                newSettings.choice.min;
                                        }
                                        updateQuestionMutation({
                                            settings: newSettings,
                                        });
                                    }}
                                    defaultValue={[
                                        ...Array(
                                            question.options.length,
                                        ).keys(),
                                    ]
                                        .map((i) => {
                                            return {
                                                label: i + 1,
                                                value: i + 1,
                                            };
                                        })
                                        .find(
                                            (option) =>
                                                option.value ===
                                                question.settings.choice.min,
                                        )}
                                    options={[
                                        ...Array(
                                            question.options.length,
                                        ).keys(),
                                    ]
                                        .map((i) => {
                                            return {
                                                label: i + 1,
                                                value: i + 1,
                                            };
                                        })
                                        .filter(
                                            (option) =>
                                                option.value !==
                                                question.settings.choice.max,
                                        )}
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm">Max</p>
                                <ReactSelect
                                    onchange={(option) => {
                                        const newSettings = question.settings;
                                        newSettings.choice.max = option?.value;
                                        if (
                                            newSettings.choice.max <
                                            newSettings.choice.min
                                        ) {
                                            newSettings.choice.min =
                                                newSettings.choice.max;
                                        }
                                        updateQuestionMutation({
                                            settings: newSettings,
                                        });
                                    }}
                                    options={[
                                        ...Array(
                                            question.options.length,
                                        ).keys(),
                                    ]
                                        .map((i) => {
                                            return {
                                                label: i + 1,
                                                value: i + 1,
                                            };
                                        })
                                        .filter(
                                            (option) =>
                                                option.value !==
                                                question.settings.choice.max,
                                        )}
                                    defaultValue={[
                                        ...Array(
                                            question.options.length,
                                        ).keys(),
                                    ]
                                        .map((i) => {
                                            return {
                                                label: i + 1,
                                                value: i + 1,
                                            };
                                        })
                                        .find(
                                            (option) =>
                                                option.value ===
                                                question.settings.choice.max,
                                        )}
                                />
                            </div>
                        </>
                    ) : null}
                    {rangeOption === LimitRange.EXACT ? (
                        <div className="flex-1">
                            <p className="text-sm">Exact</p>
                            <ReactSelect
                                onchange={(option) => {
                                    const newSettings = question.settings;
                                    newSettings.choice.max = option?.value;
                                    newSettings.choice.min = option?.value;
                                    updateQuestionMutation({
                                        settings: newSettings,
                                    });
                                }}
                                defaultValue={[
                                    ...Array(question.options.length).keys(),
                                ]
                                    .map((i) => {
                                        return {
                                            label: i + 1,
                                            value: i + 1,
                                        };
                                    })
                                    .find(
                                        (option) =>
                                            option.value ===
                                            question.settings.choice.max,
                                    )}
                                options={[
                                    ...Array(question.options.length).keys(),
                                ].map((i) => {
                                    return { label: i + 1, value: i + 1 };
                                })}
                            />
                        </div>
                    ) : null}
                </div>
            )}
        </>
    );
};
