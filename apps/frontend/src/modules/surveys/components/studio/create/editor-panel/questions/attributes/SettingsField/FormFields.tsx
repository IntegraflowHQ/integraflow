import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { SwitchButton } from "@/ui";
import { EditorTextInput } from "../../../components/EditorTextInput";

type Props = {
    question: SurveyQuestion;
};

export const FormFields = ({ question }: Props) => {
    return (
        <div>
            {question.type === SurveyQuestionTypeEnum.Form ? (
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
        </div>
    );
};
