import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { QuestionLogic } from "@/types";
import { getLogicConditions, getLogicOperator } from "@/utils/defaultOptions";
import { MultiValue, SingleValue } from "react-select";
import MinMaxSelector from "../MinMaxSelector";
import { Option, ReactSelect } from "../ReactSelect";

type Props = {
    question: SurveyQuestion;
    logic: QuestionLogic;
    setIsCreatingLogic: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LogicBox = ({ question, setIsCreatingLogic, logic }: Props) => {
    const { parsedQuestions } = useSurvey();
    const { updateQuestionMutation } = useQuestion();

    const handleLogicUpdate = (updatedLogic: QuestionLogic) => {
        updateQuestionMutation({
            settings: {
                ...question.settings,
                logic: [
                    ...(question.settings.logic as QuestionLogic[]).filter(
                        (l) => l.id !== logic.id,
                    ),
                    updatedLogic,
                ],
            },
        });
        setIsCreatingLogic(false);
    };

    const handleMinMaxChange = (minValue: any, maxValue: any) => {
        handleLogicUpdate({
            ...logic,
            values: [minValue.value, maxValue.value],
        });
    };

    const handleValuesChange = (values: any) => {
        handleLogicUpdate({
            ...logic,
            values: values?.map((v: any) => v.value),
        });
    };

    const handleDestinationChange = (value: any) => {
        handleLogicUpdate({
            ...logic,
            destination: value?.value,
        });
    };

    return (
        <div className="relative space-y-6 rounded-md border border-intg-bg-4 p-6">
            <div className="flex justify-between">
                <p>If answer</p>
                <div className="w-[330px]">
                    <ReactSelect
                        options={getLogicConditions(question.type)}
                        onchange={(
                            value: SingleValue<Option> | MultiValue<Option>,
                        ) =>
                            handleLogicUpdate({
                                ...logic,
                                condition: (value as SingleValue<Option>)
                                    ?.value,
                                operator: getLogicOperator(
                                    (value as SingleValue<Option>)?.value,
                                ),
                            })
                        }
                        defaultValue={getLogicConditions(question.type)?.find(
                            (c) => c.value === logic.condition,
                        )}
                    />
                </div>
            </div>

            {logic.condition === "between" && (
                <div className="flex justify-between">
                    <div></div>
                    <div className="w-[330px]">
                        <MinMaxSelector
                            options={question.options.map(
                                (option: SingleValue<Option>) => ({
                                    value: option?.id,
                                    label: option?.label,
                                }),
                            )}
                            minDefault={question.options
                                .map((option: SingleValue<Option>) => {
                                    return {
                                        value: option?.id,
                                        label: option?.label,
                                    };
                                })
                                .find(
                                    (o: Option) =>
                                        o.value === logic.values?.[0],
                                )}
                            maxDefault={question.options
                                .map((option: SingleValue<Option>) => {
                                    return {
                                        value: option?.id,
                                        label: option?.label,
                                    };
                                })
                                .find(
                                    (o: Option) =>
                                        o.value === logic.values?.[1],
                                )}
                            minValue={question.options
                                .map((option: SingleValue<Option>) => {
                                    return {
                                        value: option?.id,
                                        label: option?.label,
                                    };
                                })
                                .find(
                                    (o: Option) =>
                                        o.value === logic.values?.[0],
                                )}
                            maxValue={question.options
                                .map((option: SingleValue<Option>) => {
                                    return {
                                        value: option?.id,
                                        label: option?.label,
                                    };
                                })
                                .find(
                                    (o: Option) =>
                                        o.value === logic.values?.[1],
                                )}
                            maxChange={(value) =>
                                handleMinMaxChange(
                                    logic.values?.[0] ?? value,
                                    value,
                                )
                            }
                            minChange={(value) =>
                                handleMinMaxChange(
                                    value,
                                    logic.values?.[1] ?? value,
                                )
                            }
                        />
                    </div>
                </div>
            )}

            {logic.values &&
            logic.values.length > 0 &&
            logic.condition !== "between" ? (
                <div className="flex justify-between">
                    <div></div>
                    <div className="w-[330px]">
                        <ReactSelect
                            comboBox={true}
                            options={question.options?.map(
                                (option: SingleValue<Option>) => ({
                                    value: option?.id,
                                    label: option?.label,
                                }),
                            )}
                            defaultValue={logic.values
                                ?.map(
                                    (v) =>
                                        question.options?.find(
                                            (o: Option) => o.id === v,
                                        ),
                                )
                                .map((v) => ({
                                    value: v?.id,
                                    label: v?.label,
                                }))}
                            onchange={handleValuesChange}
                        />
                    </div>
                </div>
            ) : null}

            <div className="flex justify-between gap-14">
                <p>then</p>
                <div className="w-[330px]">
                    <ReactSelect
                        defaultValue={
                            parsedQuestions.find(
                                (q) => q.id === logic.destination,
                            )
                                ? {
                                      value: logic.destination,
                                      label:
                                          parsedQuestions.find(
                                              (q) => q.id === logic.destination,
                                          )?.label || "Empty Question",
                                  }
                                : {
                                      value: "-1",
                                      label: "End survey",
                                  }
                        }
                        options={[
                            ...parsedQuestions
                                .slice(
                                    parsedQuestions.findIndex(
                                        (q) => q.id === question.id,
                                    ) + 1,
                                )
                                .map((q) => ({
                                    value: q.id,
                                    label: q.label
                                        ? `${q.orderNumber}- ${q.label} `
                                        : `${q.orderNumber}- Empty Question`,
                                })),
                            {
                                value: "-1",
                                label: "End survey",
                            },
                        ]}
                        onchange={handleDestinationChange}
                    />
                </div>
            </div>

            <div
                className="absolute -right-2.5 bottom-[50%] translate-y-1/2 cursor-pointer"
                onClick={() =>
                    updateQuestionMutation({
                        settings: {
                            ...question.settings,
                            logic: (
                                question.settings.logic as QuestionLogic[]
                            ).filter((l) => l.id !== logic.id),
                        },
                    })
                }
            >
                <MinusIcon />
            </div>
        </div>
    );
};
