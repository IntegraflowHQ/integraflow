import { SurveyQuestionTypeEnum, SurveyStatusEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { LogicOperator, QuestionLogic, QuestionSettings } from "@/types";
import { cn, generateUniqueId } from "@/utils";
import { useEffect, useState } from "react";
import { TabHeader } from "./TabHeader";
import { DefaultLogicBox } from "./attributes/LogicFields/DefaultLogicBox";
import FormLogicDefault from "./attributes/LogicFields/Form/DefaultFormLogic";
import { FormLogicBox } from "./attributes/LogicFields/Form/FormLogic";
import { LogicBox } from "./attributes/LogicFields/LogicBox";

type Props = {
    questionIndex: number;
};

export const LogicTab = ({ questionIndex }: Props) => {
    const [isCreatingLogic, setIsCreatingLogic] = useState(false);
    const { survey } = useSurvey();
    const { question } = useQuestion();

    const [logicValues, setLogicValues] = useState<QuestionLogic>({
        id: "",
        condition: undefined,
        values: undefined,
        operator: undefined,
        destination: "",
        orderNumber: question?.settings.logic?.length || 0,
    });

    const [formLogicValues, setFormLogicValues] = useState<QuestionLogic>({
        id: "",
        groups: [
            {
                id: "",
                condition: "",
                operator: "",
                fields: [],
            },
        ],
        operator: LogicOperator.AND,
        destination: "",
        orderNumber: question?.settings.logic?.length || 0,
    });

    useEffect(() => {
        if (isCreatingLogic) {
            if (question?.type === SurveyQuestionTypeEnum.Form) {
                setFormLogicValues({
                    ...formLogicValues,
                    operator: LogicOperator.AND,
                    id: generateUniqueId(),
                    orderNumber: (question?.settings.logic?.length ?? 0) + 1 || 0,
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
                    orderNumber: (question?.settings.logic?.length ?? 0) + 1 || 0,
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
                condition: undefined,
                values: undefined,
                operator: undefined,
                destination: "",
                orderNumber: undefined,
            });
        }
    }, [isCreatingLogic]);

    if (!question) {
        return null;
    }

    return (
        <div className="space-y-4">
            <TabHeader questionIndex={questionIndex} />

            <div className="">
                <h3 className="text-sm font-semibold">Add logic</h3>
                <p className="text-sm">
                    Wondering how logic works? <span className="cursor-pointer underline">Learn more</span>
                </p>
            </div>

            {question.type === SurveyQuestionTypeEnum.Form ? (
                <>
                    {((question.settings as QuestionSettings).logic || [])?.map((logic, index) => {
                        return (
                            <div className="w-full">
                                <FormLogicBox logicIndex={index} logic={logic} key={logic.id} />
                            </div>
                        );
                    })}

                    {
                        <FormLogicDefault
                            isCreatingLogic={isCreatingLogic}
                            setIsCreatingLogic={setIsCreatingLogic}
                            formLogicValues={formLogicValues}
                            setFormLogicValues={setFormLogicValues}
                        />
                    }
                </>
            ) : (
                <>
                    {((question.settings as QuestionSettings).logic || [])?.map((logic, index) => {
                        return (
                            <LogicBox
                                key={logic.id}
                                setIsCreatingLogic={setIsCreatingLogic}
                                logic={logic}
                                logicIndex={index}
                                setLogicValues={setLogicValues}
                            />
                        );
                    })}

                    {isCreatingLogic && (
                        <DefaultLogicBox
                            isCreatingLogic={isCreatingLogic}
                            setIsCreatingLogic={setIsCreatingLogic}
                            logicValues={logicValues}
                            setLogicValues={setLogicValues}
                        />
                    )}
                </>
            )}

            {survey?.status !== SurveyStatusEnum.Active ? (
                <div
                    className={cn(
                        isCreatingLogic ? "cursor-not-allowed" : "cursor-pointer",
                        "border-3 rounded-md border border-dotted border-intg-bg-4 p-6 text-center",
                    )}
                    onClick={() => setIsCreatingLogic(true)}
                >
                    <p className="text-xs underline">Add new Logic</p>
                </div>
            ) : null}

            <p className="text-sm">All other answers will direct the respondents to the next question.</p>
        </div>
    );
};
