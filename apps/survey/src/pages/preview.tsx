import { parsedSurveys } from "@/utils";
import { useEffect, useState } from "react";

const DASHBOARD_ORIGIN = process.env.NEXT_PUBLIC_DASHBOARD_ORIGIN || "*";

export default function Preview() {
    const [survey, setSurvey] = useState<any>();
    const [startFrom, setStartFrom] = useState();
    const [mode, setMode] = useState<"sdk" | "link">();
    const [viewPort, setViewPort] = useState<"desktop" | "mobile">();

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === "survey") {
                setStartFrom(event.data.startFrom);
                setMode(event.data.mode);
                setViewPort(event.data.viewPort);
                setSurvey(
                    parsedSurveys(event.data.survey, {
                        mode: event.data.mode,
                        backgroundImage: `${window.origin}/images/preview-bg.svg`,
                    })[0],
                );
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

            const Integraflow = (await import("integraflow-js")).default;
            const intg = Integraflow.init({
                surveys: [survey],
                syncPolicy: "off",
                fullScreen: mode === "link",
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

                const Integraflow = (await import("integraflow-js")).default;
                const intg = Integraflow.init({
                    surveys: [survey],
                    syncPolicy: "off",
                    fullScreen: mode === "link",
                });

                intg.closeSurvey(survey?.id);
            };

            closeSurvey();
        };
    }, [survey, startFrom, mode]);

    return (
        <style>{`
        body {
            height: 100vh;
            ${mode === "sdk" && viewPort === "desktop" ? `background-image: url(/images/desktop-view.png); background-size: cover;` : ""}
            ${mode === "sdk" && viewPort === "mobile" ? `background-image: url(/images/mobile-view.svg); background-color: white; background-size: contain` : ""}
            background-repeat: no-repeat;
            ${mode === "link" ? "background-position: top center; background-image: url(/images/preview-bg.svg); background-size: cover;" : ""}
        }
    `}</style>
    );
}
``;
