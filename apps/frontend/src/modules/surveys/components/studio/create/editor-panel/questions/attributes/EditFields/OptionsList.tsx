import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { cn } from "@/utils";
import { FormFieldType, QuestionOption } from "@integraflow/web/src/types";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { AddMultipleQuestions } from "../AddMultipleQuestions";
import { CommentButton } from "../Buttons/CommentButton";
import MinusButton from "../Buttons/MinimizeButton";
import { MoreButton } from "../Buttons/MoreButton";
import TextButton from "../Buttons/TextButton";

type Props = {
    question: SurveyQuestion;
};

type ParsedOptions = {
    id: number;
    orderNumber: number;
    label: string;
    comment?: string;
    required?: boolean;
    type?: FormFieldType;
};

export const OptionsList = ({ question }: Props) => {
    const { updateQuestionMutation } = useQuestion();
    return (
        <>
            {question.type === SurveyQuestionTypeEnum.Single ||
            question.type === SurveyQuestionTypeEnum.Multiple ||
            question.type === SurveyQuestionTypeEnum.Dropdown ? (
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <p>Answer Choices</p>
                        <AddMultipleQuestions
                            getValue={(value) => {
                                // Check all orderNumber and look for the highest one
                                const higestOrderNumber = JSON.parse(
                                    question.options,
                                ).reduce((prev: number, current: any) => {
                                    return prev > current.orderNumber
                                        ? prev
                                        : current.orderNumber;
                                }, 0);

                                const jsonData = value.map((label, index) => ({
                                    id: higestOrderNumber + index + 1,
                                    orderNumber: higestOrderNumber + index + 1,
                                    label: label,
                                    comment: "false",
                                }));

                                updateQuestionMutation({
                                    options: JSON.stringify(jsonData, null, 2),
                                });
                            }}
                        />
                    </div>
                    {question.options ? (
                        <div className="space-y-4">
                            {JSON.parse(question.options).map(
                                (option: QuestionOption) => (
                                    <div
                                        key={option.id}
                                        className="flex items-center gap-2"
                                    >
                                        <MoreButton />
                                        <EditorTextInput
                                            value={option.label || ""}
                                            onChange={(e) => {
                                                const editedOption = JSON.parse(
                                                    question.options,
                                                ).findIndex(
                                                    (item: ParsedOptions) =>
                                                        item.id === option.id,
                                                );
                                                const newOptions = JSON.parse(
                                                    question.options,
                                                );
                                                newOptions[editedOption].label =
                                                    e.target.value;
                                                updateQuestionMutation({
                                                    options: JSON.stringify(
                                                        newOptions,
                                                        null,
                                                        2,
                                                    ),
                                                });
                                            }}
                                        />
                                        <div
                                            className={cn(
                                                `${
                                                    question.type ===
                                                    SurveyQuestionTypeEnum.Dropdown
                                                        ? "hidden "
                                                        : "block"
                                                } flex`,
                                            )}
                                        >
                                            <CommentButton
                                                color={
                                                    option.comment === "true"
                                                        ? "active"
                                                        : "default"
                                                }
                                                onClick={() => {
                                                    const editedOption =
                                                        JSON.parse(
                                                            question.options,
                                                        ).findIndex(
                                                            (
                                                                item: ParsedOptions,
                                                            ) =>
                                                                item.id ===
                                                                option.id,
                                                        );
                                                    const newOptions =
                                                        JSON.parse(
                                                            question.options,
                                                        );
                                                    newOptions[
                                                        editedOption
                                                    ].comment =
                                                        newOptions[editedOption]
                                                            .comment === "true"
                                                            ? "false"
                                                            : "true";
                                                    updateQuestionMutation({
                                                        options: JSON.stringify(
                                                            newOptions,
                                                            null,
                                                            2,
                                                        ),
                                                    });
                                                }}
                                            />

                                            {JSON.parse(question.options)
                                                .length < 3 ? null : (
                                                <MinusButton
                                                    onclick={() => {
                                                        const editedOption =
                                                            JSON.parse(
                                                                question.options,
                                                            ).findIndex(
                                                                (
                                                                    item: ParsedOptions,
                                                                ) =>
                                                                    item.id ===
                                                                    option.id,
                                                            );
                                                        const newOptions =
                                                            JSON.parse(
                                                                question.options,
                                                            );
                                                        newOptions.splice(
                                                            editedOption,
                                                            1,
                                                        );
                                                        updateQuestionMutation({
                                                            options:
                                                                JSON.stringify(
                                                                    newOptions,
                                                                    null,
                                                                    2,
                                                                ),
                                                        });
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    ) : null}

                    <TextButton
                        text={"Add an answer at choice"}
                        onclick={() => {
                            const higestOrderNumber = JSON.parse(
                                question.options,
                            ).reduce((prev: number, current: any) => {
                                return prev > current.orderNumber
                                    ? prev
                                    : current.orderNumber;
                            }, 0);
                            updateQuestionMutation({
                                options: JSON.stringify(
                                    [
                                        ...JSON.parse(question.options),
                                        {
                                            id: higestOrderNumber + 1,
                                            orderNumber: higestOrderNumber + 1,
                                            label: "",
                                            comment: "false",
                                        },
                                    ],
                                    null,
                                    2,
                                ),
                            });
                        }}
                    />
                </div>
            ) : null}
        </>
    );
};
