import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { LogicConditionEnum, QuestionLogic } from "@/types";
import {
    changeableOperator,
    conditionOptions,
    destinationOptions,
    getLogicOperator,
    logicValuesOptions,
} from "@/utils/question";
import { LogicOperator } from "@integraflow/web/src/types";
import React, { useEffect, useState } from "react";
import { MultiValue, SingleValue } from "react-select";
import MinMaxSelector from "../MinMaxSelector";
import { Option, ReactSelect } from "../ReactSelect";
type Props = {
    question: SurveyQuestion;
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
    const { parsedQuestions } = useSurvey();
    const { updateQuestionMutation, openQuestion } = useQuestion();
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

    const handleConditionChange = (
        value: SingleValue<Option> | MultiValue<Option>,
    ) => {
        setLogicValues({
            ...logicValues,
            condition: (value as SingleValue<Option>)?.value,
            values: [],
            operator: getLogicOperator((value as SingleValue<Option>)?.value),
            destination: "",
        });
    };

    const handleMinChange = (option: any) => {
        const newValues = [...(logicValues.values || [])];
        newValues[0] = option?.value;
        setLogicValues({ ...logicValues, values: newValues });
    };

    const handleMaxChange = (option: any) => {
        const newValues = [...(logicValues.values || [])];
        newValues[1] = option?.value;
        setLogicValues({ ...logicValues, values: newValues });
    };

    const handleValuesSelection = (
        values: SingleValue<Option> | MultiValue<Option>,
    ) => {
        setLogicValues({
            ...logicValues,
            values: (values as MultiValue<Option>).map((v) => v.value),
        });
    };

    const handleDestinationSelection = (value: any) => {
        updateQuestionMutation({
            settings: {
                ...openQuestion?.settings,
                logic: [
                    ...(openQuestion?.settings.logic || []),
                    {
                        ...logicValues,
                        destination: value?.value,
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
            operator:
                logicOperator === LogicOperator.AND
                    ? LogicOperator.OR
                    : LogicOperator.AND,
        };
        setLogicValues(newValues);
        setLogicOperator(newValues.operator);
    };

    console.log(logicValues);

    console.log(logicValues);
    return (
        <>
            {isCreatingLogic && (
                <div className="relative space-y-6 rounded-md border border-intg-bg-4 p-6">
                    <div className="flex justify-between">
                        <p>If answer</p>
                        <div className="w-[330px]">
                            <ReactSelect
                                options={conditionOptions(openQuestion?.type!)}
                                onchange={handleConditionChange}
                                defaultValue={conditionOptions(
                                    openQuestion?.type!,
                                )?.find(
                                    (option: Option) =>
                                        option.value ===
                                        (logicValues.condition as string),
                                )}
                                value={conditionOptions(
                                    openQuestion?.type!,
                                )?.find(
                                    (option: Option) =>
                                        option.value ===
                                        (logicValues.condition as string),
                                )}
                            />
                        </div>
                    </div>
                    {logicValues.condition === "between" && (
                        <div className="flex justify-between">
                            <div></div>
                            <div className="w-[330px]">
                                <MinMaxSelector
                                    options={openQuestion?.options?.map(
                                        (option: Option, index: number) => ({
                                            value: option.id,
                                            label: option.label,
                                            index: index,
                                        }),
                                    )}
                                    maxChange={handleMaxChange}
                                    minChange={handleMinChange}
                                />
                            </div>
                        </div>
                    )}

                    {logicValues.condition &&
                        ![
                            "not_answered",
                            "any_value",
                            "answered",
                            "is_false",
                            "between",
                            "is_true",
                        ].includes(logicValues.condition) && (
                            <div className="flex justify-between">
                                <div></div>
                                <div className="w-[330px]">
                                    <ReactSelect
                                        shouldLogicalOperatorChange={changeableOperator(
                                            openQuestion?.type!,
                                        )}
                                        enableUserOptions={
                                            enableUserOptions || false
                                        }
                                        logicOperator={logicOperator}
                                        onOperatorChange={() => {
                                            handleOperatorChange();
                                        }}
                                        comboBox={true}
                                        options={logicValuesOptions(
                                            openQuestion!,
                                        )}
                                        onchange={handleValuesSelection}
                                        value={
                                            enableUserOptions
                                                ? logicValues.values?.map(
                                                      (v) => {
                                                          return {
                                                              value: v,
                                                              label: v,
                                                          };
                                                      },
                                                  )
                                                : logicValues.values &&
                                                  logicValues.values.map(
                                                      (v) => ({
                                                          value: v,
                                                          label: openQuestion?.options?.find(
                                                              (o: Option) =>
                                                                  o.id === v,
                                                          )?.label,
                                                      }),
                                                  )
                                        }
                                    />
                                </div>
                            </div>
                        )}

                    {(logicValues.values && logicValues.values.length > 0) ||
                    [
                        "not_answered",
                        "any_value",
                        "answered",
                        "is_false",
                        "is_true",
                    ].includes(logicValues.condition ?? "") ? (
                        <div className="flex justify-between gap-14">
                            <p>then</p>
                            <div className="w-[330px]">
                                <ReactSelect
                                    options={destinationOptions(
                                        parsedQuestions,
                                        openQuestion!,
                                    )}
                                    onchange={handleDestinationSelection}
                                />
                            </div>
                        </div>
                    ) : null}

                    <div
                        className="absolute -right-2.5 bottom-[50%] translate-y-1/2 cursor-pointer"
                        onClick={handleCancel}
                    >
                        <MinusIcon />
                    </div>
                </div>
            )}
        </>
    );
};
