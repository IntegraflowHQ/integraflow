import { parsedSurveys } from "@/utils";
import { useEffect, useState } from "react";

const DASHBOARD_ORIGIN = process.env.NEXT_PUBLIC_DASHBOARD_ORIGIN || "*";

export default function Preview() {
    const [survey, setSurvey] = useState<any>();
    const [startFrom, setStartFrom] = useState();

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === "survey") {
                setSurvey(parsedSurveys(event.data.survey)[0]);
                setStartFrom(event.data.startFrom);
            }
        };

        window.addEventListener("message", handleMessage);

        window.parent.postMessage(
            {
                status: "ready",
            },
            DASHBOARD_ORIGIN,
        );

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    useEffect(() => {
        const initSurvey = async () => {
            if (!survey) {
                return;
            }

            const Integraflow = (await import("@integraflow/web")).default;
            const intg = Integraflow.init({
                surveys: [survey],
                syncPolicy: "off",
                onSurveyClosed: () => {
                    const timeoutId = setTimeout(() => {
                        intg.showSurvey(survey.id, startFrom);
                    }, 500);

                    return () => {
                        clearTimeout(timeoutId);
                    };
                },
            });

            intg.showSurvey(survey.id, startFrom);
        };

        initSurvey();

        return () => {
            const closeSurvey = async () => {
                if (!survey) {
                    return;
                }

                const Integraflow = (await import("@integraflow/web")).default;
                const intg = Integraflow.init({
                    surveys: [survey],
                    syncPolicy: "off",
                });

                intg.closeSurvey(survey?.id);
            };

            closeSurvey();
        };
    }, [survey, startFrom]);

    return (
        <style>{`
        body {
            background-color: #181325;
        }
    `}</style>
    );
}
``;
