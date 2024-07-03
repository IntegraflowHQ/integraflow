import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { SurveyStatusEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { LogicConditionEnum, LogicOperator, ParsedQuestion, QuestionLogic } from "@/types";
import {
    changeableOperator,
    conditionOptions,
    destinationOptions,
    getLogicOperator,
    logicValuesOptions,
} from "@/utils/question";
import React, { useEffect, useState } from "react";
import { MultiValue, SingleValue } from "react-select";
import MinMaxSelector from "../MinMaxSelector";
import { Option, ReactSelect } from "../ReactSelect";

type Props = {
    logicValues: QuestionLogic;
    isCreatingLogic: boolean;
    setLogicValues: React.Dispatch<React.SetStateAction<QuestionLogic>>;
    setIsCreatingLogic: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DefaultLogicBox: React.FC<Props> = ({
    logicValues,
    isCreatingLogic,
    setLogicValues,
    setIsCreatingLogic,
}: Props) => {
    const { parsedQuestions, survey } = useSurvey();
    const { updateQuestion, question } = useQuestion();
    const [enableUserOptions, setEnableUserOptions] = useState(false);
    const [logicOperator, setLogicOperator] = useState(logicValues.operator);

    useEffect(() => {
        if (
            logicValues.condition === LogicConditionEnum.ANSWER_CONTAINS ||
            logicValues.condition === LogicConditionEnum.ANSWER_DOES_NOT_CONTAIN
        ) {
            setEnableUserOptions(true);
        } else {
            setEnableUserOptions(false);
        }
    }, [logicValues]);

    const handleConditionChange = (value: SingleValue<Option> | MultiValue<Option>) => {
        setLogicValues({
            ...logicValues,
            condition: (value as SingleValue<Option>)?.value,
            values: [],
            operator: getLogicOperator((value as SingleValue<Option>)?.value),
            destination: "",
        });
    };

    const handleMinChange = (option: SingleValue<Option> | MultiValue<Option>) => {
        const newValues = [...(logicValues.values || [])];
        newValues[0] = (option as SingleValue<Option>)?.value;
        setLogicValues({ ...logicValues, values: newValues });
    };

    const handleMaxChange = (option: SingleValue<Option> | MultiValue<Option>) => {
        const newValues = [...(logicValues.values || [])];
        newValues[1] = (option as SingleValue<Option>)?.value;
        setLogicValues({ ...logicValues, values: newValues });
    };

    const handleValuesSelection = (values: SingleValue<Option> | MultiValue<Option>) => {
        setLogicValues({
            ...logicValues,
            values: (values as MultiValue<Option>).map((v) => v.value),
        });
    };

    const handleDestinationSelection = (option: SingleValue<Option> | MultiValue<Option>) => {
        updateQuestion({
            settings: {
                ...question?.settings,
                logic: [
                    ...(question?.settings.logic || []),
                    {
                        ...logicValues,
                        destination: (option as SingleValue<Option>)?.value,
                    },
                ],
            },
        });

        setIsCreatingLogic(false);
        setLogicValues({
            ...logicValues,
        });
    };

    const handleCancel = () => {
        setIsCreatingLogic(false);
        setLogicValues({
            id: "",
            condition: undefined,
            values: undefined,
            operator: undefined,
            destination: "",
            orderNumber: undefined,
        });
    };

    const handleOperatorChange = () => {
        const newValues = {
            ...logicValues,
            operator: logicOperator === LogicOperator.AND ? LogicOperator.OR : LogicOperator.AND,
        };
        setLogicValues(newValues);
        setLogicOperator(newValues.operator);
    };

    if (!isCreatingLogic) {
        return null;
    }

    return (
        <div className="relative space-y-6 rounded-md border border-intg-bg-4 p-6">
            <div className="flex justify-between">
                <p>If answer</p>
                <div className="w-[330px]">
                    <ReactSelect
                        options={conditionOptions((question as ParsedQuestion).type)}
                        onchange={handleConditionChange}
                        defaultValue={conditionOptions((question as ParsedQuestion).type!)?.find(
                            (option: Option) => option.value === (logicValues.condition as string),
                        )}
                        value={conditionOptions((question as ParsedQuestion).type!)?.find(
                            (option: Option) => option.value === (logicValues.condition as string),
                        )}
                    />
                </div>
            </div>

            {logicValues.condition === "between" && (
                <div className="flex justify-between">
                    <div></div>
                    <div className="w-[330px]">
                        <MinMaxSelector
                            options={
                                question?.options?.map((option, index) => ({
                                    value: option.id,
                                    label: option.label,
                                    index: index,
                                })) || []
                            }
                            maxChange={handleMaxChange}
                            minChange={handleMinChange}
                        />
                    </div>
                </div>
            )}

            {logicValues.condition &&
                ![
                    LogicConditionEnum.NOT_ANSWERED,
                    LogicConditionEnum.HAS_ANY_VALUE,
                    LogicConditionEnum.ANSWERED,
                    LogicConditionEnum.IS_FALSE,
                    LogicConditionEnum.IS_TRUE,
                    LogicConditionEnum.BETWEEN,
                ].includes(logicValues.condition) && (
                    <div className="flex justify-between">
                        <div></div>
                        <div className="w-[330px]">
                            <ReactSelect
                                shouldLogicalOperatorChange={changeableOperator((question as ParsedQuestion).type!)}
                                enableUserOptions={enableUserOptions || false}
                                logicOperator={logicOperator}
                                onOperatorChange={() => {
                                    handleOperatorChange();
                                }}
                                comboBox={true}
                                options={logicValuesOptions(question!)}
                                onchange={handleValuesSelection}
                                value={
                                    enableUserOptions
                                        ? logicValues.values?.map((v) => {
                                              return {
                                                  value: v,
                                                  label: v,
                                              };
                                          })
                                        : logicValues.values &&
                                          logicValues.values.map((v) => ({
                                              value: v,
                                              label: question?.options?.find((o) => o.id === v)?.label,
                                          }))
                                }
                            />
                        </div>
                    </div>
                )}

            {(logicValues.values && logicValues.values.length > 0) ||
            ["not_answered", "any_value", "answered", "is_false", "is_true"].includes(logicValues.condition ?? "") ? (
                <div className="flex justify-between gap-14">
                    <p>then</p>
                    <div className="w-[330px]">
                        <ReactSelect
                            options={destinationOptions(parsedQuestions, question!)}
                            onchange={handleDestinationSelection}
                        />
                    </div>
                </div>
            ) : null}

            {survey?.status !== SurveyStatusEnum.Active ? (
                <div className="absolute -right-2.5 bottom-[50%] translate-y-1/2 cursor-pointer" onClick={handleCancel}>
                    <MinusIcon />
                </div>
            ) : null}
        </div>
    );
};
