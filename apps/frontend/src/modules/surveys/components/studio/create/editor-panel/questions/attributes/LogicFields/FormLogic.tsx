import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { QuestionLogic } from "@/types";
import { getLogicConditions } from "@/utils/defaultOptions";
import { PlusIcon } from "lucide-react";
import { SingleValue } from "react-select";
import { Option, ReactSelect } from "../ReactSelect";

type Props = {
    question: SurveyQuestion;
    logic: QuestionLogic;
    setIsCreatingLogic: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FormLogicBox = ({
    question,
    logic,
    setIsCreatingLogic,
}: Props) => {
    const { parsedQuestions } = useSurvey();
    const { updateQuestionMutation } = useQuestion();

    const handleFieldChange = (values: any) => {
        console.log(values);
    };

    const handleConditionChange = (value: any) => {
        updateQuestionMutation({
            settings: {
                ...question.settings,
                logic: [
                    ...question.settings.logic,
                    {
                        condition: value?.value,
                    },
                ],
            },
        });
    };

    const handleDestinationChange = (value: any) => {
        updateQuestionMutation({
            settings: {
                ...question.settings,
                logic: [
                    ...question.settings.logic,
                    {
                        destination: value?.value,
                    },
                ],
            },
        });
        setIsCreatingLogic(false);
    };

    return (
        <div className="relative rounded-md border border-intg-bg-4">
            {logic.groups &&
                logic.groups.map((group) => (
                    <div
                        className="relative space-y-6 p-6"
                        key={`${group.fields[0]}index`}
                    >
                        <div className="flex justify-between">
                            <div></div>
                            <div className="w-[330px]">
                                <ReactSelect
                                    comboBox={true}
                                    options={[
                                        ...(question.options?.map(
                                            (option: SingleValue<Option>) => ({
                                                value: option?.id,
                                                label: option?.label,
                                            }),
                                        ) ?? []),
                                        {
                                            value: 1,
                                            label: "Any field",
                                        },
                                    ]}
                                    defaultValue={
                                        group.fields.length > 0
                                            ? group.fields.map((field) => ({
                                                  value: field,
                                                  label:
                                                      question.options?.find(
                                                          (o: Option) =>
                                                              o.id === field,
                                                      )?.label || "Any field",
                                              }))
                                            : []
                                    }
                                    onchange={handleFieldChange}
                                />
                            </div>
                        </div>

                        {group.fields.length > 0 && (
                            <div className="flex justify-between">
                                <p>If answer</p>
                                <div className="w-[330px]">
                                    <ReactSelect
                                        options={getLogicConditions(
                                            question.type,
                                        )}
                                        defaultValue={getLogicConditions(
                                            question.type,
                                        )?.find(
                                            (c) => c.value === group.condition,
                                        )}
                                        onchange={handleConditionChange}
                                    />
                                </div>
                            </div>
                        )}

                        <div
                            className="absolute bottom-1/2 right-0 translate-x-1/2"
                            onClick={() => {}}
                        >
                            <MinusIcon />
                        </div>
                    </div>
                ))}

            <div className="relative">
                <hr />
                <div className="absolute right-0 translate-x-1/2">
                    <PlusIcon onClick={() => {}} />
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
                                        (q) => q.id === question.id,
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
                        onchange={handleDestinationChange}
                    />
                </div>
            </div>
        </div>
    );
};
