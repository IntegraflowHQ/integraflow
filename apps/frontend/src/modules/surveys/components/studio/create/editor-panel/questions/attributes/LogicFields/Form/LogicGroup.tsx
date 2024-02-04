import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { FormLogicGroup, QuestionLogic } from "@/types";
import { generateUniqueId } from "@/utils";
import { changeableOperator, getLogicConditions } from "@/utils/defaultOptions";
import { LogicOperator } from "@integraflow/web/src/types";
import { useState } from "react";
import { MultiValue, SingleValue } from "react-select";
import { LogicOperatorBtn } from "../../LogicOperator";
import { Option, ReactSelect } from "../../ReactSelect";

type Props = {
    groups: FormLogicGroup[];
    question: SurveyQuestion;
    setEditValues: React.Dispatch<React.SetStateAction<QuestionLogic>>;
    editValues: QuestionLogic;
    logicIndex: number;
};

export const LogicGroup = ({
    groups,
    question,
    setEditValues,
    editValues,
    logicIndex,
}: Props) => {
    const { updateLogic, updateQuestionMutation } = useQuestion();
    const [groupOperator, setGroupOperator] = useState<LogicOperator>(
        editValues.operator as LogicOperator,
    );
    const [fieldOperator, setFieldOperator] = useState<LogicOperator>(
        editValues.operator as LogicOperator,
    );
    const handleUpdateFields = (
        values: SingleValue<Option> | MultiValue<Option>,
        group: FormLogicGroup,
        index: number,
    ) => {
        let newValues;
        newValues = {
            ...editValues,
            groups: editValues.groups?.map((g) =>
                g.id === group.id
                    ? {
                          ...g,
                          fields: (values as MultiValue<Option>)?.map(
                              (v) => v.value,
                          ),
                      }
                    : g,
            ),
            destination: editValues.destination,
        };
        if (
            newValues.groups &&
            newValues.groups[index].fields.length > 0 &&
            newValues.groups?.[index]?.condition
        ) {
            updateLogic(newValues, question, logicIndex);
        }
        if (newValues.groups && newValues.groups[index].fields.length === 0) {
            const newGroup: FormLogicGroup = {
                fields: [],
                condition: "",
                operator: LogicOperator.AND,
                id: generateUniqueId(),
            };
            newValues = {
                ...editValues,
                groups: editValues.groups?.map((g) =>
                    g.id === group.id ? newGroup : g,
                ),
                destination: editValues.destination,
            };
            updateLogic(newValues, question, logicIndex);
        }
        setEditValues(newValues);
    };

    const handleRemoveGroup = (group: FormLogicGroup) => {
        if (editValues.groups?.length === 1) {
            updateQuestionMutation({
                settings: {
                    ...question.settings,
                    logic: question.settings.logic?.filter(
                        (l: QuestionLogic) => l.id !== editValues.id,
                    ),
                },
            });
        } else {
            const newValues = {
                ...editValues,
                groups: editValues.groups?.filter((g) => g.id !== group.id),
                destination: editValues.destination,
            };
            setEditValues(newValues);
            updateLogic(newValues, question, logicIndex);
        }
    };

    const handleUpdateCondition = (
        value: SingleValue<Option> | MultiValue<Option>,
        group: FormLogicGroup,
        index: number,
    ) => {
        const newValues = {
            ...editValues,
            groups: editValues.groups?.map((g) =>
                g.id === group.id
                    ? {
                          ...g,
                          condition: (value as SingleValue<Option>)?.value,
                      }
                    : g,
            ),
            destination: editValues.destination,
        };

        if (
            newValues.groups &&
            newValues.groups[index].fields.length > 0 &&
            newValues.groups[index].condition
        ) {
            updateLogic(newValues, question, logicIndex);
        }

        setEditValues(newValues);
    };

    const handleUpdateGroupOperator = () => {
        const newValue = {
            ...editValues,
            operator:
                groupOperator === LogicOperator.AND
                    ? LogicOperator.OR
                    : LogicOperator.AND,
        };
        console.log(newValue);
        setEditValues(newValue);
        setGroupOperator(newValue.operator as LogicOperator);
        updateLogic(newValue, question, logicIndex);
    };

    const handleUpdateFieldOperator = (group: FormLogicGroup) => {
        const newValue = {
            ...editValues,
            groups: editValues.groups?.map((g) =>
                g.id === group.id
                    ? {
                          ...g,
                          operator:
                              fieldOperator === LogicOperator.AND
                                  ? LogicOperator.OR
                                  : LogicOperator.AND,
                      }
                    : g,
            ),
            destination: editValues.destination,
        };
        console.log(newValue.operator);

        setEditValues(newValue);
        setFieldOperator(newValue.operator as LogicOperator);
        updateLogic(newValue, question, logicIndex);
    };

    return (
        <>
            {groups &&
                groups.map((group, index) => {
                    return (
                        <>
                            {index !== 0 && (
                                <div className="m-auto w-fit">
                                    <LogicOperatorBtn
                                        value={
                                            editValues.operator as LogicOperator
                                        }
                                        onclick={() => {
                                            handleUpdateGroupOperator();
                                        }}
                                    />
                                </div>
                            )}
                            <div
                                className="relative space-y-6 p-6"
                                key={group.id}
                            >
                                <div className="flex justify-between">
                                    <div>If</div>
                                    <div className="w-[330px]">
                                        <ReactSelect
                                            shouldLogicalOperatorChange={changeableOperator(
                                                question,
                                            )}
                                            onOperatorChange={() => {
                                                handleUpdateFieldOperator(
                                                    group,
                                                );
                                            }}
                                            logicOperator={fieldOperator}
                                            comboBox={true}
                                            options={[
                                                ...(question?.options?.map(
                                                    (
                                                        option: SingleValue<Option>,
                                                    ) => ({
                                                        value: option?.id,
                                                        label: option?.label,
                                                    }),
                                                ) ?? []),
                                            ]}
                                            defaultValue={
                                                group.fields.length > 0
                                                    ? group.fields.map(
                                                          (field) => ({
                                                              value: field,
                                                              label: question?.options?.find(
                                                                  (o: Option) =>
                                                                      o.id ===
                                                                      field,
                                                              )?.label,
                                                          }),
                                                      )
                                                    : []
                                            }
                                            value={editValues.groups
                                                ?.find((g) => g.id === group.id)
                                                ?.fields.map((field) => ({
                                                    value: field,
                                                    label: question?.options?.find(
                                                        (o: Option) =>
                                                            o.id === field,
                                                    )?.label,
                                                }))}
                                            onchange={(
                                                values:
                                                    | SingleValue<Option>
                                                    | MultiValue<Option>,
                                            ) => {
                                                handleUpdateFields(
                                                    values,
                                                    group,
                                                    index,
                                                );
                                            }}
                                        />
                                    </div>
                                </div>

                                {group.fields.length > 0 && (
                                    <div className="flex justify-between">
                                        <p></p>
                                        <div className="w-[330px]">
                                            <ReactSelect
                                                options={getLogicConditions(
                                                    question?.type as SurveyQuestionTypeEnum,
                                                )}
                                                defaultValue={getLogicConditions(
                                                    question?.type as SurveyQuestionTypeEnum,
                                                )?.find(
                                                    (c) =>
                                                        c.value ===
                                                        group.condition,
                                                )}
                                                value={
                                                    getLogicConditions(
                                                        question?.type as SurveyQuestionTypeEnum,
                                                    )?.find(
                                                        (c) =>
                                                            c.value ===
                                                            group.condition,
                                                    ) ?? null
                                                }
                                                onchange={(
                                                    value:
                                                        | SingleValue<Option>
                                                        | MultiValue<Option>,
                                                ) => {
                                                    handleUpdateCondition(
                                                        value,
                                                        group,
                                                        index,
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div
                                    className="absolute bottom-1/2 right-0 translate-x-1/2 cursor-pointer"
                                    onClick={() => {
                                        handleRemoveGroup(group);
                                    }}
                                >
                                    <MinusIcon />
                                </div>
                            </div>
                        </>
                    );
                })}
        </>
    );
};
