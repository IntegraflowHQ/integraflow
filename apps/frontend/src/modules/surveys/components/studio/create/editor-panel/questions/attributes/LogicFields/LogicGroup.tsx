import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { FormLogicGroup, QuestionLogic } from "@/types";
import { getLogicConditions } from "@/utils/defaultOptions";
import { LogicOperator } from "@integraflow/web/src/types";
import { MultiValue, SingleValue } from "react-select";
import { Option, ReactSelect } from "../ReactSelect";

type Props = {
    question: SurveyQuestion;
    logic: QuestionLogic;
};

export const LogicGroup = ({ question, logic }: Props) => {
    const { updateQuestionMutation } = useQuestion();

    const handleUpdateFields = (
        values: SingleValue<Option> | MultiValue<Option>,
        group: FormLogicGroup,
    ) => {
        const newLogic = [...question.settings.logic];

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
                ...question.settings,
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
                                            ...(question.options?.map(
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
                                                          question.options?.find(
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
                                                          question.options?.find(
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
                                                question.type,
                                            )}
                                            defaultValue={getLogicConditions(
                                                question.type,
                                            )?.find(
                                                (c) =>
                                                    c.value === group.condition,
                                            )}
                                            value={
                                                getLogicConditions(
                                                    question.type,
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
                                                const newLogic = [
                                                    ...question.settings.logic,
                                                ];
                                                const currentLogic =
                                                    newLogic.findIndex(
                                                        (l: QuestionLogic) =>
                                                            l.id === logic.id,
                                                    );
                                                newLogic[currentLogic].groups[
                                                    newLogic[
                                                        currentLogic
                                                    ].groups.findIndex(
                                                        (g: FormLogicGroup) =>
                                                            g.id === group.id,
                                                    )
                                                ].condition = (
                                                    value as SingleValue<Option>
                                                )?.value;

                                                updateQuestionMutation({
                                                    settings: {
                                                        ...question.settings,
                                                        logic: newLogic,
                                                    },
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div
                                className="absolute bottom-1/2 right-0 translate-x-1/2 cursor-pointer border"
                                onClick={() => {
                                    const currentLogic =
                                        question.settings.logic.findIndex(
                                            (l: QuestionLogic) =>
                                                l.id === logic.id,
                                        );
                                    const newLogic = [
                                        ...question.settings.logic,
                                    ];

                                    if (
                                        question.settings.logic[currentLogic]
                                            .groups.length === 1
                                    ) {
                                        newLogic.splice(currentLogic, 1);
                                    } else {
                                        newLogic[currentLogic].groups =
                                            newLogic[
                                                currentLogic
                                            ].groups.filter(
                                                (g: FormLogicGroup) =>
                                                    g.id !== group.id,
                                            );
                                    }

                                    updateQuestionMutation({
                                        settings: {
                                            ...question.settings,
                                            logic: newLogic,
                                        },
                                    });
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
