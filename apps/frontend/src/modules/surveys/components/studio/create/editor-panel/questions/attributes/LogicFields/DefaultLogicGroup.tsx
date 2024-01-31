import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { FormLogicGroup } from "@/types";
import { getLogicConditions } from "@/utils/defaultOptions";
import { LogicOperator } from "@integraflow/web/src/types";
import { MultiValue, SingleValue } from "react-select";
import { FormLogicValues } from "../../LogicTab";
import { Option, ReactSelect } from "../ReactSelect";

type Props = {
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
    setIsCreatingLogic,
    index,
}: Props) => {
    const { openQuestion } = useQuestion();
    const handleUpdateFields = (
        values: SingleValue<Option> | MultiValue<Option>,
    ) => {
        if ((values as MultiValue<Option>).length > 1) {
            if (
                (values as MultiValue<Option>)[
                    (values as MultiValue<Option>)?.length - 1
                ]?.value === "1"
            ) {
                setFormLogicValues({
                    ...formLogicValues,
                    groups: formLogicValues.groups.map((g) => ({
                        ...g,
                        fields: ["1"],
                        operator: LogicOperator.OR,
                    })),
                });
                return;
            } else {
                setFormLogicValues({
                    ...formLogicValues,
                    groups: formLogicValues.groups.map((g) => ({
                        ...g,
                        operator: LogicOperator.AND,
                        fields: (values as MultiValue<Option>)
                            ?.filter((v) => v.value !== "1")
                            .map((v) => v.value),
                    })),
                });
            }
        } else {
            setFormLogicValues({
                ...formLogicValues,
                groups: formLogicValues.groups.map((g) => ({
                    ...g,
                    operator: LogicOperator.AND,
                    fields: (values as MultiValue<Option>).map((v) => v.value),
                })),
            });
        }
    };

    const handleRemoveGroup = () => {
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
            groups: formLogicValues.groups.filter((g) => g.id !== group.id),
        });
    };

    const handleUpdateCondition = (
        value: SingleValue<Option> | MultiValue<Option>,
    ) => {
        setFormLogicValues({
            ...formLogicValues,
            groups: formLogicValues.groups.map((g) =>
                g.id === group.id
                    ? {
                          ...g,
                          condition: (value as SingleValue<Option>)?.value,
                      }
                    : g,
            ),
        });
    };

    return (
        <div className="relative" key={group.id}>
            <div className="relative space-y-6 p-6" key={index}>
                <div className="flex justify-between">
                    <div></div>
                    <div className="w-[330px]">
                        <ReactSelect
                            comboBox={true}
                            options={[
                                ...(openQuestion?.options?.map(
                                    (option: Option) => ({
                                        value: option.id,
                                        label: option.label,
                                    }),
                                ) ?? []),
                                {
                                    value: "1",
                                    label: "Any field",
                                },
                            ]}
                            onchange={(values) => {
                                handleUpdateFields(values);
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
                                          const option =
                                              openQuestion?.options?.find(
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
                                options={getLogicConditions(
                                    openQuestion?.type!,
                                )}
                                onchange={(value) => {
                                    handleUpdateCondition(value);
                                }}
                            />
                        </div>
                    </div>
                )}

                <div
                    className="absolute bottom-1/2 right-0 translate-x-1/2 border"
                    onClick={() => handleRemoveGroup()}
                >
                    <MinusIcon />
                </div>
            </div>
        </div>
    );
};
