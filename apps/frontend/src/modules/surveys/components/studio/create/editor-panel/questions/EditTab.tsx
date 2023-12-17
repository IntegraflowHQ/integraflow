import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { formOptions } from "@/utils/survey";
import { FormFieldType } from "@integraflow/web/src/types";
import { useEffect } from "react";
import { TabHeader } from "./TabHeader";
import { CTAFields } from "./attributes/EditFields/CTAFields";
import { FormFieldList } from "./attributes/EditFields/FormFieldList";
import { OptionsList } from "./attributes/EditFields/OptionsList";
import { QuestionOption } from "@/types";

type Props = {
    orderNumber?: number;
    question: SurveyQuestion;
};

const defaultOptions: QuestionOption[] = [
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

const defaultFormOptions: QuestionOption[] = [
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
    const { updateQuestionMutation, openQuestion } = useQuestion();
    console.log(question.options);

    // useEffect(() => {
    //     if (
    //         (openQuestion?.type === SurveyQuestionTypeEnum.Single ||
    //             openQuestion?.type === SurveyQuestionTypeEnum.Multiple ||
    //             openQuestion?.type === SurveyQuestionTypeEnum.Dropdown) &&
    //         (!openQuestion?.options || openQuestion?.options.length === 0)
    //     ) {
    //         updateQuestionMutation({
    //             options: defaultOptions,
    //         });
    //     }
    //     if (
    //         openQuestion?.type === SurveyQuestionTypeEnum.Form &&
    //         (!openQuestion?.options || openQuestion?.options.length === 0)
    //     ) {
    //         updateQuestionMutation({
    //             options: defaultFormOptions,
    //         });
    //     }
    // }, [openQuestion]);

    return (
        <div className="space-y-6">
            <TabHeader question={question} />

            <CTAFields />

            <OptionsList question={question} />

            <FormFieldList question={question} />
        </div>
    );
};
