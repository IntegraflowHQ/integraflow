import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { FormLogicGroup, QuestionLogic } from "@/types";
import { generateUniqueId } from "@/utils";
import {
    changeableOperator,
    conditionOptions,
    logicValuesOptions,
} from "@/utils/question";
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
    setEditValues,
    editValues,
    logicIndex,
}: Props) => {
    const { openQuestion } = useQuestion();
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
            updateLogic(newValues, openQuestion!, logicIndex);
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
            updateLogic(newValues, openQuestion!, logicIndex);
        }
        setEditValues(newValues);
    };

    const handleRemoveGroup = (group: FormLogicGroup) => {
        if (editValues.groups?.length === 1) {
            updateQuestionMutation({
                settings: {
                    ...openQuestion?.settings,
                    logic: openQuestion?.settings.logic?.filter(
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
            updateLogic(newValues, openQuestion!, logicIndex);
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
            updateLogic(newValues, openQuestion!, logicIndex);
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
        setEditValues(newValue);
        setGroupOperator(newValue.operator as LogicOperator);
        updateLogic(newValue, openQuestion!, logicIndex);
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
        setEditValues(newValue);
        setFieldOperator(newValue.operator as LogicOperator);
        updateLogic(newValue, openQuestion!, logicIndex);
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
                                                openQuestion?.type as SurveyQuestionTypeEnum,
                                            )}
                                            onOperatorChange={() => {
                                                handleUpdateFieldOperator(
                                                    group,
                                                );
                                            }}
                                            logicOperator={fieldOperator}
                                            comboBox={true}
                                            options={logicValuesOptions(
                                                openQuestion!,
                                            )}
                                            defaultValue={
                                                group.fields.length > 0
                                                    ? group.fields.map(
                                                          (field) => ({
                                                              value: field,
                                                              label: openQuestion?.options?.find(
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
                                                    label: openQuestion?.options?.find(
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
                                                options={conditionOptions(
                                                    openQuestion?.type as SurveyQuestionTypeEnum,
                                                )}
                                                defaultValue={conditionOptions(
                                                    openQuestion?.type as SurveyQuestionTypeEnum,
                                                )?.find(
                                                    (c) =>
                                                        c.value ===
                                                        group.condition,
                                                )}
                                                value={
                                                    conditionOptions(
                                                        openQuestion?.type as SurveyQuestionTypeEnum,
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
