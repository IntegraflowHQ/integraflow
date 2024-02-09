import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { QuestionLogic } from "@/types";
import { cn, generateUniqueId } from "@/utils";
import { destinationOptions } from "@/utils/question";
import { LogicOperator } from "@integraflow/web/src/types";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { SingleValue } from "react-select";
import { Option, ReactSelect } from "../../ReactSelect";
import { LogicGroup } from "./LogicGroup";

type Props = {
    logic: QuestionLogic;
    setIsCreatingLogic: React.Dispatch<React.SetStateAction<boolean>>;
    question: SurveyQuestion;
    logicIndex: number;
};

export const FormLogicBox = ({ logic, logicIndex }: Props) => {
    const { parsedQuestions } = useSurvey();
    const { openQuestion } = useQuestion();
    const [allowAddLogic, setAllowAddLogic] = useState(false);
    const [editValues, setEditValues] = useState(logic);

    useEffect(() => {
        if (editValues.groups && editValues.groups.length > 0) {
            const disable = editValues.groups.some(
                (g) => g.fields.length === 0 || !g.condition,
            );
            setAllowAddLogic(disable);
        }
    }, [editValues]);

    const addLogicGroup = () => {
        setEditValues({
            ...editValues,
            groups: [
                ...(editValues.groups ?? []),
                {
                    id: generateUniqueId(),
                    fields: [],
                    condition: "",
                    operator: LogicOperator.AND,
                },
            ],
        });
    };

    return (
        <div className="relative rounded-md border border-intg-bg-4">
            <LogicGroup
                groups={editValues.groups || []}
                logicIndex={logicIndex}
                question={openQuestion!}
                setEditValues={setEditValues}
                editValues={editValues}
            />

            <div className="relative p-6">
                <hr className="border-intg-bg-4" />
                <button
                    disabled={allowAddLogic}
                    className={cn(
                        allowAddLogic ? "cursor-not-allowed" : "cursor-pointer",
                        "absolute right-0 -translate-y-1/2 translate-x-1/2",
                    )}
                    onClick={addLogicGroup}
                >
                    <PlusIcon />
                </button>
            </div>

            <div className="flex justify-between gap-14 p-6 pt-0">
                <p>then</p>
                <div className="w-[330px]">
                    <ReactSelect
                        options={destinationOptions(
                            parsedQuestions,
                            openQuestion!,
                        )}
                        defaultValue={
                            parsedQuestions.find(
                                (q) => q.id === logic.destination,
                            )
                                ? {
                                      value: logic.destination,
                                      label:
                                          parsedQuestions.find(
                                              (q) => q.id === logic.destination,
                                          )?.label || "Empty Question",
                                  }
                                : {
                                      value: "-1",
                                      label: "End survey",
                                  }
                        }
                        onchange={(value) => {
                            setEditValues({
                                ...editValues,
                                destination: (value as SingleValue<Option>)
                                    ?.value,
                            });
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
