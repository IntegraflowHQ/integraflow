import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { SelectInput } from "@/ui";

type Props = {
    question: SurveyQuestion;
};

export const SmileyFields = ({ question }: Props) => {
    return (
        <div>
            {question.type === SurveyQuestionTypeEnum.SmileyScale ? (
                <>
                    <SelectInput
                        defaultValue=""
                        options={[]}
                        title="Number of answers"
                    />
                </>
            ) : null}
        </div>
    );
};
