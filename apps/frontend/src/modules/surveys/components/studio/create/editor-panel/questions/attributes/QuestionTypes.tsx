import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { Button } from "@/ui";
import { cn } from "@/utils";
import { questionTypes } from "@/utils/survey";
import { CTAType } from "@integraflow/web/src/types";
import { PlusCircle } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import ScrollToBottom, { useScrollToBottom } from "react-scroll-to-bottom";
import { getDefaultValues } from "../../../../../../../../utils/defaultOptions";
import { surveyTypes } from "../../../../../Templates";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    setCurrentQuestionType: Dispatch<
        SetStateAction<SurveyQuestionTypeEnum | undefined>
    >;
}

export const QuestionOptions = ({
    setCurrentQuestionType,
    ...props
}: Props) => {
    const [currentView, setCurrentView] = useState<string>("Welcome message");
    const [showQuestionTypes, setShowQuestionTypes] = useState<boolean>(false);
    const { parsedQuestions } = useSurvey();
    const {
        createQuestionMutation,
        welcomeMessageExists,
        thankYouMessageExists,
        setThankYouMessageExists,
        setWelcomeMessageExists,
    } = useQuestion();
    const scrollToBottom = useScrollToBottom();

    const handleCreateQuestion = async (
        type: SurveyQuestionTypeEnum,
        id: string,
    ) => {
        setCurrentQuestionType(type);
        const options = getDefaultValues(type);

        if (id === "welcome") {
            createQuestionMutation({
                type,
                ...options,
                settings: {
                    ...options.settings,
                    text: "",
                    type: CTAType.NEXT,
                },
            });
            setWelcomeMessageExists(true);
        } else if (id === "thankyou") {
            createQuestionMutation({
                type,
                ...options,
                settings: {
                    ...options.settings,
                    type: CTAType.CLOSE,
                    text: "",
                },
            });
            setThankYouMessageExists(true);
        } else {
            createQuestionMutation({ type, ...options });
        }
    };

    return (
        <ScrollToBottom className="space-y-2">
            <div className="flex gap-2">
                <Button
                    className="flex items-center gap-2 px-[12px] py-[12px]"
                    onClick={() => {
                        setShowQuestionTypes(!showQuestionTypes);
                        scrollToBottom();
                    }}
                >
                    <PlusCircle />
                    <span className="w-max text-base font-normal">
                        {parsedQuestions.length > 0
                            ? "Add your next question"
                            : "Add your first question"}
                    </span>
                </Button>
                <Button
                    className="flex items-center gap-2 px-[12px] py-[12px]"
                    variant="secondary"
                >
                    <PlusCircle />
                    <span className="w-max text-base font-normal">
                        Add question from library
                    </span>
                </Button>
            </div>
            {showQuestionTypes && (
                <div
                    {...props}
                    className="flex max-w-[40rem] overflow-y-auto rounded-lg bg-intg-bg-9"
                >
                    <div className="w-[50%] p-2">
                        {questionTypes.map((questionType) => {
                            if (
                                thankYouMessageExists &&
                                questionType.id === "thankyou"
                            )
                                return null;
                            if (
                                welcomeMessageExists &&
                                questionType.id === "welcome"
                            )
                                return null;

                            return (
                                <div
                                    key={questionType.name}
                                    className={cn(
                                        thankYouMessageExists ? "" : "",
                                        welcomeMessageExists ? "" : "",
                                        "flex items-center gap-4 rounded-lg p-3.5 text-intg-text hover:bg-intg-bg-10",
                                    )}
                                    onClick={() => {
                                        handleCreateQuestion(
                                            questionType.type,
                                            questionType.id,
                                        );
                                        setShowQuestionTypes(
                                            !showQuestionTypes,
                                        );
                                    }}
                                    onMouseEnter={() =>
                                        setCurrentView(questionType.name)
                                    }
                                >
                                    <img
                                        src={questionType.icon}
                                        alt={questionType.name}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm font-medium">
                                        {questionType.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <hr className="h-full border-[.1px] border-intg-bg-4" />
                    </div>
                    <div className={cn(`w-[50%] p-2 text-intg-text`)}>
                        {surveyTypes.map((surveyType) => (
                            <div
                                key={surveyType.title}
                                className={cn(
                                    `${
                                        surveyType.title === currentView
                                            ? "block"
                                            : "hidden"
                                    } mr-3 mt-[2rem] space-y-4`,
                                )}
                            >
                                <div className="flex h-[196px] items-end justify-center rounded-[9.455px] bg-[#261F36]">
                                    <img
                                        src={surveyType.image}
                                        alt="survey"
                                        className="block"
                                    />
                                </div>
                                <div className="max-w-[300px] space-y-2 text-xs">
                                    <p className="font-bold">
                                        {surveyType.title}
                                    </p>
                                    <p>{surveyType.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </ScrollToBottom>
    );
};
