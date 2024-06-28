"use client";

import { parsedSurveys } from "@/utils";
import _Integraflow, { Survey } from "integraflow-js";
import { useEffect, useRef, useState } from "react";

const DASHBOARD_ORIGIN = process.env.NEXT_PUBLIC_DASHBOARD_ORIGIN || "*";

export default function Preview() {
    const [viewPort, setViewPort] = useState<"desktop" | "mobile">();
    const [bg, setBg] = useState<"sdk" | "link">();

    const initialized = useRef(false);
    const survey = useRef<Survey | null>(null);
    const startFrom = useRef<string>();
    const mode = useRef<"sdk" | "link">();

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === "survey") {
                setViewPort(event.data.viewPort);
                startFrom.current = event.data.startFrom;
                survey.current = parsedSurveys(event.data.survey, {
                    mode: mode.current,
                    backgroundImage: `${window.origin}/images/preview-bg.svg`
                })[0];

                if (!initialized.current && survey.current) {
                    _Integraflow
                        .init({
                            surveys: [survey.current],
                            syncPolicy: "off",
                            fullScreen: mode.current === "link",
                            onSurveyClosed: () => {
                                const timeoutId = setTimeout(() => {
                                    if (!survey.current) {
                                        return;
                                    }
                                    _Integraflow.getClient().showSurvey(survey.current.id);
                                }, 500);

                                return () => {
                                    clearTimeout(timeoutId);
                                };
                            }
                        })
                        .showSurvey(survey.current.id, event.data.startFrom);

                    initialized.current = true;
                }

                if (initialized.current && survey.current) {
                    _Integraflow.getClient().updateSurvey(survey.current, event.data.startFrom);
                }
            }

            if (event.data && event.data.type === "mode") {
                if (survey.current && initialized.current) {
                    _Integraflow.getClient().closeSurvey(survey.current.id);
                }

                mode.current = event.data.mode;
                setBg(event.data.mode);

                initialized.current = false;

                window.parent.postMessage({ status: "requestSurvey" }, DASHBOARD_ORIGIN);
            }
        };

        window.addEventListener("message", handleMessage);

        window.parent.postMessage(
            {
                status: "ready"
            },
            DASHBOARD_ORIGIN
        );

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return (
        <>
            <style>
                {`
                    body {
                        height: 100vh;
                        ${
                            bg === "link"
                                ? "background-position: top center; background-image: url(/images/preview-bg.svg); background-size: cover;"
                                : ""
                        }
                        ${
                            bg === "sdk" && viewPort === "desktop"
                                ? `background-image: url(/images/desktop-view.png); background-size: cover;`
                                : ""
                        }
                        ${
                            bg === "sdk" && viewPort === "mobile"
                                ? `background-image: url(/images/mobile-view.svg); background-color: white; background-size: contain`
                                : ""
                        }
                        background-repeat: no-repeat;
                    }
                `}
            </style>
        </>
    );
}
