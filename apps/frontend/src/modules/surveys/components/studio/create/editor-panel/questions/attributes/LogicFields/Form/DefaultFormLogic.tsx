import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { QuestionLogic } from "@/types";
import { cn, generateUniqueId } from "@/utils";
import { LogicOperator } from "@integraflow/web/src/types";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MultiValue, SingleValue } from "react-select";
import { LogicOperatorBtn } from "../../LogicOperator";
import { Option, ReactSelect } from "../../ReactSelect";
import { LogicGroup } from "./DefaultLogicGroup";
type Props = {
    formLogicValues: QuestionLogic;
    isCreatingLogic: boolean;
    setFormLogicValues: React.Dispatch<React.SetStateAction<QuestionLogic>>;
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
    const [allowAddGroup, setAllowAddGroup] = useState<boolean>(false);
    const [groupOperator, setGroupOperator] = useState<LogicOperator>(
        formLogicValues.operator as LogicOperator,
    );

    useEffect(() => {
        if (formLogicValues.groups && formLogicValues.groups.length > 0) {
            const disable = formLogicValues.groups.some(
                (g) => g.fields.length === 0 || !g.condition,
            );
            setAllowAddGroup(disable);
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

    const handleUpdateGroupOperator = () => {
        if (groupOperator === LogicOperator.AND) {
            setGroupOperator(LogicOperator.OR);
        } else {
            setGroupOperator(LogicOperator.AND);
        }
        setFormLogicValues({
            ...formLogicValues,
            operator:
                groupOperator === LogicOperator.AND
                    ? LogicOperator.OR
                    : LogicOperator.AND,
        });
    };

    return (
        <>
            {isCreatingLogic && (
                <div className="relative rounded-md border border-intg-bg-4 ">
                    {(formLogicValues?.groups || []).map((group, index) => (
                        <>
                            <div className="m-auto w-fit">
                                <LogicOperatorBtn
                                    value={
                                        formLogicValues.operator as LogicOperator
                                    }
                                    onclick={() => {
                                        handleUpdateGroupOperator();
                                        console.log("first");
                                    }}
                                />
                            </div>
                            <LogicGroup
                                question={question}
                                key={group.id}
                                group={group}
                                index={index}
                                formLogicValues={formLogicValues}
                                setFormLogicValues={setFormLogicValues}
                                setIsCreatingLogic={setIsCreatingLogic}
                            />
                        </>
                    ))}

                    <>
                        {formLogicValues.groups &&
                            formLogicValues?.groups.length > 0 && (
                                <div className="">
                                    <hr className="mx-6 border-intg-bg-4" />
                                    <div className={cn("relative p-6 ")}>
                                        <button
                                            disabled={allowAddGroup}
                                            className={cn(
                                                !allowAddGroup
                                                    ? "cursor-pointer"
                                                    : "cursor-not-allowed",
                                                "absolute right-0 top-0 -translate-y-1/2 translate-x-1/2",
                                            )}
                                        >
                                            <PlusIcon
                                                onClick={() => {
                                                    setFormLogicValues({
                                                        ...formLogicValues,
                                                        groups: [
                                                            ...(formLogicValues.groups ??
                                                                []),
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
                                        </button>
                                    </div>
                                </div>
                            )}
                    </>

                    {formLogicValues.groups &&
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
