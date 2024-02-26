import { TabHeader } from "./TabHeader";
import { CTAFields } from "./attributes/EditFields/CTAFields";
import { FormFieldList } from "./attributes/EditFields/FormFieldList";
import { OptionsList } from "./attributes/EditFields/OptionsList";
import { RatingFields } from "./attributes/EditFields/RatingFields";

type Props = {
    questionIndex: number;
};

export const EditTab = ({ questionIndex }: Props) => {
    return (
        <div className="space-y-3">
            <TabHeader questionIndex={questionIndex} />
            <CTAFields />
            <RatingFields />
            <OptionsList />
            <FormFieldList />
        </div>
    );
};
