import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { surveyTypes } from "@/modules/surveys/components/Templates";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { CTAType } from "@/types";
import { Button } from "@/ui";
import { cn } from "@/utils";
import { getDefaultValues } from "@/utils/question/defaultOptions";
import { questionTypes } from "@/utils/survey";
import { PlusCircle } from "lucide-react";
import { RefObject, useEffect, useRef, useState } from "react";
import { useScrollToBottom } from "react-scroll-to-bottom";

export const QuestionOptions = () => {
    const [currentView, setCurrentView] = useState<string>("Welcome message");
    const [showQuestionTypes, setShowQuestionTypes] = useState<boolean>(false);
    const { parsedQuestions } = useSurvey();
    const [welcomeMessageExists, setWelcomeMessageExists] = useState(false);
    const [thankYouMessageExists, setThankYouMessageExists] = useState(false);
    const { createQuestion } = useQuestion();
    const questionTypesRef: RefObject<HTMLDivElement> = useRef(null);

    useEffect(() => {
        const welcomeMessage = parsedQuestions.find((question) => question.settings?.type === CTAType.NEXT);
        const thankYouMessage = parsedQuestions.find((question) =>
            [CTAType.CLOSE, CTAType.LINK, CTAType.HIDDEN].includes(question.settings?.type as CTAType),
        );
        setWelcomeMessageExists(!!welcomeMessage);
        setThankYouMessageExists(!!thankYouMessage);

        const handleClickOutside = (event: MouseEvent) => {
            if (questionTypesRef.current && !questionTypesRef.current.contains(event.target as Node)) {
                setShowQuestionTypes(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [parsedQuestions]);

    const scrollToBottom = useScrollToBottom();

    const handleCreateQuestion = async (type: SurveyQuestionTypeEnum, id: string) => {
        const options = getDefaultValues(type);

        if (id === "welcome") {
            createQuestion({
                type,
                ...options,
                settings: {
                    ...options.settings,
                    text: "Submit",
                    type: CTAType.NEXT,
                },
            });
            setWelcomeMessageExists(true);
        } else if (id === "thankyou") {
            createQuestion({
                type,
                ...options,
                settings: {
                    ...options.settings,
                    type: CTAType.CLOSE,
                    text: "Submit",
                },
            });
            setThankYouMessageExists(true);
        } else {
            createQuestion({ type, ...options });
        }
    };

    return (
        <div className="space-y-2" ref={questionTypesRef}>
            <div className="flex gap-2">
                <Button
                    className="flex items-center gap-2 px-[12px] py-[12px]"
                    onClick={() => {
                        setShowQuestionTypes(!showQuestionTypes);
                        scrollToBottom({ behavior: "smooth" });
                    }}
                >
                    <PlusCircle />
                    <span className="w-max text-base font-normal">
                        {parsedQuestions.length > 0 ? "Add your next question" : "Add your first question"}
                    </span>
                </Button>
                <Button className="flex items-center gap-2 px-[12px] py-[12px]" variant="secondary">
                    <PlusCircle />
                    <span className="w-max text-base font-normal">Add question from library</span>
                </Button>
            </div>

            {showQuestionTypes && (
                <div className="flex max-w-[40rem] overflow-y-auto rounded-lg bg-intg-bg-9">
                    <div className="w-[50%] p-2">
                        {questionTypes.map((questionType) => {
                            if (thankYouMessageExists && questionType.id === "thankyou") return null;
                            if (welcomeMessageExists && questionType.id === "welcome") return null;

                            return (
                                <div
                                    key={questionType.name}
                                    className="flex items-center gap-4 rounded-lg p-3.5 text-intg-text hover:bg-intg-bg-10"
                                    onClick={() => {
                                        handleCreateQuestion(questionType.type, questionType.id);
                                        setShowQuestionTypes(!showQuestionTypes);
                                    }}
                                    onMouseEnter={() => setCurrentView(questionType.name)}
                                >
                                    <img src={questionType.icon} alt={questionType.name} className="h-4 w-4" />
                                    <span className="text-sm font-medium">{questionType.name}</span>
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
                                    `${surveyType.title === currentView ? "block" : "hidden"} mr-3 mt-[2rem] space-y-4`,
                                )}
                            >
                                <div className="flex h-[196px] items-end justify-center rounded-[9.455px] bg-[#261F36]">
                                    <img src={surveyType.image} alt="survey" className="block" />
                                </div>
                                <div className="max-w-[300px] space-y-2 text-xs">
                                    <p className="font-bold">{surveyType.title}</p>
                                    <p>{surveyType.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
