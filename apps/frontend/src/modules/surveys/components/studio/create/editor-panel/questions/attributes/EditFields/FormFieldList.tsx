import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { getHighestOrderNumber } from "@/utils";
import { formOptions } from "@/utils/survey";
import { FormField } from "@integraflow/web/src/types";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { MoreButton } from "../Buttons/MoreButton";
import { StarBtn } from "../Buttons/StarBtn";
import TextButton from "../Buttons/TextButton";
import { ReactSelect } from "../ReactSelect";

type Props = {
    question: SurveyQuestion;
};

export const FormFieldList = ({ question }: Props) => {
    const { updateQuestionMutation } = useQuestion();
    return (
        <>
            {question.type === SurveyQuestionTypeEnum.Form &&
                (question.options ? (
                    <>
                        <div className="flex justify-between">
                            <p className="flex-1 text-sm">Form Type</p>
                            <p className="flex-1 text-sm">Label</p>
                        </div>
                        {question.options.map(
                            (option: FormField, index: number) => {
                                return (
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <MoreButton />
                                            <div className=" grid flex-1 grid-cols-2 items-center gap-2">
                                                <ReactSelect
                                                    options={formOptions}
                                                    defaultValue={
                                                        question.options[index]
                                                    }
                                                    onchange={(value) => {
                                                        const newOptions =
                                                            question.options;
                                                        newOptions[index].type =
                                                            value?.value;
                                                        newOptions[
                                                            index
                                                        ].label = value?.label;

                                                        updateQuestionMutation({
                                                            options: newOptions,
                                                        });
                                                    }}
                                                />
                                                <EditorTextInput
                                                    showCharacterCount={false}
                                                    value={option.label ?? ""}
                                                    onChange={(e) => {
                                                        const newOptions =
                                                            question.options;
                                                        newOptions[
                                                            index
                                                        ].label =
                                                            e.target.value;
                                                        updateQuestionMutation({
                                                            options: newOptions,
                                                        });
                                                    }}
                                                />
                                            </div>

                                            <StarBtn
                                                color={
                                                    option.required
                                                        ? "active"
                                                        : "default"
                                                }
                                                onClick={() => {
                                                    const newOptions =
                                                        question.options;
                                                    newOptions[index].required =
                                                        !option.required;
                                                    updateQuestionMutation({
                                                        options: newOptions,
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            },
                        )}
                        <TextButton
                            text={"Add next field"}
                            onclick={() => {
                                const highestOrderNumber =
                                    getHighestOrderNumber(question.options);
                                const newOptions = question.options;
                                newOptions.push({
                                    id: highestOrderNumber + 1,
                                    orderNumber: highestOrderNumber + 1,
                                    label: formOptions[0].label,
                                    type: formOptions[0].value,
                                    required: false,
                                });
                                updateQuestionMutation({
                                    options: newOptions,
                                });
                            }}
                        />
                    </>
                ) : null)}
        </>
    );
};
