import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { LogicConditionEnum, QuestionLogic } from "@/types";
import { generateUniqueId } from "@/utils";
import {
    changeableOperator,
    getLogicConditions,
    getLogicOperator,
} from "@/utils/defaultOptions";
import { LogicOperator } from "@integraflow/web/src/types";
import { useEffect, useState } from "react";
import { MultiValue, SingleValue } from "react-select";
import MinMaxSelector from "../MinMaxSelector";
import { Option, ReactSelect } from "../ReactSelect";

type Props = {
    logic: QuestionLogic;
    setIsCreatingLogic: React.Dispatch<React.SetStateAction<boolean>>;
    question: SurveyQuestion;
    logicIndex: number;
    setLogicValues: React.Dispatch<React.SetStateAction<QuestionLogic>>;
};

export const LogicBox = ({
    logicIndex,
    logic,
    setIsCreatingLogic,
    question,
}: Props) => {
    const { parsedQuestions } = useSurvey();
    const { updateQuestionMutation } = useQuestion();
    const [enableUserOptions, setEnableUserOptions] = useState(false);
    const [editValues, setEditValues] = useState(logic);
    const [logicOperator, setLogicOperator] = useState(editValues.operator);

    useEffect(() => {
        if (
            editValues.condition === LogicConditionEnum.ANSWER_CONTAINS ||
            editValues.condition === LogicConditionEnum.ANSWER_DOES_NOT_CONTAIN
        ) {
            setEnableUserOptions(true);
        } else {
            setEnableUserOptions(false);
        }
    }, [editValues]);

    const handleLogicUpdate = (updatedLogic: QuestionLogic) => {
        if (!updatedLogic.destination) {
            console.log("here 1", updatedLogic);
            updateQuestionMutation({
                settings: {
                    ...question?.settings,
                    logic: (question?.settings.logic as QuestionLogic[]).filter(
                        (l) => l.id !== logic.id,
                    ),
                },
            });
            setIsCreatingLogic(true);
            setEditValues({
                ...editValues,
                condition: updatedLogic.condition,
                destination: "",
                values: [],
                id: generateUniqueId(),
                operator: updatedLogic.operator,
                orderNumber: updatedLogic.orderNumber,
            });
            return;
        } else {
            console.log("here 2");
            updateQuestionMutation({
                settings: {
                    ...question?.settings,
                    logic: [
                        ...(question?.settings.logic as QuestionLogic[]).map(
                            (l: QuestionLogic, i: number) =>
                                i === logicIndex ? updatedLogic : l,
                        ),
                    ],
                },
            });
        }
    };

    const handleMinMaxChange = (minValue: any, maxValue: any) => {
        console.log("minValue:", minValue);
        console.log("maxValue:", maxValue);
        const newValues = {
            ...editValues,
            values: [minValue.value, maxValue.value],
        };

        setEditValues(newValues);
        handleLogicUpdate(newValues);
    };

    const handleValuesChange = (
        values: SingleValue<Option> | MultiValue<Option>,
    ) => {
        let newValues;
        newValues = {
            ...editValues,
            values: (values as MultiValue<Option>)?.map((v: any) => v.value),
        };
        if ((values as MultiValue<Option>).length > 0) {
            console.log("first");
            newValues = {
                ...editValues,
                values: (values as MultiValue<Option>)?.map(
                    (v: any) => v.value,
                ),
            };
        } else {
            newValues = {
                ...editValues,
                condition: undefined,
                destination: undefined,
                values: [],
                operator: undefined,
            };
        }
        setEditValues(newValues);
        handleLogicUpdate(newValues);
    };

    const handleDestinationChange = (value: any) => {
        const newValues = {
            ...editValues,
            destination: value?.value,
        };
        setEditValues(newValues);
        handleLogicUpdate(newValues);
    };
    const handleConditionChange = (value: any) => {
        let newValue;
        console.log("first");
        console.log(value?.value);

        newValue = {
            ...editValues,
            condition: value?.value,
            operator: getLogicOperator(value?.value),
            destination: "",
            values: [],
        };
        handleLogicUpdate(newValue);
        setEditValues(newValue);
    };

    const handleOperatorChange = () => {
        const newValues = {
            ...editValues,
            operator:
                logicOperator === LogicOperator.AND
                    ? LogicOperator.OR
                    : LogicOperator.AND,
        };
        setEditValues(newValues);
        setLogicOperator(newValues.operator);

        handleLogicUpdate(newValues);
    };

    return (
        <div className="relative space-y-6 rounded-md border border-intg-bg-4 p-6">
            <div className="flex justify-between">
                <p>If answer</p>
                <div className="w-[330px]">
                    <ReactSelect
                        options={getLogicConditions(question?.type!)}
                        onchange={(
                            value: SingleValue<Option> | MultiValue<Option>,
                        ) => handleConditionChange(value)}
                        value={getLogicConditions(question?.type!)?.find(
                            (c) =>
                                editValues.condition !== undefined &&
                                c.value === editValues.condition,
                        )}
                        defaultValue={getLogicConditions(question?.type)?.find(
                            (c) => c.value === editValues.condition,
                        )}
                    />
                </div>
            </div>

            {logic.condition === "between" && (
                <div className="flex justify-between">
                    <div></div>
                    <div className="w-[330px]">
                        <MinMaxSelector
                            options={question?.options.map(
                                (option: SingleValue<Option>) => ({
                                    value: option?.id,
                                    label: option?.label,
                                }),
                            )}
                            minDefault={question?.options
                                .map((option: SingleValue<Option>) => {
                                    return {
                                        value: option?.id,
                                        label: option?.label,
                                    };
                                })
                                .find(
                                    (o: Option) =>
                                        o.value === editValues.values?.[0],
                                )}
                            maxDefault={question?.options
                                .map((option: SingleValue<Option>) => {
                                    return {
                                        value: option?.id,
                                        label: option?.label,
                                    };
                                })
                                .find(
                                    (o: Option) =>
                                        o.value === editValues.values?.[1],
                                )}
                            minValue={question?.options
                                .map((option: SingleValue<Option>) => {
                                    return {
                                        value: option?.id,
                                        label: option?.label,
                                    };
                                })
                                .find(
                                    (o: Option) =>
                                        o.value === editValues.values?.[0],
                                )}
                            maxValue={question?.options
                                .map((option: SingleValue<Option>) => {
                                    return {
                                        value: option?.id,
                                        label: option?.label,
                                    };
                                })
                                .find(
                                    (o: Option) =>
                                        o.value === editValues.values?.[1],
                                )}
                            maxChange={(value) => {
                                console.log("minValue:", value);
                                handleMinMaxChange(
                                    {
                                        value: editValues.values?.[0] ?? value,
                                        label: question?.options?.find(
                                            (o: Option) =>
                                                o.id ===
                                                (value as SingleValue<Option>)
                                                    ?.value,
                                        )?.label,
                                    },
                                    value,
                                );
                            }}
                            minChange={(value) => {
                                console.log("maxValue:", value);
                                handleMinMaxChange(value, {
                                    value: editValues.values?.[0] ?? value,
                                    label: question?.options?.find(
                                        (o: Option) =>
                                            o.id ===
                                            (value as SingleValue<Option>)
                                                ?.value,
                                    )?.label,
                                });
                            }}
                        />
                    </div>
                </div>
            )}

            {editValues.condition !== "between" &&
            editValues.condition !== LogicConditionEnum.HAS_ANY_VALUE &&
            editValues.condition !== LogicConditionEnum.QUESTION_IS_ANSWERED &&
            editValues.condition !==
                LogicConditionEnum.QUESTION_IS_NOT_ANSWERED ? (
                <div className="flex justify-between">
                    <div></div>
                    <div className="w-[330px]">
                        <ReactSelect
                            comboBox={true}
                            enableUserOptions={enableUserOptions || false}
                            shouldLogicalOperatorChange={changeableOperator(
                                question,
                            )}
                            logicOperator={logicOperator}
                            onOperatorChange={() => {
                                handleOperatorChange();
                            }}
                            options={question?.options?.map(
                                (option: SingleValue<Option>) => ({
                                    value: option?.id,
                                    label: option?.label,
                                }),
                            )}
                            defaultValue={editValues.values
                                ?.map(
                                    (v) =>
                                        question?.options?.find(
                                            (o: Option) => o.id === v,
                                        ),
                                )
                                .map((v) => ({
                                    value: v?.id,
                                    label: v?.label,
                                }))}
                            value={
                                enableUserOptions
                                    ? editValues.values?.map((v) => ({
                                          value: v,
                                          label: v,
                                      }))
                                    : editValues.values &&
                                      editValues?.values
                                          .map(
                                              (v) =>
                                                  question?.options?.find(
                                                      (o: Option) => o.id === v,
                                                  ),
                                          )
                                          .map((v) => ({
                                              value: v?.id,
                                              label: v?.label,
                                          }))
                            }
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
                                        (q) => q.id === question?.id,
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
                            ...question?.settings,
                            logic: (
                                question?.settings.logic as QuestionLogic[]
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
