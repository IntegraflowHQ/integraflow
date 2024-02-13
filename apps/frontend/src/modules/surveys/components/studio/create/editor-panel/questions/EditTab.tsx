import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { recallOptions } from "@/utils/question";
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

export const EditTab = ({ questionIndex }: Props) => {
    const { parsedQuestions } = useSurvey();
    const { openQuestion } = useQuestion();
    console.log(recallOptions(parsedQuestions, openQuestion!));
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
