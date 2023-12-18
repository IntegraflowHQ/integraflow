import { SurveyQuestion } from "@/generated/graphql";
import { TabHeader } from "./TabHeader";
import { BooleanSettings } from "./attributes/SettingsField/BooleanSettings";
import { ChoiceSettings } from "./attributes/SettingsField/ChoiceSettings";
import { FormSettings } from "./attributes/SettingsField/FormSettings";
import { RangeSettings } from "./attributes/SettingsField/RangeSettings";
import { TextSettings } from "./attributes/SettingsField/TextSettings";

type Props = {
    question: SurveyQuestion;
};

export const SettingsTab = ({ question }: Props) => {
    console.log(question.type);

    return (
        <div className="space-y-3 text-sm">
            <TabHeader question={question} />
            <div className="space-y-3">
                <BooleanSettings question={question} />
                <RangeSettings question={question} />
                <TextSettings question={question} />
                <FormSettings question={question} />
                <ChoiceSettings question={question} />
                {/* Thankyou CTA */}
                {/* <div className="space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <p>Call to action</p>
                        <div className="w-[330px]">
                            <ReactSelect
                                options={CTAThankyouOptions}
                                // onChange={(value) => {
                                //     console.log(value);
                                // }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div>Link</div>
                        <div className="w-[330px]">
                            <EditorTextInput />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between gap-4">
                            <p>Button label</p>
                            <div className="w-[330px]">
                                <EditorTextInput />
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};
