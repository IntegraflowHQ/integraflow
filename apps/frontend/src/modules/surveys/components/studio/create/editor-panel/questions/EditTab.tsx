import { SurveyQuestion } from "@/generated/graphql";
import { TabHeader } from "./TabHeader";
import { CTAFields } from "./attributes/EditFields/CTAFields";
import { FormFieldList } from "./attributes/EditFields/FormFieldList";
import { OptionsList } from "./attributes/EditFields/OptionsList";
import { RatingFields } from "./attributes/EditFields/RatingFields";

type Props = {
    orderNumber?: number;
    question: SurveyQuestion;
};

export const EditTab = ({ question }: Props) => {
    return (
        <div className="space-y-3">
            <TabHeader question={question} />

            <CTAFields question={question} />
            <RatingFields question={question} />

            <OptionsList question={question} />

            <FormFieldList question={question} />
        </div>
    );
};
