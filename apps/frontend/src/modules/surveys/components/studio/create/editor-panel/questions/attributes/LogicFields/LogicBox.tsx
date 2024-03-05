import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { LogicConditionEnum, ParsedQuestion, QuestionLogic } from "@/types";
import { generateUniqueId } from "@/utils";
import {
    changeableOperator,
    conditionOptions,
    destinationOptions,
    getLogicOperator,
    logicValuesOptions,
} from "@/utils/question";
import { LogicOperator } from "@integraflow/web/src/types";
import { useEffect, useState } from "react";
import { MultiValue, SingleValue } from "react-select";
import MinMaxSelector from "../MinMaxSelector";
import { Option, ReactSelect } from "../ReactSelect";

type Props = {
    logic: QuestionLogic;
    setIsCreatingLogic: React.Dispatch<React.SetStateAction<boolean>>;
    logicIndex: number;
    setLogicValues: React.Dispatch<React.SetStateAction<QuestionLogic>>;
};

export const LogicBox = ({ logicIndex, logic, setIsCreatingLogic, setLogicValues }: Props) => {
    const { parsedQuestions } = useSurvey();
    const { updateQuestion, question } = useQuestion();
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
            updateQuestion({
                settings: {
                    ...question?.settings,
                    logic: (question?.settings.logic as QuestionLogic[]).filter((l) => l.id !== logic.id),
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
            updateQuestion({
                settings: {
                    ...question?.settings,
                    logic: [
                        ...(question?.settings.logic as QuestionLogic[]).map((l: QuestionLogic, i: number) =>
                            i === logicIndex ? updatedLogic : l,
                        ),
                    ],
                },
            });
        }
    };

    const handleMinMaxChange = (minValue: SingleValue<Option>, maxValue: SingleValue<Option>) => {
        const newValues = {
            ...editValues,
            values: [minValue?.value, maxValue?.value],
        };

        setEditValues(newValues);
        handleLogicUpdate(newValues);
    };

    const handleValuesChange = (values: SingleValue<Option> | MultiValue<Option>) => {
        let newValues;
        newValues = {
            ...editValues,
            values: (values as MultiValue<Option>)?.map((v: SingleValue<Option>) => v?.value),
        };
        if ((values as MultiValue<Option>).length > 0) {
            newValues = {
                ...editValues,
                values: (values as MultiValue<Option>)?.map((v: SingleValue<Option>) => v?.value),
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

    const handleDestinationChange = (value: SingleValue<Option> | MultiValue<Option>) => {
        const newValues = {
            ...editValues,
            destination: (value as SingleValue<Option>)?.value,
        };
        setEditValues(newValues);
        handleLogicUpdate(newValues);
    };
    const handleConditionChange = (value: SingleValue<Option> | MultiValue<Option>) => {
        console.log("changing condition");
        const newValue = {
            ...editValues,
            condition: (value as SingleValue<Option>)?.value,
            operator: getLogicOperator((value as SingleValue<Option>)?.value),
            destination: "",
            values: [],
        };
        handleLogicUpdate(newValue);
        setIsCreatingLogic(true);
        setLogicValues(newValue);
    };

    const handleOperatorChange = () => {
        const newValues = {
            ...editValues,
            operator: logicOperator === LogicOperator.AND ? LogicOperator.OR : LogicOperator.AND,
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
                        options={conditionOptions((question as ParsedQuestion).type!)}
                        onchange={(value: SingleValue<Option> | MultiValue<Option>) => handleConditionChange(value)}
                        value={conditionOptions((question as ParsedQuestion).type!)?.find(
                            (c) => editValues.condition !== undefined && c.value === editValues.condition,
                        )}
                        defaultValue={conditionOptions(question?.type as SurveyQuestionTypeEnum)?.find(
                            (c) => c.value === editValues.condition,
                        )}
                    />
                </div>
            </div>

            {logic.condition === LogicConditionEnum.BETWEEN && (
                <div className="flex justify-between">
                    <div></div>
                    <div className="w-[330px]">
                        <MinMaxSelector
                            options={logicValuesOptions(question!)}
                            minDefault={logicValuesOptions(question!).find(
                                (o: Option) => o.value === editValues.values?.[0],
                            )}
                            maxDefault={logicValuesOptions(question!).find(
                                (o: Option) => o.value === editValues.values?.[1],
                            )}
                            minValue={logicValuesOptions(question!).find(
                                (o: Option) => o.value === editValues.values?.[0],
                            )}
                            maxValue={logicValuesOptions(question!).find(
                                (o: Option) => o.value === editValues.values?.[1],
                            )}
                            maxChange={(value) => {
                                handleMinMaxChange(
                                    {
                                        value: editValues.values?.[1] ?? value,
                                        label: question?.options?.find(
                                            (o: Option) => o.id === (value as SingleValue<Option>)?.value,
                                        )?.label,
                                    },
                                    value as SingleValue<Option>,
                                );
                            }}
                            minChange={(value) => {
                                handleMinMaxChange(value as SingleValue<Option>, {
                                    value: editValues.values?.[0] ?? value,
                                    label: question?.options?.find(
                                        (o: Option) => o.id === (value as SingleValue<Option>)?.value,
                                    )?.label,
                                });
                            }}
                        />
                    </div>
                </div>
            )}

            {![
                LogicConditionEnum.NOT_ANSWERED,
                LogicConditionEnum.HAS_ANY_VALUE,
                LogicConditionEnum.ANSWERED,
                LogicConditionEnum.IS_FALSE,
                LogicConditionEnum.IS_TRUE,
                LogicConditionEnum.BETWEEN,
            ].includes(editValues.condition as LogicConditionEnum) ? (
                <div className="flex justify-between">
                    <div />
                    <div className="w-[330px]">
                        <ReactSelect
                            comboBox={true}
                            enableUserOptions={enableUserOptions || false}
                            shouldLogicalOperatorChange={changeableOperator(question?.type as SurveyQuestionTypeEnum)}
                            logicOperator={logicOperator}
                            onOperatorChange={handleOperatorChange}
                            options={logicValuesOptions(question!)}
                            defaultValue={editValues.values
                                ?.map((v) => question?.options?.find((o: Option) => o.id === v))
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
                                          .map((v) => question?.options?.find((o: Option) => o.id === v))
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
                        defaultValue={destinationOptions(parsedQuestions, question!).find(
                            (q) => q.value === logic.destination,
                        )}
                        options={destinationOptions(parsedQuestions, question!)}
                        onchange={handleDestinationChange}
                    />
                </div>
            </div>

            <div
                className="absolute -right-2.5 bottom-[50%] translate-y-1/2 cursor-pointer"
                onClick={() =>
                    updateQuestion({
                        settings: {
                            ...question?.settings,
                            logic: (question?.settings.logic as QuestionLogic[]).filter((l) => l.id !== logic.id),
                        },
                    })
                }
            >
                <MinusIcon />
            </div>
        </div>
    );
};
