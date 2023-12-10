import React from "react";
import { EditorTextInput } from "../../components/EditorTextInput";

export const MessagesTabContent = () => {
    const [initialInputValues, setInputValues] = React.useState({
        nextQuestion: "",
        surveyInvitation: "",
        mandatoryQuestionsMessage: "",
        dropdownPlaceholder: "",
        surveyCompletionMessage: "",
    });

    const trackInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setInputValues((previousState) => ({
            ...previousState,
            [name]: value,
        }));
    };

    const {
        nextQuestion,
        surveyInvitation,
        mandatoryQuestionsMessage,
        dropdownPlaceholder,
        surveyCompletionMessage,
    } = initialInputValues;

    const getInputCharactersLength = (value: string) => value?.split("").length;

    return (
        <div className="h-full w-full py-2">
            <EditorTextInput
                name="nextQuestion"
                placeholder="Submit"
                label="Proceed to next question"
                onChange={(event) => trackInputChange(event)}
                characterCount={getInputCharactersLength(nextQuestion)}
            />

            <EditorTextInput
                placeholder="Please answer our short survey"
                name="surveyInvitation"
                label="Minimized survey invitation"
                characterCount={getInputCharactersLength(surveyInvitation)}
                onChange={(event) => trackInputChange(event)}
            />

            <EditorTextInput
                placeholder="Answer required"
                name="mandatoryQuestionsMessage"
                label="Message for mandatory questions"
                characterCount={getInputCharactersLength(
                    mandatoryQuestionsMessage,
                )}
                onChange={(event) => trackInputChange(event)}
            />

            <EditorTextInput
                name="dropdownPlaceholder"
                label="Dropdown placeholder"
                placeholder="Type or select an option"
                onChange={(event) => trackInputChange(event)}
                characterCount={getInputCharactersLength(dropdownPlaceholder)}
            />

            <EditorTextInput
                name="surveyCompletionMessage"
                label="Survey completion information"
                placeholder="Thank you for taking part in our survey 🎉"
                onChange={(event) => trackInputChange(event)}
                characterCount={getInputCharactersLength(
                    surveyCompletionMessage,
                )}
            />
        </div>
    );
};
