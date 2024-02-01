import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { QuestionSettings } from "@/types";
import { cn, generateUniqueId } from "@/utils";
import { LogicOperator } from "@integraflow/web/src/types";
import { useEffect, useState } from "react";
import { TabHeader } from "./TabHeader";
import FormLogicDefault from "./attributes/LogicFields/DefaultFormLogic";
import { DefaultLogicBox } from "./attributes/LogicFields/DefaultLogicBox";
import { FormLogicBox } from "./attributes/LogicFields/FormLogic";
import { LogicBox } from "./attributes/LogicFields/LogicBox";

type Props = {
    question: SurveyQuestion;
    questionIndex: number;
};
type QuestionLogic = {
    id: string;
    orderNumber?: number;
    destination: string;
};

export type LogicValues = QuestionLogic & {
    condition: string;
    values?: string[];
    operator: LogicOperator | undefined;
};

export type FormLogicValues = QuestionLogic & {
    groups: {
        id?: string;
        condition: string;
        operator: string;
        fields: string[];
    }[];
    operator: LogicOperator | undefined;
};

export const LogicTab = ({ question, questionIndex }: Props) => {
    const [isCreatingLogic, setIsCreatingLogic] = useState(false);

    const [logicValues, setLogicValues] = useState<LogicValues>({
        id: "",
        condition: "",
        values: undefined,
        operator: undefined,
        destination: "",
        orderNumber: question.settings.logic?.length || 0,
    });

    const [formLogicValues, setFormLogicValues] = useState<FormLogicValues>({
        id: "",
        groups: [
            {
                id: "",
                condition: "",
                operator: "",
                fields: [],
            },
        ],
        operator: undefined,
        destination: "",
        orderNumber: question.settings.logic?.length || 0,
    });

    useEffect(() => {
        if (isCreatingLogic) {
            if (question.type === SurveyQuestionTypeEnum.Form) {
                setFormLogicValues({
                    ...formLogicValues,
                    operator: LogicOperator.AND,
                    id: generateUniqueId(),
                    orderNumber: question.settings.logic?.length + 1 || 0,
                    groups: [
                        {
                            id: generateUniqueId(),
                            condition: "",
                            operator: LogicOperator.AND,
                            fields: [],
                        },
                    ],
                });
            } else {
                setLogicValues({
                    ...logicValues,
                    id: generateUniqueId(),
                    orderNumber: question.settings.logic?.length + 1 || 0,
                });
            }
        } else {
            setFormLogicValues({
                id: generateUniqueId(),
                groups: [
                    {
                        id: "",
                        condition: "",
                        operator: "",
                        fields: [],
                    },
                ],
                operator: undefined,
                destination: "",
                orderNumber: undefined,
            });
            setLogicValues({
                id: "",
                condition: "",
                values: undefined,
                operator: undefined,
                destination: "",
                orderNumber: undefined,
            });
        }
    }, [isCreatingLogic]);

    return (
        <div className="space-y-4">
            <TabHeader question={question} questionIndex={questionIndex} />
            <div className="">
                <h3 className="text-sm font-semibold">Add logic</h3>
                <p className="text-sm">
                    Wondering how logic works?{" "}
                    <span className="cursor-pointer underline">Learn more</span>
                </p>
            </div>
            {question.type === SurveyQuestionTypeEnum.Form ? (
                <>
                    {((question.settings as QuestionSettings).logic || [])?.map(
                        (logic, index) => {
                            return (
                                <FormLogicBox
                                    logicIndex={index}
                                    question={question}
                                    setIsCreatingLogic={setIsCreatingLogic}
                                    logic={logic}
                                    key={logic.id}
                                />
                            );
                        },
                    )}
                    {
                        <FormLogicDefault
                            question={question}
                            isCreatingLogic={isCreatingLogic}
                            setIsCreatingLogic={setIsCreatingLogic}
                            formLogicValues={formLogicValues}
                            setFormLogicValues={setFormLogicValues}
                        />
                    }
                </>
            ) : (
                <>
                    {((question.settings as QuestionSettings).logic || [])?.map(
                        (logic) => {
                            return (
                                <LogicBox
                                    setIsCreatingLogic={setIsCreatingLogic}
                                    logic={logic}
                                    key={logic.id}
                                />
                            );
                        },
                    )}
                    {isCreatingLogic && (
                        <DefaultLogicBox
                            isCreatingLogic={isCreatingLogic}
                            question={question}
                            setIsCreatingLogic={setIsCreatingLogic}
                            logicValues={logicValues}
                            setLogicValues={setLogicValues}
                        />
                    )}
                </>
            )}
            <div
                className={cn(
                    isCreatingLogic ? "cursor-not-allowed" : "cursor-pointer",
                    "border-3 rounded-md border border-dotted border-intg-bg-4 p-6 text-center",
                )}
                onClick={() => setIsCreatingLogic(true)}
            >
                <p className="text-xs underline">Add new Logic</p>
            </div>
            <p className="text-sm">
                All other answers will direct the respondents to the next
                question.
            </p>
        </div>
    );
};
