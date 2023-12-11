import {
    SurveyQuestionTypeEnum,
} from "@/generated/graphql";
import { useSurveyStore } from "@/modules/surveys/states/survey";
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/ui";
import { cn } from "@/utils";
import { createSelectors } from "@/utils/selectors";
import { questionTypes } from "@/utils/survey";
import { PlusCircle } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { surveyTypes } from "../../../../../Templates";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    setCurrentQuestionType: Dispatch<
        SetStateAction<SurveyQuestionTypeEnum | undefined>
    >;
}

export const QuestionOptions = ({
    ...props
}: Props) => {
    const [currentView, setCurrentView] = useState<string>("Welcome message");
    const {  clear } = useSurveyStore();
    const surveyStore = createSelectors(useSurveyStore);
    const questions = surveyStore.use.questions();
    const {createQuestion} = useSurvey()

    const handleCreateQuestion = async (type: SurveyQuestionTypeEnum) => {

        if (type) {
            createQuestion(type)
        } else {
            clear();
        }
    };

    return (
        <div className={"flex gap-2"}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="flex items-center gap-2 px-[12px] py-[12px]">
                        <PlusCircle />
                        <span className="w-max text-base font-normal">
                            {questions.length > 0
                                ? "Add your next question"
                                : "Add your first question"}
                        </span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" alignOffset={-50}>
                    <div
                        {...props}
                        className="flex max-w-[40rem] overflow-y-auto rounded-lg bg-intg-bg-9"
                    >
                        <div className="w-[50%] p-2">
                            {questionTypes.map((questionType) => (
                                <DropdownMenuItem
                                    key={questionType.name}
                                    className="flex items-center gap-4 rounded-lg p-3.5 text-intg-text hover:bg-intg-bg-10"
                                    onClick={() =>
                                        handleCreateQuestion(questionType.type)
                                    }
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
                                </DropdownMenuItem>
                            ))}
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
                </DropdownMenuContent>
            </DropdownMenu>
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
    );
};
