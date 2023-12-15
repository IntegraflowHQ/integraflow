import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { SelectInput } from "@/ui";
type Props = {
    question: SurveyQuestion;
};

export const Multiple = ({ question }: Props) => {
    return (
        <div>
            {question.type === SurveyQuestionTypeEnum.Multiple && (
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <p className="text-sm">Selection limit Range</p>
                        <SelectInput defaultValue="" options={[]} />
                    </div>
                    <div>
                        <p className="text-sm">Min</p>
                        <SelectInput defaultValue="" options={[]} />
                    </div>
                    <div>
                        <p className="text-sm">Max</p>
                        <SelectInput defaultValue="" options={[]} />
                    </div>
                </div>
            )}
        </div>
    );
};
