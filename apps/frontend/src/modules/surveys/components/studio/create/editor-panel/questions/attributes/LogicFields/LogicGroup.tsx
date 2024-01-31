import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { FormLogicGroup, QuestionLogic } from "@/types";
import { getLogicConditions } from "@/utils/defaultOptions";
import { LogicOperator } from "@integraflow/web/src/types";
import { MultiValue, SingleValue } from "react-select";
import { Option, ReactSelect } from "../ReactSelect";

type Props = {
    logic: QuestionLogic;
};

export const LogicGroup = ({ logic }: Props) => {
    const { updateQuestionMutation, openQuestion } = useQuestion();

    const handleUpdateFields = (
        values: SingleValue<Option> | MultiValue<Option>,
        group: FormLogicGroup,
    ) => {
        const newLogic = [...openQuestion?.settings.logic];

        const currentLogic = newLogic.findIndex(
            (l: QuestionLogic) => l.id === logic.id,
        );
        const currentGroupIndex = newLogic[currentLogic].groups.findIndex(
            (g: FormLogicGroup) => g.id === group.id,
        );

        let currentGroup = newLogic[currentLogic].groups[currentGroupIndex];

        if ((values as MultiValue<Option>).length > 1) {
            if (
                (values as MultiValue<Option>)[
                    (values as MultiValue<Option>)?.length - 1
                ]?.value === "1"
            ) {
                newLogic[currentLogic].groups[currentGroupIndex] = {
                    ...currentGroup,
                    condition: "",
                    fields: ["1"],
                    operator: LogicOperator.OR,
                };
            } else {
                newLogic[currentLogic].groups[currentGroupIndex] = {
                    ...currentGroup,
                    condition: "",
                    operator: LogicOperator.AND,
                    fields: (values as MultiValue<Option>)
                        ?.filter((v) => v.value !== "1")
                        .map((v) => v.value),
                };
            }
        } else {
            newLogic[currentLogic].groups[
                newLogic[currentLogic].groups.findIndex(
                    (g: FormLogicGroup) => g.id === group.id,
                )
            ] = {
                ...group,
                condition: "",
                operator: LogicOperator.AND,
                fields: (values as MultiValue<Option>).map((v) => v.value),
            };
        }
        updateQuestionMutation({
            settings: {
                ...openQuestion?.settings,
                logic: newLogic,
            },
        });
    };

    const handleRemoveGroup = (group: FormLogicGroup) => {
        const currentLogic = openQuestion?.settings.logic.findIndex(
            (l: QuestionLogic) => l.id === logic.id,
        );
        const newLogic = [...openQuestion?.settings.logic];

        if (openQuestion?.settings.logic[currentLogic].groups.length === 1) {
            newLogic.splice(currentLogic, 1);
        } else {
            newLogic[currentLogic].groups = newLogic[
                currentLogic
            ].groups.filter((g: FormLogicGroup) => g.id !== group.id);
        }

        updateQuestionMutation({
            settings: {
                ...openQuestion?.settings,
                logic: newLogic,
            },
        });
    };
    const handleUpdateCondition = (
        value: SingleValue<Option> | MultiValue<Option>,
        group: FormLogicGroup,
    ) => {
        const newLogic = [...openQuestion?.settings.logic];
        const currentLogic = newLogic.findIndex(
            (l: QuestionLogic) => l.id === logic.id,
        );
        newLogic[currentLogic].groups[
            newLogic[currentLogic].groups.findIndex(
                (g: FormLogicGroup) => g.id === group.id,
            )
        ].condition = (value as SingleValue<Option>)?.value;

        updateQuestionMutation({
            settings: {
                ...openQuestion?.settings,
                logic: newLogic,
            },
        });
    };

    return (
        <>
            {logic.groups &&
                logic.groups.map((group) => {
                    return (
                        <div className="relative space-y-6 p-6" key={group.id}>
                            <div className="flex justify-between">
                                <div>If</div>
                                <div className="w-[330px]">
                                    <ReactSelect
                                        comboBox={true}
                                        options={[
                                            ...(openQuestion?.options?.map(
                                                (
                                                    option: SingleValue<Option>,
                                                ) => ({
                                                    value: option?.id,
                                                    label: option?.label,
                                                }),
                                            ) ?? []),
                                            {
                                                value: "1",
                                                label: "Any field",
                                            },
                                        ]}
                                        defaultValue={
                                            group.fields.length > 0
                                                ? group.fields.map((field) => ({
                                                      value: field,
                                                      label:
                                                          openQuestion?.options?.find(
                                                              (o: Option) =>
                                                                  o.id ===
                                                                  field,
                                                          )?.label ||
                                                          "Any field",
                                                  }))
                                                : []
                                        }
                                        value={
                                            group.fields.length === 1 &&
                                            group.fields[0] === "1"
                                                ? [
                                                      {
                                                          value: "1",
                                                          label: "Any field",
                                                      },
                                                  ]
                                                : group.fields.map((field) => {
                                                      const option =
                                                          openQuestion?.options?.find(
                                                              (
                                                                  option: Option,
                                                              ) =>
                                                                  option.id ===
                                                                  field,
                                                          );
                                                      return {
                                                          value: option?.id,
                                                          label: option?.label,
                                                      };
                                                  })
                                        }
                                        onchange={(
                                            values:
                                                | SingleValue<Option>
                                                | MultiValue<Option>,
                                        ) => {
                                            handleUpdateFields(values, group);
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
                                                openQuestion?.type as SurveyQuestionTypeEnum,
                                            )}
                                            defaultValue={getLogicConditions(
                                                openQuestion?.type as SurveyQuestionTypeEnum,
                                            )?.find(
                                                (c) =>
                                                    c.value === group.condition,
                                            )}
                                            value={
                                                getLogicConditions(
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
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div
                                className="absolute bottom-1/2 right-0 translate-x-1/2 cursor-pointer border"
                                onClick={() => {
                                    handleRemoveGroup(group);
                                }}
                            >
                                <MinusIcon />
                            </div>
                        </div>
                    );
                })}
        </>
    );
};
