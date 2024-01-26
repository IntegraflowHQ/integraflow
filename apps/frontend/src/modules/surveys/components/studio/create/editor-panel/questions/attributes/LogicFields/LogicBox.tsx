import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { QuestionLogic } from "@/types";
import { getLogicConditions, getLogicOperator } from "@/utils/defaultOptions";
import { ReactSelect } from "../ReactSelect";

type Props = {
    question: SurveyQuestion;
    logic: QuestionLogic;
    setIsCreatingLogic: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LogicBox = ({ question, setIsCreatingLogic, logic }: Props) => {
    const { parsedQuestions } = useSurvey();
    const { updateQuestionMutation } = useQuestion();

    return (
        <>
            <div className="relative space-y-6 rounded-md border border-intg-bg-4 p-6">
                <div className="flex justify-between">
                    <p>If answer</p>
                    <div className="w-[330px]">
                        <ReactSelect
                            options={getLogicConditions(question.type)}
                            onchange={(value) => {
                                updateQuestionMutation({
                                    settings: {
                                        ...question.settings,
                                        logic: [
                                            ...question.settings.logic.filter(
                                                (l) => l.id !== logic.id,
                                            ),
                                            {
                                                ...logic,
                                                condition: value?.value,
                                                operator: getLogicOperator(
                                                    value?.value,
                                                ),
                                            },
                                        ],
                                    },
                                });
                                setIsCreatingLogic(false);
                            }}
                            defaultValue={
                                getLogicConditions(question.type)?.find(
                                    (c) => c.value === logic.condition,
                                ) || null
                            }
                        />
                    </div>
                </div>
                {logic.values && logic.values?.length > 0 && (
                    <div className="flex justify-between">
                        <div></div>
                        <div className="w-[330px]">
                            <ReactSelect
                                comboBox={true}
                                options={question.options?.map((option) => {
                                    return {
                                        value: option.id,
                                        label: option.label,
                                    };
                                })}
                                defaultValue={
                                    logic.values
                                        ?.map(
                                            (v) =>
                                                question.options?.find(
                                                    (o) => o.id === v,
                                                ),
                                        )
                                        .map((v) => {
                                            return {
                                                value: v?.id,
                                                label: v?.label,
                                            };
                                        }) || null
                                }
                                onchange={(value) => {
                                    updateQuestionMutation({
                                        settings: {
                                            ...question.settings,
                                            logic: [
                                                ...question.settings.logic.filter(
                                                    (l) => l.id !== logic.id,
                                                ),
                                                {
                                                    ...logic,
                                                    values: value?.map(
                                                        (v) => v.value,
                                                    ),
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

                <div className="flex justify-between gap-14">
                    <p>then</p>
                    <div className="w-[330px]">
                        <ReactSelect
                            defaultValue={
                                // find from parsedQuestions the question with the id of the destination and a new label 'end survey' for the last option with value -1
                                parsedQuestions.find(
                                    (q) => q.id === logic.destination,
                                )
                                    ? {
                                          value: logic.destination,
                                          label:
                                              parsedQuestions.find(
                                                  (q) =>
                                                      q.id ===
                                                      logic.destination,
                                              )?.label || "Empty Question",
                                      }
                                    : {
                                          value: "-1",
                                          label: "End survey",
                                      }
                            }
                            options={[
                                ...parsedQuestions
                                    .slice(
                                        parsedQuestions.findIndex(
                                            (q) => q.id === question.id,
                                        ) + 1,
                                    )
                                    .map((q) => {
                                        return {
                                            value: q.id,
                                            label: q.label
                                                ? `${q.orderNumber}- ${q.label} `
                                                : `${q.orderNumber}- Empty Question`,
                                        };
                                    }),
                                {
                                    value: "-1",
                                    label: "End survey",
                                },
                            ]}
                            onchange={(value) => {
                                updateQuestionMutation({
                                    settings: {
                                        ...question.settings,
                                        logic: [
                                            ...question.settings.logic.filter(
                                                (l) => l.id !== logic.id,
                                            ),
                                            {
                                                ...logic,
                                                destination: value?.value,
                                            },
                                        ],
                                    },
                                });
                                setIsCreatingLogic(false);
                            }}
                        />
                    </div>
                </div>
                <div
                    className="absolute -right-2.5 bottom-[50%] translate-y-1/2 cursor-pointer"
                    onClick={() =>
                        updateQuestionMutation({
                            settings: {
                                ...question.settings,
                                logic: question.settings.logic.filter(
                                    (l) => l.id !== logic.id,
                                ),
                            },
                        })
                    }
                >
                    <MinusIcon />
                </div>
            </div>
        </>
    );
};
