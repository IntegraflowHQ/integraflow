import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { Switch } from "@/ui";
import { useState } from "react";
import { TremorSelect } from "../Buttons/RadixSelect";

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

    const [rangeOption, setRangeOption] = useState(() => limitRange[0].value);

    return (
        <>
            <div className="rounded bg-[#272138] p-3">
                <Switch
                    label="Randomize answers"
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
                    label="Randomize except last"
                    onChange={(e) => {
                        const newSettings = question.settings;
                        newSettings.randomizeAnswersExceptLast = e.target.value;
                        updateQuestionMutation({
                            settings: newSettings,
                        });
                        console.log(question.settings);
                    }}
                />
            </div>

            <div className="flex gap-2">
                <div className="flex-1">
                    <p className="text-sm">Selection limit Range</p>
                    <TremorSelect
                        options={limitRange}
                        defaultValue={limitRange[0].value}
                        onValueChange={(e) => {
                            setRangeOption(e);
                        }}
                    />
                </div>
                {rangeOption === LimitRange.RANGE ? (
                    <>
                        <div className="flex-1">
                            <p className="text-sm">Min</p>
                            <TremorSelect
                                onValueChange={(e) => {
                                    const newSettings = question.settings;
                                    newSettings.min = e;
                                    updateQuestionMutation({
                                        settings: newSettings,
                                    });
                                }}
                                options={[
                                    ...Array(question.options.length).keys(),
                                ].map((i) => {
                                    return { label: i + 1, value: i + 1 };
                                })}
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm">Max</p>
                            <TremorSelect
                                onValueChange={(e) => {
                                    const newSettings = question.settings;
                                    newSettings.max = e;
                                    updateQuestionMutation({
                                        settings: newSettings,
                                    });
                                }}
                                options={[
                                    ...Array(question.options.length).keys(),
                                ].map((i) => {
                                    return { label: i + 1, value: i + 1 };
                                })}
                            />
                        </div>
                    </>
                ) : null}
                {rangeOption === LimitRange.EXACT ? (
                    <div className="flex-1">
                        <p className="text-sm">Exact</p>
                        <TremorSelect
                            onValueChange={(e) => {
                                const newSettings = question.settings;
                                newSettings.exactly = e;
                                updateQuestionMutation({
                                    settings: newSettings,
                                });
                            }}
                            options={[
                                ...Array(question.options.length).keys(),
                            ].map((i) => {
                                return { label: i + 1, value: i + 1 };
                            })}
                        />
                    </div>
                ) : null}
            </div>
        </>
    );
};
