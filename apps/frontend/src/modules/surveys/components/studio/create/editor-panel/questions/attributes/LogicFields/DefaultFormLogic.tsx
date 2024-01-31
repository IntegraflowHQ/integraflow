import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { cn, generateUniqueId } from "@/utils";
import { LogicOperator } from "@integraflow/web/src/types";
import { PlusIcon } from "lucide-react";
import React, { useEffect } from "react";
import { MultiValue, SingleValue } from "react-select";
import { FormLogicValues } from "../../LogicTab";
import { Option, ReactSelect } from "../ReactSelect";
import { LogicGroup } from "./DefaultLogicGroup";
type Props = {
    formLogicValues: FormLogicValues;
    isCreatingLogic: boolean;
    setFormLogicValues: React.Dispatch<React.SetStateAction<FormLogicValues>>;
    setIsCreatingLogic: React.Dispatch<React.SetStateAction<boolean>>;
};

const FormLogicDefault = ({
    setFormLogicValues,
    formLogicValues,
    setIsCreatingLogic,
    isCreatingLogic,
}: Props) => {
    const { parsedQuestions } = useSurvey();
    const { updateQuestionMutation, openQuestion } = useQuestion();
    const [showAddGroup, setShowAddGroup] = React.useState<boolean>(false);
    useEffect(() => {
        const lastValue =
            formLogicValues.groups[formLogicValues.groups.length - 1];

        if (formLogicValues.groups.length > 0 && lastValue.condition) {
            setShowAddGroup(true);
        } else {
            setShowAddGroup(false);
        }
    }, [formLogicValues.groups]);

    const handleUpdateCondition = (
        value: SingleValue<Option> | MultiValue<Option>,
    ) => {
        updateQuestionMutation({
            settings: {
                ...openQuestion?.settings,
                logic: [
                    ...openQuestion?.settings.logic,
                    {
                        ...formLogicValues,
                        destination: (value as SingleValue<Option>)?.value,
                    },
                ],
            },
        });
        setIsCreatingLogic(false);
    };

    return (
        <>
            {isCreatingLogic && (
                <div className="relative rounded-md border border-intg-bg-4 ">
                    {formLogicValues.groups.map((group, index) => (
                        <LogicGroup
                            key={`${group.fields[0]}${index}`}
                            group={group}
                            index={index}
                            formLogicValues={formLogicValues}
                            setFormLogicValues={setFormLogicValues}
                            setIsCreatingLogic={setIsCreatingLogic}
                        />
                    ))}

                    {formLogicValues.groups.length > 0 && (
                        <div
                            className={cn(
                                showAddGroup
                                    ? "cursor-pointer"
                                    : "cursor-not-allowed",
                                "relative p-6",
                            )}
                        >
                            <hr className="border-intg-bg-4" />
                            <div className="absolute right-0 translate-x-1/2">
                                <PlusIcon
                                    onClick={() => {
                                        setFormLogicValues({
                                            ...formLogicValues,
                                            groups: [
                                                ...formLogicValues.groups,
                                                {
                                                    id: generateUniqueId(),
                                                    fields: [],
                                                    condition: "",
                                                    operator: LogicOperator.AND,
                                                },
                                            ],
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {formLogicValues.groups.length > 0 &&
                        formLogicValues.groups[0].condition && (
                            <div className="flex justify-between gap-14 p-6 pt-0">
                                <p>then</p>
                                <div className="w-[330px]">
                                    <ReactSelect
                                        options={[
                                            ...parsedQuestions
                                                .slice(
                                                    parsedQuestions.findIndex(
                                                        (q) =>
                                                            q.id ===
                                                            openQuestion?.id,
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
                                        onchange={(
                                            value:
                                                | SingleValue<Option>
                                                | MultiValue<Option>,
                                        ) => {
                                            handleUpdateCondition(value);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                </div>
            )}
        </>
    );
};

export default FormLogicDefault;
