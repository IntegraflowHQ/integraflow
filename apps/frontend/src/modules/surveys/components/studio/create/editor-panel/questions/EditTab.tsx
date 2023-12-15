import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { formOptions } from "@/utils/survey";
import { FormFieldType } from "@integraflow/web/src/types";
import { useEffect } from "react";
import { TabHeader } from "./TabHeader";
import { CTAFields } from "./attributes/EditFields/CTAFields";
import { FormFieldList } from "./attributes/EditFields/FormFieldList";
import { OptionsList } from "./attributes/EditFields/OptionsList";

type Props = {
    orderNumber?: number;
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

const defaultOptions = [
    {
        id: 1,
        orderNumber: 1,
        label: "Answer 1",
        comment: "false",
    },
    {
        id: 2,
        orderNumber: 2,
        label: "Answer 2",
        comment: "false",
    },
];

const defaultFormOptions = [
    {
        id: 1,
        orderNumber: 1,
        label: formOptions[2].label,
        type: formOptions[2].value,
        required: false,
    },
    {
        id: 2,
        orderNumber: 2,
        label: formOptions[1].label,
        type: formOptions[1].value,
        required: false,
    },
];

export const EditTab = ({ question }: Props) => {
    const { updateQuestionMutation, currentQuestion } = useQuestion();

    useEffect(() => {
        if (
            (currentQuestion?.node.type === SurveyQuestionTypeEnum.Single ||
                currentQuestion?.node.type ===
                    SurveyQuestionTypeEnum.Multiple ||
                currentQuestion?.node.type ===
                    SurveyQuestionTypeEnum.Dropdown) &&
            (!currentQuestion.node.options ||
                JSON.parse(currentQuestion?.node.options).length === 0)
        ) {
            updateQuestionMutation({
                options: JSON.stringify(defaultOptions, null, 2),
            });
        }
        if (
            currentQuestion?.node.type === SurveyQuestionTypeEnum.Form &&
            (!currentQuestion.node.options ||
                JSON.parse(currentQuestion?.node.options).length === 0)
        ) {
            updateQuestionMutation({
                options: JSON.stringify(defaultFormOptions, null, 2),
            });
        }
    }, [currentQuestion]);
    console.log(currentQuestion?.node.options);

    return (
        <div className="space-y-6">
            <TabHeader question={question} />
            <CTAFields />

            <OptionsList question={question} />

            <FormFieldList question={question} />
        </div>
    );
};
