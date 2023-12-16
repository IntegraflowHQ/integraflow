import { SelectInput, Switch } from "@/ui";
import { EditorTextInput } from "../components/EditorTextInput";
import { SurveyQuestion } from "@/generated/graphql";

type Props = {
    questionType: string;
    question: SurveyQuestion;
};

export const SettingsTab = ({ questionType , question}: Props) => {
    return (
        <div className="space-y-3">
            <div className="rounded bg-[#272138] p-3">
                <Switch label="Submit button" />
            </div>
            <div className="rounded bg-[#272138] p-3">
                <Switch label="Require answer to comment field(s)" />
            </div>
            <div className="rounded bg-[#272138] p-3">
                <Switch label="Randomize answers" />
            </div>
            <div className="rounded bg-[#272138] p-3">
                <Switch label="Randomize except last" />
            </div>
            <div className="rounded bg-[#272138] p-3">
                <Switch label="Answer required" />
            </div>
            <div className="rounded bg-[#272138] p-3">
                <Switch label="Consent checkbox" />
            </div>
            <div className="rounded bg-[#272138] p-3">
                <Switch label="Show Disclaimer" />
            </div>
            <EditorTextInput
                label={"Disclaimer content"}
                placeholder="Type in your disclaimer here"
            />
            <SelectInput
                defaultValue=""
                options={[]}
                title="Number of answers"
            />
            <EditorTextInput
                label={"Text on the very left"}
                placeholder="Text on the very left"
            />
            <EditorTextInput
                label={"Text on the very right"}
                placeholder="Text on the very right"
            />
            <EditorTextInput
                label={"Positive text"}
                placeholder="Positive text"
            />
            <EditorTextInput
                label={"Negative text"}
                placeholder="Negative text"
            />
            <EditorTextInput
                label={"Consent Label"}
                placeholder="Type in consent label here"
            />
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
