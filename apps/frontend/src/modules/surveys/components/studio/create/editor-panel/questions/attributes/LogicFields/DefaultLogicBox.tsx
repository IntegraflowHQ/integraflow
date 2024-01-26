import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { getLogicConditions, getLogicOperator } from "@/utils/defaultOptions";
import * as Slider from "@radix-ui/react-slider";
import { LogicValues } from "../../LogicTab";
import { ReactSelect } from "../ReactSelect";

type Props = {
    question: SurveyQuestion;
    logicValues: LogicValues;
    isCreatingLogic: boolean;
    setLogicValues: React.Dispatch<React.SetStateAction<LogicValues>>;
    setIsCreatingLogic: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DefaultLogicBox = ({
    question,
    setLogicValues,
    logicValues,
    setIsCreatingLogic,
    isCreatingLogic,
}: Props) => {
    const { parsedQuestions } = useSurvey();
    const { updateQuestionMutation } = useQuestion();

    return (
        <>
            {isCreatingLogic && (
                <div className="relative space-y-6 rounded-md border border-intg-bg-4 p-6">
                    <div className="flex justify-between">
                        <p>If answer</p>
                        <div className="w-[330px]">
                            <ReactSelect
                                options={getLogicConditions(question.type)}
                                onchange={(value) => {
                                    if (
                                        (logicValues.values &&
                                            logicValues.values.length > 0) ||
                                        logicValues.destination
                                    ) {
                                        return setLogicValues({
                                            ...logicValues,
                                            condition: value.value,
                                            values: [],
                                            operator: "",
                                            destination: "",
                                        });
                                    } else {
                                        return setLogicValues({
                                            ...logicValues,
                                            condition: value?.value,
                                            operator: getLogicOperator(
                                                value?.value,
                                            ),
                                        });
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {logicValues.condition === "between" && (
                        <Slider.Root
                            className="SliderRoot w-200 relative flex h-20 touch-none select-none items-center"
                            defaultValue={[5, 6]}
                            max={question.options?.length - 1}
                            step={1}
                            onValueChange={(value) => {
                                console.log(value);
                            }}
                        >
                            <Slider.Track className="SliderTrack relative h-3 flex-grow rounded-full bg-red-500">
                                <Slider.Range className="SliderRange absolute h-full rounded-full bg-white" />
                            </Slider.Track>
                            <Slider.Thumb
                                className="SliderThumb block h-6 w-6 rounded-full bg-white shadow-md"
                                aria-label="Volume"
                            />
                            <Slider.Thumb
                                className="SliderThumb block h-6 w-6 rounded-full bg-white shadow-md"
                                aria-label="Volume"
                            />
                        </Slider.Root>
                    )}

                    {logicValues.condition &&
                    logicValues.condition !== "not_answered" &&
                    logicValues.condition !== "any_value" &&
                    logicValues.condition !== "answered" &&
                    logicValues.condition !== "is_false" &&
                    logicValues.condition !== "is_true" ? (
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
                                    // defaultValue={}
                                    onchange={(value) => {
                                        setLogicValues({
                                            ...logicValues,
                                            values: value?.map((v) => v.value),
                                        });
                                    }}
                                    value={
                                        logicValues.values &&
                                        logicValues.values.map((v) => {
                                            return {
                                                value: v,
                                                label: question.options?.find(
                                                    (o) => o.id === v,
                                                )?.label,
                                            };
                                        })
                                    }
                                />
                            </div>
                        </div>
                    ) : null}

                    {(logicValues.values && logicValues.values.length > 0) ||
                    logicValues.condition === "not_answered" ||
                    logicValues.condition === "any_value" ||
                    logicValues.condition === "answered" ||
                    logicValues.condition === "is_false" ||
                    logicValues.condition === "is_true" ? (
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
                                                    ...question.settings.logic,
                                                    {
                                                        ...logicValues,
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
                    ) : null}
                    <div
                        className="absolute -right-2.5 bottom-[50%] translate-y-1/2 cursor-pointer"
                        onClick={() => {
                            setIsCreatingLogic(false);
                            setLogicValues({
                                id: "",
                                condition: "",
                                values: undefined,
                                operator: "",
                                destination: "",
                                orderNumber: undefined,
                            });
                        }}
                    >
                        <MinusIcon />
                    </div>
                </div>
            )}
        </>
    );
};
