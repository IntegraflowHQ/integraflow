import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { generateUniqueId, getHighestOrderNumber } from "@/utils";
import { formOptions } from "@/utils/survey";
import { FormField } from "@integraflow/web/src/types";
import { SingleValue } from "react-select";
import { EditorTextInput } from "../../../components/EditorTextInput";
import MinusButton from "../Buttons/MinimizeButton";
import { MoreButton } from "../Buttons/MoreButton";
import { StarBtn } from "../Buttons/StarBtn";
import TextButton from "../Buttons/TextButton";
import { Option, ReactSelect } from "../ReactSelect";

export const FormFieldList = () => {
    const { updateQuestionMutation, openQuestion } = useQuestion();
    return (
        <>
            {openQuestion?.type === SurveyQuestionTypeEnum.Form &&
                (openQuestion.options.length > 1 && openQuestion?.options ? (
                    <>
                        <div className="flex justify-between">
                            <p className="flex-1 text-sm">Form Type</p>
                            <p className="flex-1 text-sm">Label</p>
                        </div>
                        {openQuestion?.options.map(
                            (option: FormField, index: number) => {
                                return (
                                    <div key={option.id}>
                                        <div className="flex items-center justify-between">
                                            <MoreButton />
                                            <div className="grid grid-cols-2 items-center gap-2">
                                                <ReactSelect
                                                    options={formOptions}
                                                    defaultValue={
                                                        openQuestion?.options[
                                                            index
                                                        ]
                                                    }
                                                    onchange={(value) => {
                                                        const newOptions =
                                                            openQuestion?.options;
                                                        newOptions[index].type =
                                                            (
                                                                value as SingleValue<Option>
                                                            )?.value;
                                                        newOptions[
                                                            index
                                                        ].label = (
                                                            value as SingleValue<Option>
                                                        )?.label;

                                                        updateQuestionMutation({
                                                            options: newOptions,
                                                        });
                                                    }}
                                                />
                                                <EditorTextInput
                                                    showCharacterCount={false}
                                                    defaultValue={
                                                        option.label ?? ""
                                                    }
                                                    onChange={(e) => {
                                                        const newOptions =
                                                            openQuestion?.options;
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
                                                        openQuestion?.options;
                                                    newOptions[index].required =
                                                        !option.required;
                                                    updateQuestionMutation({
                                                        options: newOptions,
                                                    });
                                                }}
                                            />
                                            {openQuestion?.options.length >
                                            2 ? (
                                                <MinusButton
                                                    onclick={() => {
                                                        const newOptions =
                                                            openQuestion?.options;
                                                        newOptions.splice(
                                                            index,
                                                            1,
                                                        );
                                                        updateQuestionMutation({
                                                            options: newOptions,
                                                        });
                                                    }}
                                                />
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            },
                        )}
                        <TextButton
                            text={"Add next field"}
                            onclick={() => {
                                const highestOrderNumber =
                                    getHighestOrderNumber(
                                        openQuestion?.options,
                                    );
                                const newOptions = openQuestion?.options;
                                newOptions.push({
                                    id: generateUniqueId(),
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
