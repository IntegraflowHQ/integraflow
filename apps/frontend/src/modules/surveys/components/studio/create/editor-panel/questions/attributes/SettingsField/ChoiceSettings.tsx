import { SurveyQuestion } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { SelectInput, SwitchButton } from "@/ui";

type Props = {
    question: SurveyQuestion;
};

export const ChoiceSettings = ({ question }: Props) => {
    const { updateQuestionMutation } = useQuestion();
    return (
        <>
            <div className="rounded bg-[#272138] p-3">
                <SwitchButton label="Randomize answers"  />
            </div>
            <div className="rounded bg-[#272138] p-3">
                <SwitchButton label="Randomize except last" />
            </div>
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
        </>
    );
};
