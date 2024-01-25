import { SurveyQuestion } from "@/generated/graphql";
import { TabHeader } from "./TabHeader";
import { BooleanSettings } from "./attributes/SettingsField/BooleanSettings";
import { CTASettings } from "./attributes/SettingsField/CTASettings";
import { ChoiceSettings } from "./attributes/SettingsField/ChoiceSettings";
import { FormSettings } from "./attributes/SettingsField/FormSettings";
import { RangeSettings } from "./attributes/SettingsField/RangeSettings";
import { TextSettings } from "./attributes/SettingsField/TextSettings";

type Props = {
    question: SurveyQuestion;
    questionIndex: number;
};

export const SettingsTab = ({ question, questionIndex }: Props) => {
    return (
        <div className="space-y-3 text-sm">
            <TabHeader question={question} questionIndex={questionIndex} />
            <div className="space-y-3">
                <CTASettings question={question} />
                <BooleanSettings question={question} />
                <RangeSettings question={question} />
                <TextSettings question={question} />
                <FormSettings question={question} />
                <ChoiceSettings question={question} />
            </div>
        </div>
    );
};
