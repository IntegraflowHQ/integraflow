import { SurveyQuestion } from "@/generated/graphql";
import { QuestionSettings } from "@/types";
import { cn, generateUniqueId } from "@/utils";
import { useEffect, useState } from "react";
import { TabHeader } from "./TabHeader";
import { DefaultLogicBox } from "./attributes/LogicFields/DefaultLogicBox";
import { LogicBox } from "./attributes/LogicFields/LogicBox";

type Props = {
    question: SurveyQuestion;
    questionIndex: number;
};

export type LogicValues = {
    id: string;
    condition: string;
    values?: string[];
    operator: string;
    destination: string;
    orderNumber?: number;
};

export const LogicTab = ({ question, questionIndex }: Props) => {
    const [isCreatingLogic, setIsCreatingLogic] = useState(false);

    const [logicValues, setLogicValues] = useState<LogicValues>({
        id: "",
        condition: "",
        values: undefined,
        operator: "",
        destination: "",
        orderNumber: question.settings.logic?.length || 0,
    });

    useEffect(() => {
        if (isCreatingLogic) {
            setLogicValues({
                ...logicValues,
                id: generateUniqueId(),
                orderNumber: question.settings.logic?.length + 1 || 0,
            });
        } else {
            setLogicValues({
                id: "",
                condition: "",
                values: undefined,
                operator: "",
                destination: "",
                orderNumber: undefined,
            });
        }
    }, [isCreatingLogic]);

    console.log(isCreatingLogic);

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
            <>
                {((question.settings as QuestionSettings).logic || [])?.map(
                    (logic) => {
                        return (
                            <LogicBox
                                question={question}
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
