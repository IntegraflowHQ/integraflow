import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { cn, generateUniqueId, getHighestOrderNumber } from "@/utils";
import { FormFieldType } from "@integraflow/web/src/types";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { AddMultipleQuestions } from "../AddMultipleQuestions";
import { CommentButton } from "../Buttons/CommentButton";
import MinusButton from "../Buttons/MinimizeButton";
import { MoreButton } from "../Buttons/MoreButton";
import TextButton from "../Buttons/TextButton";

type DefaultOption = {
    id: number;
    orderNumber: number;
    label: string;
    comment?: string;
    required?: boolean;
    type?: FormFieldType;
};

export const OptionsList = () => {
    const { updateQuestionMutation, openQuestion } = useQuestion();

    return (
        <div>
            {openQuestion?.type === SurveyQuestionTypeEnum.Single ||
            openQuestion?.type === SurveyQuestionTypeEnum.Multiple ||
            openQuestion?.type === SurveyQuestionTypeEnum.Dropdown ? (
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <p>Answer Choices</p>
                        <AddMultipleQuestions
                            questionOptions={openQuestion?.options}
                        />
                    </div>

                    {openQuestion?.options ? (
                        <div className="space-y-4">
                            {openQuestion?.options.map(
                                (option: DefaultOption, index: number) => (
                                    <div
                                        key={option.id}
                                        className="flex items-center gap-2"
                                    >
                                        <MoreButton />
                                        <EditorTextInput
                                            defaultValue={option.label}
                                            onChange={(e) => {
                                                const newOptions =
                                                    openQuestion?.options;
                                                newOptions[index].label =
                                                    e.target.value;

                                                updateQuestionMutation({
                                                    options: newOptions,
                                                });
                                            }}
                                            characterCount={
                                                openQuestion?.options[index]
                                                    .label.length
                                            }
                                        />
                                        <div
                                            className={cn(
                                                `${
                                                    openQuestion?.type ===
                                                    SurveyQuestionTypeEnum.Dropdown
                                                        ? "hidden "
                                                        : "block"
                                                } flex`,
                                            )}
                                        >
                                            <CommentButton
                                                color={
                                                    option.comment
                                                        ? "active"
                                                        : "default"
                                                }
                                                onClick={() => {
                                                    const newOptions =
                                                        openQuestion?.options;

                                                    newOptions[index].comment =
                                                        !option.comment;

                                                    updateQuestionMutation({
                                                        options: newOptions,
                                                    });
                                                }}
                                            />
                                        </div>

                                        {openQuestion?.options.length <
                                        3 ? null : (
                                            <MinusButton
                                                onclick={() => {
                                                    const newOptions =
                                                        openQuestion?.options;
                                                    newOptions.splice(index, 1);
                                                    updateQuestionMutation({
                                                        options: newOptions,
                                                    });
                                                }}
                                            />
                                        )}
                                    </div>
                                ),
                            )}
                        </div>
                    ) : null}

                    <TextButton
                        text={"Add an answer at choice"}
                        onclick={() => {
                            const highestOrderNumber = getHighestOrderNumber(
                                openQuestion?.options,
                            );
                            const newOptions = openQuestion?.options;
                            newOptions.push({
                                id: generateUniqueId(),
                                orderNumber: highestOrderNumber + 1,
                                label: "",
                                comment: false,
                            });
                            updateQuestionMutation({
                                options: newOptions,
                            });
                        }}
                    />
                </div>
            ) : null}
        </div>
    );
};
