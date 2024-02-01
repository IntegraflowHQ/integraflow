import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { cn, generateUniqueId } from "@/utils";
import { LogicOperator } from "@integraflow/web/src/types";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MultiValue, SingleValue } from "react-select";
import { FormLogicValues } from "../../LogicTab";
import { Option, ReactSelect } from "../ReactSelect";
import { LogicGroup } from "./DefaultLogicGroup";
type Props = {
    formLogicValues: FormLogicValues;
    isCreatingLogic: boolean;
    setFormLogicValues: React.Dispatch<React.SetStateAction<FormLogicValues>>;
    setIsCreatingLogic: React.Dispatch<React.SetStateAction<boolean>>;
    question: SurveyQuestion;
};

const FormLogicDefault = ({
    setFormLogicValues,
    formLogicValues,
    setIsCreatingLogic,
    isCreatingLogic,
    question,
}: Props) => {
    const { parsedQuestions } = useSurvey();
    const { updateQuestionMutation } = useQuestion();
    const [enableAddGroupBtn, setEnableAddGroupBtn] = useState<boolean>(false);
    const [showAddGroupBtn, setShowAddGroupBtn] = useState<boolean>(false);

    useEffect(() => {
        if (
            formLogicValues.groups[0].fields[0] === "-1" &&
            formLogicValues.groups[0].condition === "any_value"
        ) {
            setShowAddGroupBtn(false);
        } else {
            setShowAddGroupBtn(true);
        }
    }, [formLogicValues]);

    useEffect(() => {
        const lastValue =
            formLogicValues.groups[formLogicValues.groups.length - 1];

        if (formLogicValues.groups.length > 0 && lastValue.condition) {
            console.log(lastValue.condition);
            setEnableAddGroupBtn(true);
        } else if (formLogicValues.groups.some((group) => !group.condition)) {
            setEnableAddGroupBtn(false);
        } else {
            setEnableAddGroupBtn(false);
        }
    }, [formLogicValues.groups]);

    const handleUpdateCondition = (
        value: SingleValue<Option> | MultiValue<Option>,
    ) => {
        updateQuestionMutation({
            settings: {
                ...question?.settings,
                logic: [
                    ...question?.settings.logic,
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
                            question={question}
                            key={group.id}
                            group={group}
                            index={index}
                            formLogicValues={formLogicValues}
                            setFormLogicValues={setFormLogicValues}
                            setIsCreatingLogic={setIsCreatingLogic}
                        />
                    ))}

                    {showAddGroupBtn && (
                        <>
                            {formLogicValues.groups.length > 0 && (
                                <div
                                    className={cn(
                                        enableAddGroupBtn
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
                                                            operator:
                                                                LogicOperator.AND,
                                                        },
                                                    ],
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
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
                                                            question?.id,
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
