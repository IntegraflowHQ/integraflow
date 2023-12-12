import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { SelectInput, SwitchButton } from "@/ui";
import { EditorTextInput } from "../components/EditorTextInput";

type Props = {
    questionType: string;
    question: SurveyQuestion;
};

export const SettingsTab = ({ questionType, question }: Props) => {
    return (
        <div className="space-y-3">
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
            {question.type === SurveyQuestionTypeEnum.Rating ? (
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
        </div>
    );
};
