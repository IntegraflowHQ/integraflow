import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { Header } from "@/ui";
import { cn } from "@/utils";
import EmptySurvey from "assets/images/surveys/empty.png";
import { createRef, useEffect, useState } from "react";

const LINK_SURVEY_HOST = import.meta.env.VITE_LINK_SURVEY_HOST;

export const Preview = () => {
    const [ready, setReady] = useState(false);
    const iframe = createRef<HTMLIFrameElement>();
    const { parsedQuestions, survey } = useSurvey();
    const { question } = useQuestion();

    useEffect(() => {
        if (!ready || !iframe.current || !survey || parsedQuestions.length === 0) {
            return;
        }

        iframe.current.contentWindow?.postMessage(
            {
                type: "survey",
                survey: {
                    ...survey.survey,
                    questions: parsedQuestions,
                    channels: survey?.survey?.channels.edges.map((edge) => edge.node),
                },
                startFrom: question ? question.id : undefined,
            },
            LINK_SURVEY_HOST ?? "*",
        );
    }, [parsedQuestions, ready, survey, question]);

    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data && e.data.status === "ready") {
                setReady(true);
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return (
        <>
            <iframe
                src={`${LINK_SURVEY_HOST}/preview`}
                className={cn("h-full w-full rounded-xl bg-intg-bg-9", parsedQuestions.length === 0 ? "hidden" : "")}
                title="Survey preview"
                ref={iframe}
            />
            {parsedQuestions.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center rounded-xl bg-intg-bg-9">
                    <div className="space-y-8">
                        <img src={EmptySurvey} alt="" />
                        <Header
                            title="Nothing to see here yet."
                            description="Add your first question first!"
                            className="text-center"
                        />
                    </div>
                </div>
            )}
        </>
    );
};
