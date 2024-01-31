import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { QuestionLogic } from "@/types";
import { generateUniqueId } from "@/utils";
import { PlusIcon } from "lucide-react";
import React from "react";
import { MultiValue, SingleValue } from "react-select";
import { Option, ReactSelect } from "../ReactSelect";
import { LogicGroup } from "./LogicGroup";

type Props = {
    logic: QuestionLogic;
    setIsCreatingLogic: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FormLogicBox = ({ logic }: Props) => {
    const { parsedQuestions } = useSurvey();
    const { updateQuestionMutation, openQuestion } = useQuestion();

    const addLogicGroup = () => {
        const newLogic = [...openQuestion?.settings.logic];
        const currentLogic = newLogic.findIndex(
            (l: QuestionLogic) => l.id === logic.id,
        );
        newLogic[currentLogic].groups.push({
            id: generateUniqueId(),
            fields: [],
        });

        updateQuestionMutation({
            settings: {
                ...openQuestion?.settings,
                logic: newLogic,
            },
        });
    };

    const handleDestinationChange = (
        value: SingleValue<Option> | MultiValue<Option>,
    ) => {
        const newLogic = [...openQuestion?.settings.logic];
        const currentLogic = newLogic.findIndex(
            (l: QuestionLogic) => l.id === logic.id,
        );
        newLogic[currentLogic].destination = value;

        updateQuestionMutation({
            settings: {
                ...openQuestion?.settings,
                logic: newLogic,
            },
        });
    };

    return (
        <div className="relative rounded-md border border-intg-bg-4">
            <LogicGroup logic={logic} />

            <div className="relative p-6">
                <hr className="border-intg-bg-4" />
                <div className="absolute right-0 -translate-y-1/2 translate-x-1/2">
                    <PlusIcon onClick={addLogicGroup} />
                </div>
            </div>

            <div className="flex justify-between gap-14 p-6 pt-0">
                <p>then</p>
                <div className="w-[330px]">
                    <ReactSelect
                        options={[
                            ...parsedQuestions
                                .slice(
                                    parsedQuestions.findIndex(
                                        (q) => q.id === openQuestion?.id,
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
                        onchange={(value) => handleDestinationChange(value)}
                    />
                </div>
            </div>
        </div>
    );
};
