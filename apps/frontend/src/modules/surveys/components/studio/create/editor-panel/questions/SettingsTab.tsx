import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { SelectInput, SwitchButton } from "@/ui";
import { EditorTextInput } from "../components/EditorTextInput";
import { TabHeader } from "./TabHeader";
import { ReactSelect } from "./attributes/ReactSelect";

const CTAThankyouOptions = [
    {
        label: "Link",
        value: "link",
    },
    {
        label: "Hide",
        value: "hidden",
    },
    {
        label: "Close",
        value: "close",
    },
];

type Props = {
    question: SurveyQuestion;
};

export const SettingsTab = ({ question }: Props) => {
    return (
        <div className="space-y-3 text-sm">
            <TabHeader question={question} />
            {question.type === SurveyQuestionTypeEnum.SmileyScale ? (
                <>
                    <EditorTextInput
                        label={"Positive text"}
                        placeholder="Positive text"
                    />
                    <EditorTextInput
                        label={"Negative text"}
                        placeholder="Negative text"
                    />
                </>
            ) : null}
            {question.type === SurveyQuestionTypeEnum.Rating ||
            question.type === SurveyQuestionTypeEnum.Nps ||
            question.type === SurveyQuestionTypeEnum.SmileyScale ||
            question.type ? (
                <>
                    <EditorTextInput
                        label={"Text on the very left"}
                        placeholder="Text on the very left"
                    />
                    <EditorTextInput
                        label={"Text on the very right"}
                        placeholder="Text on the very right"
                    />
                </>
            ) : null}
            {question.type === SurveyQuestionTypeEnum.Form ? (
                // DISCLAIMER
                <>
                    <div>
                        <div className="rounded bg-[#272138] p-3">
                            <SwitchButton label="Show Disclaimer" />
                        </div>
                        <EditorTextInput
                            label={"Disclaimer content"}
                            placeholder="Type in your disclaimer here"
                        />
                    </div>
                    <div>
                        <div className="rounded bg-[#272138] p-3">
                            <SwitchButton label="Consent checkbox" />
                        </div>
                        <EditorTextInput
                            label={"Consent Label"}
                            placeholder="Type in consent label here"
                        />
                    </div>
                </>
            ) : null}
            {question.type === SurveyQuestionTypeEnum.Single ||
            question.type === SurveyQuestionTypeEnum.Multiple ? (
                <>
                    <div className="rounded bg-[#272138] p-3">
                        <SwitchButton label="Randomize answers" />
                    </div>
                    <div className="rounded bg-[#272138] p-3">
                        <SwitchButton label="Randomize except last" />
                    </div>
                </>
            ) : null}
            {question.type === SurveyQuestionTypeEnum.SmileyScale ? (
                <>
                    <SelectInput
                        defaultValue=""
                        options={[]}
                        title="Number of answers"
                    />
                </>
            ) : null}
            <SelectInput
                defaultValue=""
                options={[]}
                title="Number of answers"
            />
            <div className="rounded bg-[#272138] p-3">
                <SwitchButton label="Answer required" />
            </div>

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
            {/* Thankyou CTA */}
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <p>Call to action</p>
                    <div className="w-[330px]">
                        <ReactSelect
                            options={CTAThankyouOptions}
                            onChange={(value) => {
                                console.log(value);
                            }}
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
            </div>
        </div>
    );
};
