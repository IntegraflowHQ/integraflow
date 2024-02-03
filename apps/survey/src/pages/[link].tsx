import SurveyCompleted from "@/components/SurveyCompleted";
import { parsedSurveys } from "@/utils";
import { IntegraflowClient } from "@integraflow/sdk";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Error from "next/error";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const apiKey = process.env.INTEGRAFLOW_API_KEY;
const apiUrl = process.env.INTEGRAFLOW_API_URL;
const apiHost = process.env.NEXT_PUBLIC_INTEGRAFLOW_API_HOST;
const appKey = process.env.NEXT_PUBLIC_INTEGRAFLOW_APP_KEY;

const inter = Inter({ subsets: ["latin"] });

export default function Home({
    surveys,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const initSurvey = async () => {
            if (surveys.length === 0) {
                return;
            }

            const Integraflow = (await import("@integraflow/web")).default;
            const intg = Integraflow.init({
                surveys,
                fetchPolicy: "manual",
                appKey,
                apiHost,
                fullScreen: true,
                onSurveyCompleted: () => {
                    setCompleted(true);
                },
            });

            intg.showSurvey(surveys[0].id);
        };

        initSurvey();
    }, []);

    if (surveys.length === 0) {
        return <Error statusCode={404} />;
    }
    if (completed) {
        return <SurveyCompleted />;
    }

    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between bg-white p-24 text-black ${inter.className}`}
        />
    );
}

export const getServerSideProps = (async (context) => {
    const { link } = context.params;
    const client = new IntegraflowClient({ apiKey, apiUrl });
    const survey = await client.surveyByChannel({ link });
    const surveys = parsedSurveys(survey);

    return {
        props: {
            surveys,
        },
    };
}) satisfies GetServerSideProps<{ surveys: any[] }>;
