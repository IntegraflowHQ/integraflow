import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { SelectInput } from "@/ui";
import { formOptions } from "@/utils/survey";
import { FormField, FormFieldType } from "@integraflow/web/src/types";
import { EditorTextInput } from "../../../components/EditorTextInput";
import MinusButton from "../Buttons/MinimizeButton";
import { MoreButton } from "../Buttons/MoreButton";
import { StarBtn } from "../Buttons/StarBtn";
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
                        {JSON.parse(question.options).map(
                            (option: FormField) => {
                                return (
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <MoreButton />
                                            <div className="grid flex-1 grid-cols-2 gap-2">
                                                <SelectInput
                                                    options={formOptions}
                                                    value={option.type}
                                                    defaultValue={option.type}
                                                    onChange={(value) => {
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
                                                        ].type =
                                                            value.target.value;
                                                        newOptions[
                                                            editedOption
                                                        ].label =
                                                            formOptions.find(
                                                                (item) =>
                                                                    item.value ===
                                                                    value.target
                                                                        .value,
                                                            )?.label;

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
                                                <EditorTextInput
                                                    showCharacterCount={false}
                                                    value={option.label ?? ""}
                                                    onChange={(e) => {
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
                                                        ].label =
                                                            e.target.value;
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
                                            </div>
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

                                            <StarBtn
                                                color={
                                                    option.required
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
                                                    ].required =
                                                        !newOptions[
                                                            editedOption
                                                        ].required;
                                                    updateQuestionMutation({
                                                        options: JSON.stringify(
                                                            newOptions,
                                                            null,
                                                            2,
                                                        ),
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
                                                orderNumber:
                                                    higestOrderNumber + 1,
                                                label: "",
                                                type: "",
                                                required: false,
                                            },
                                        ],
                                        null,
                                        2,
                                    ),
                                });
                            }}
                        />
                    </>
                ) : null)}
        </>
    );
};
