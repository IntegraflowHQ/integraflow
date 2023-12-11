import { addEllipsis, cn } from "@/utils";
import * as Accordion from "@radix-ui/react-accordion";
import { useState } from "react";
import { QuestionOptions } from "./attributes/Options";

import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useSurveyStore } from "@/modules/surveys/states/survey";
import { createSelectors } from "@/utils/selectors";
import { QuestionPanel } from "./QuestionPanel";

export default function UpdateQuestion() {
    const { questions } = useSurveyStore();
    const surveyStore = createSelectors(useSurveyStore);
    const openQuestion = surveyStore.use.openQuestion();
    const { setOpenQuestion } = useSurveyStore();

    const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);
    const [currentQuestionType, setCurrentQuestionType] = useState<
        SurveyQuestionTypeEnum | undefined
    >();
    // const [openQuestion, setOpenquestion] = useState("");

    return (
        <div className="h-full w-full space-y-4 pt-2">
            <div className={cn(`${isAddingQuestion ? "block" : "hidden"}`)}>
                <Accordion.Root
                    type="single"
                    collapsible={true}
                    value={openQuestion}
                    className="space-y-4"
                >
                    {questions.map((item) => {
                        console.log("item:", item);
                        return (
                            <Accordion.Item value={item.id}>
                                <Accordion.Header>
                                    <Accordion.Trigger
                                        className={cn(
                                            ` ${
                                                openQuestion === item.id
                                                    ? "hidden"
                                                    : "block"
                                            } text-intg-text-7" flex w-full items-center justify-between gap-2 rounded-lg bg-intg-bg-9 p-4`,
                                        )}
                                        onClick={() => setOpenQuestion(item.id)}
                                    >
                                        <div>❤️</div>
                                        <div className="text-intg-text-9 font-bold">
                                            {item.orderNumber < 10
                                                ? `0${item.orderNumber}`
                                                : item.orderNumber}
                                        </div>
                                        <div className="bg-intg-bg-15 w-[415px] rounded-lg px-[16px] py-4 text-start text-intg-text-1 ">
                                            {addEllipsis(
                                                "Lorem ipsum dolor sit, ametconsectetur adipisicing elit.",
                                                40,
                                            )}
                                        </div>
                                    </Accordion.Trigger>
                                </Accordion.Header>
                                <Accordion.Content>
                                    <QuestionPanel
                                        currentQuestionType={
                                            currentQuestionType
                                        }
                                    />
                                </Accordion.Content>
                            </Accordion.Item>
                        );
                    })}
                </Accordion.Root>
            </div>
            <QuestionOptions
                setIsAddingQuestion={setIsAddingQuestion}
                setCurrentQuestionType={setCurrentQuestionType}
            />
        </div>
    );
}
