import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { SurveyQuestion } from "@/generated/graphql";
import { FormLogicGroup } from "@/types";
import { getLogicConditions } from "@/utils/defaultOptions";
import { LogicOperator } from "@integraflow/web/src/types";
import { MultiValue, SingleValue } from "react-select";
import { FormLogicValues } from "../../LogicTab";
import { Option, ReactSelect } from "../ReactSelect";

type Props = {
    question: SurveyQuestion;
    formLogicValues: FormLogicValues;
    index: number;
    setFormLogicValues: React.Dispatch<React.SetStateAction<FormLogicValues>>;
    setIsCreatingLogic: React.Dispatch<React.SetStateAction<boolean>>;
    group: FormLogicGroup;
};

export const LogicGroup = ({
    group,
    formLogicValues,
    setFormLogicValues,
    question,
    setIsCreatingLogic,
    index,
}: Props) => {
    return (
        <div className="relative" key={group.id}>
            <div className="relative space-y-6 p-6" key={index}>
                <div className="flex justify-between">
                    <div></div>
                    <div className="w-[330px]">
                        <ReactSelect
                            comboBox={true}
                            options={[
                                ...(question.options?.map((option: Option) => ({
                                    value: option.id,
                                    label: option.label,
                                })) ?? []),
                                {
                                    value: "1",
                                    label: "Any field",
                                },
                            ]}
                            onchange={(values) => {
                                if ((values as MultiValue<Option>).length > 1) {
                                    if (
                                        (values as MultiValue<Option>)[
                                            (values as MultiValue<Option>)
                                                ?.length - 1
                                        ]?.value === "1"
                                    ) {
                                        setFormLogicValues({
                                            ...formLogicValues,
                                            groups: formLogicValues.groups.map(
                                                (g) => ({
                                                    ...g,
                                                    fields: ["1"],
                                                    operator: LogicOperator.OR,
                                                }),
                                            ),
                                        });
                                        return;
                                    } else {
                                        setFormLogicValues({
                                            ...formLogicValues,
                                            groups: formLogicValues.groups.map(
                                                (g) => ({
                                                    ...g,
                                                    operator: LogicOperator.AND,
                                                    fields: (
                                                        values as MultiValue<Option>
                                                    )
                                                        ?.filter(
                                                            (v) =>
                                                                v.value !== "1",
                                                        )
                                                        .map((v) => v.value),
                                                }),
                                            ),
                                        });
                                    }
                                } else {
                                    setFormLogicValues({
                                        ...formLogicValues,
                                        groups: formLogicValues.groups.map(
                                            (g) => ({
                                                ...g,
                                                operator: LogicOperator.AND,
                                                fields: (
                                                    values as MultiValue<Option>
                                                ).map((v) => v.value),
                                            }),
                                        ),
                                    });
                                }
                            }}
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
                                          const option = question.options?.find(
                                              (option: Option) =>
                                                  option.id === field,
                                          );
                                          return {
                                              value: option?.id,
                                              label: option?.label,
                                          };
                                      })
                            }
                        />
                    </div>
                </div>

                {group.fields.length > 0 && (
                    <div className="flex justify-between">
                        <p>If answer</p>
                        <div className="w-[330px]">
                            <ReactSelect
                                options={getLogicConditions(question.type)}
                                onchange={(value) => {
                                    setFormLogicValues({
                                        ...formLogicValues,
                                        groups: formLogicValues.groups.map(
                                            (g) =>
                                                g.id === group.id
                                                    ? {
                                                          ...g,
                                                          condition: (
                                                              value as SingleValue<Option>
                                                          )?.value,
                                                      }
                                                    : g,
                                        ),
                                    });
                                }}
                            />
                        </div>
                    </div>
                )}

                <div
                    className="absolute bottom-1/2 right-0 translate-x-1/2 border"
                    onClick={() => {
                        if (formLogicValues.groups.length === 1) {
                            setFormLogicValues({
                                ...formLogicValues,
                                groups: [],
                                orderNumber: undefined,
                            });
                            setIsCreatingLogic(false);
                            return;
                        }
                        setFormLogicValues({
                            ...formLogicValues,
                            groups: formLogicValues.groups.filter(
                                (g) => g.id !== group.id,
                            ),
                        });
                    }}
                >
                    <MinusIcon />
                </div>
            </div>
        </div>
    );
};
