import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { LogicOperator } from "@integraflow/web/src/types";
import { PlusIcon } from "lucide-react";
import React from "react";
import { FormLogicValues } from "../../LogicTab";
import { ReactSelect } from "../ReactSelect";
import { LogicGroup } from "./LogicGroup";
type Props = {
    question: SurveyQuestion;
    formLogicValues: FormLogicValues;
    isCreatingLogic: boolean;
    setFormLogicValues: React.Dispatch<React.SetStateAction<FormLogicValues>>;
    setIsCreatingLogic: React.Dispatch<React.SetStateAction<boolean>>;
};

const FormLogicDefault = ({
    question,
    setFormLogicValues,
    formLogicValues,
    setIsCreatingLogic,
    isCreatingLogic,
}: Props) => {
    const { parsedQuestions } = useSurvey();
    const { updateQuestionMutation } = useQuestion();

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
                            question={question}
                            setIsCreatingLogic={setIsCreatingLogic}
                        />
                    ))}

                    {formLogicValues.groups.length > 0 && (
                        <div className="relative">
                            <hr />
                            <div className="absolute right-0 translate-x-1/2">
                                <PlusIcon
                                    onClick={() => {
                                        setFormLogicValues({
                                            ...formLogicValues,
                                            groups: [
                                                ...formLogicValues.groups,
                                                {
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
                                                            question.id,
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
                                            updateQuestionMutation({
                                                settings: {
                                                    ...question.settings,
                                                    logic: [
                                                        ...question.settings
                                                            .logic,
                                                        {
                                                            ...formLogicValues,
                                                            destination:
                                                                value?.value,
                                                        },
                                                    ],
                                                },
                                            });
                                            setIsCreatingLogic(false);
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
