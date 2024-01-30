import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { getLogicConditions, getLogicOperator } from "@/utils/defaultOptions";
import React from "react";
import { MultiValue, SingleValue } from "react-select";
import { LogicValues } from "../../LogicTab";
import MinMaxSelector from "../MinMaxSelector";
import { Option, ReactSelect } from "../ReactSelect";

type Props = {
    question: SurveyQuestion;
    logicValues: LogicValues;
    isCreatingLogic: boolean;
    setLogicValues: React.Dispatch<React.SetStateAction<LogicValues>>;
    setIsCreatingLogic: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DefaultLogicBox: React.FC<Props> = ({
    question,
    logicValues,
    isCreatingLogic,
    setLogicValues,
    setIsCreatingLogic,
}: Props) => {
    const { parsedQuestions } = useSurvey();
    const { updateQuestionMutation } = useQuestion();

    const handleConditionChange = (
        value: SingleValue<Option> | MultiValue<Option>,
    ) => {
        if (
            (logicValues.values && logicValues.values.length > 0) ||
            logicValues.destination
        ) {
            setLogicValues({
                ...logicValues,
                condition: (value as SingleValue<Option>)?.value,
                values: [],
                operator: undefined,
                destination: "",
            });
        } else {
            setLogicValues({
                ...logicValues,
                condition: (value as SingleValue<Option>)?.value,
                operator: getLogicOperator(
                    (value as SingleValue<Option>)?.value,
                ),
            });
        }
    };

    const handleMinChange = (option: any) => {
        const newValues = [...(logicValues.values || [])];
        newValues[0] = option?.value;
        setLogicValues({ ...logicValues, values: newValues });
    };

    const handleMaxChange = (option: any) => {
        const newValues = [...(logicValues.values || [])];
        newValues[1] = option?.value;
        setLogicValues({ ...logicValues, values: newValues });
    };

    const handleFieldSelection = (
        values: SingleValue<Option> | MultiValue<Option>,
    ) => {
        setLogicValues({
            ...logicValues,
            values: (values as MultiValue<Option>).map((v) => v.value),
        });
    };

    const handleDestinationSelection = (value: any) => {
        updateQuestionMutation({
            settings: {
                ...question.settings,
                logic: [
                    ...question.settings.logic,
                    {
                        ...logicValues,
                        destination: value?.value,
                    },
                ],
            },
        });
        setIsCreatingLogic(false);
    };

    const handleCancel = () => {
        setIsCreatingLogic(false);
        setLogicValues({
            id: "",
            condition: "",
            values: undefined,
            operator: undefined,
            destination: "",
            orderNumber: undefined,
        });
    };

    return (
        <>
            {isCreatingLogic && (
                <div className="relative space-y-6 rounded-md border border-intg-bg-4 p-6">
                    <div className="flex justify-between">
                        <p>If answer</p>
                        <div className="w-[330px]">
                            <ReactSelect
                                options={getLogicConditions(question.type)}
                                onchange={handleConditionChange}
                            />
                        </div>
                    </div>
                    {logicValues.condition === "between" && (
                        <div className="flex justify-between">
                            <div></div>
                            <div className="w-[330px]">
                                <MinMaxSelector
                                    options={question.options?.map(
                                        (option: Option) => ({
                                            value: option.id,
                                            label: option.label,
                                        }),
                                    )}
                                    maxChange={handleMaxChange}
                                    minValue={question.options?.find(
                                        (option: Option) =>
                                            option.value ===
                                            logicValues.values?.[0],
                                    )}
                                    maxValue={question.options?.find(
                                        (option: Option) =>
                                            option.value ===
                                            logicValues.values?.[1],
                                    )}
                                    minChange={handleMinChange}
                                />
                            </div>
                        </div>
                    )}

                    {logicValues.condition &&
                        ![
                            "not_answered",
                            "any_value",
                            "answered",
                            "is_false",
                            "between",
                            "is_true",
                        ].includes(logicValues.condition) && (
                            <div className="flex justify-between">
                                <div></div>
                                <div className="w-[330px]">
                                    <ReactSelect
                                        comboBox={true}
                                        options={question.options?.map(
                                            (option: Option) => ({
                                                value: option.id,
                                                label: option.label,
                                            }),
                                        )}
                                        onchange={handleFieldSelection}
                                        value={
                                            logicValues.values &&
                                            logicValues.values.map((v) => ({
                                                value: v,
                                                label: question.options?.find(
                                                    (o: Option) => o.id === v,
                                                )?.label,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        )}

                    {(logicValues.values && logicValues.values.length > 0) ||
                    [
                        "not_answered",
                        "any_value",
                        "answered",
                        "is_false",
                        "is_true",
                    ].includes(logicValues.condition) ? (
                        <div className="flex justify-between gap-14">
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
                                    onchange={handleDestinationSelection}
                                />
                            </div>
                        </div>
                    ) : null}

                    <div
                        className="absolute -right-2.5 bottom-[50%] translate-y-1/2 cursor-pointer"
                        onClick={handleCancel}
                    >
                        <MinusIcon />
                    </div>
                </div>
            )}
        </>
    );
};

export default DefaultLogicBox;
