import { SurveyQuestion } from "@/generated/graphql";
import { TabHeader } from "./TabHeader";
import { CTAFields } from "./attributes/EditFields/CTAFields";
import { FormFieldList } from "./attributes/EditFields/FormFieldList";
import { OptionsList } from "./attributes/EditFields/OptionsList";
import { RatingFields } from "./attributes/EditFields/RatingFields";

type Props = {
    orderNumber?: number;
    question: SurveyQuestion;
    questionIndex: number;
};

export const EditTab = ({ question, questionIndex }: Props) => {
    return (
        <div className="space-y-3">
            <TabHeader question={question} questionIndex={questionIndex} />

            <CTAFields question={question} />

            <RatingFields question={question} />

            <OptionsList question={question} />

            <FormFieldList question={question} />
        </div>
    );
};
