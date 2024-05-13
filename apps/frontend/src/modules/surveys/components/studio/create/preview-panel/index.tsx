import { ProjectTheme, SurveyChannelCountableEdge } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { useStudioStore } from "@/modules/surveys/states/studio";
import { PreviewMode, ViewPortType } from "@/types";
import { Header } from "@/ui";
import { cn, parseTheme } from "@/utils";
import EmptySurvey from "assets/images/surveys/empty.png";
import { IframeHTMLAttributes, createRef, useEffect, useState } from "react";

const LINK_SURVEY_HOST = import.meta.env.VITE_LINK_SURVEY_HOST;

interface Props extends IframeHTMLAttributes<HTMLIFrameElement> {
    mode?: PreviewMode;
    viewPort?: ViewPortType;
}

export const Preview = ({ className, mode, viewPort, ...props }: Props) => {
    const [ready, setReady] = useState(false);
    const iframe = createRef<HTMLIFrameElement>();
    const { parsedQuestions, survey } = useSurvey();
    const { question } = useQuestion();
    const { theme, updateStudio } = useStudioStore((state) => state);

    useEffect(() => {
        if (survey?.theme) {
            updateStudio({ theme: parseTheme(survey.theme as ProjectTheme) });
        } else {
            updateStudio({ theme: null });
        }
    }, [survey?.theme?.id, survey?.theme?.colorScheme]);

    useEffect(() => {
        if (!ready || !iframe.current || !survey || parsedQuestions.length === 0) {
            return;
        }

        iframe.current.contentWindow?.postMessage(
            {
                type: "survey",
                survey: {
                    ...survey,
                    theme: theme ? { ...theme, colorScheme: JSON.stringify(theme.colorScheme) } : {},
                    questions: parsedQuestions.map((q) => {
                        if (q.id === question?.id) {
                            return question;
                        }
                        return q;
                    }),
                    channels: survey?.channels.edges.map(
                        (edge: Omit<SurveyChannelCountableEdge, "cursor">) => edge.node,
                    ),
                },
                startFrom: question ? question.id : undefined,
                mode,
                viewPort,
            },
            LINK_SURVEY_HOST ?? "*",
        );
    }, [parsedQuestions, ready, survey, question, theme, mode, viewPort]);

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
                className={cn(
                    "h-full w-full rounded-xl bg-intg-bg-9",
                    className ?? "",
                    parsedQuestions.length === 0 ? "hidden" : "",
                )}
                title="Survey preview"
                ref={iframe}
                {...props}
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
