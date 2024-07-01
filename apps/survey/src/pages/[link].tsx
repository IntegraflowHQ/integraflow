import CTA from "@/components/CTA";
import { parsedSurveys } from "@/utils";
import { IntegraflowClient } from "@integraflow/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const apiUrl = process.env.INTEGRAFLOW_API_URL;
const apiHost = process.env.NEXT_PUBLIC_INTEGRAFLOW_API_HOST;

const inter = Inter({ subsets: ["latin"] });

export default function Home({ surveys, appKey }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [completed, setCompleted] = useState(false);
    const [intg, setIntg] = useState<any>();

    useEffect(() => {
        const initSurvey = async () => {
            if (surveys.length === 0) {
                return;
            }

            const Integraflow = (await import("integraflow-js")).default;
            if (!intg) {
                const intg = Integraflow.init({
                    surveys,
                    syncPolicy: "manual",
                    appKey,
                    apiHost,
                    fullScreen: true,
                    onSurveyCompleted: () => {
                        setCompleted(true);
                    },
                });

                setIntg(intg);
            }
        };

        initSurvey();

        return () => {
            setIntg(undefined);
        };
    }, [surveys]);

    useEffect(() => {
        if (surveys.length === 0 || !intg) {
            return;
        }

        intg.showSurvey(surveys[0].id);

        return () => {
            if (surveys.length === 0 || !intg) {
                return;
            }

            intg.closeSurvey(surveys[0].id);
        };
    }, [surveys, intg]);

    if (surveys.length === 0) {
        return (
            <CTA
                title="Uh-oh! This survey is currently unavailable 😔"
                description="Don't let that stop you! Create your own survey in just a few clicks."
            />
        );
    }
    if (completed) {
        return <CTA title="Survey completed" description="Thank you for taking the time to complete this survey." />;
    }

    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between bg-white p-24 text-black ${inter.className}`}
        />
    );
}

export const getServerSideProps: GetServerSideProps<{ surveys: any[]; appKey: string }> = async (context) => {
    const { link } = context.params as { link: string };
    const client = new IntegraflowClient({ apiUrl });
    const survey = await client.surveyByChannel({ link });
    const surveys = parsedSurveys(survey, { mode: "link", backgroundImage: "/images/preview-bg.svg", link });

    return {
        props: {
            surveys: surveys as any[],
            appKey: survey?.project?.apiToken ?? "",
        },
    };
};
