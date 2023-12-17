import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { Switch } from "@/ui";
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
                            <Switch label="Show Disclaimer" />
                        </div>
                        <EditorTextInput
                            label={"Disclaimer content"}
                            placeholder="Type in your disclaimer here"
                        />
                    </div>
                    <div>
                        <div className="rounded bg-[#272138] p-3">
                            <Switch label="Consent checkbox" />
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
