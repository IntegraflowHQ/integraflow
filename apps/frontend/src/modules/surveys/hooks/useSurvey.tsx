import {
    useGetSurveyLazyQuery,
    useSurveyCreateMutation,
} from "@/generated/graphql";
import { ROUTES } from "@/routes";
import { ParsedQuestion } from "@/types";
import { generateRandomString } from "@/utils";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const useSurvey = () => {
    const { orgSlug, projectSlug, surveySlug } = useParams();

    const navigate = useNavigate();
    const [createSurveyMutation] = useSurveyCreateMutation();

    const [getSurveyQuery, { data: survey, loading }] = useGetSurveyLazyQuery();

    const parsedQuestions = useMemo(() => {
        const questions = survey?.survey?.questions?.edges || [];

        return questions
            .sort((a, b) => a.node.orderNumber - b.node.orderNumber)
            .map(({ node: question }) => {
                let parsedSettings = question.settings ?? {};
                let parsedOptions = question.options ?? [];

                if (typeof parsedSettings === "string") {
                    parsedSettings = JSON.parse(parsedSettings);
                }

                if (typeof parsedOptions === "string") {
                    parsedOptions = JSON.parse(parsedOptions);
                }

                return {
                    ...question,
                    settings: parsedSettings,
                    options: parsedOptions,
                } as ParsedQuestion;
            });
    }, [survey]);

    useEffect(() => {
        const getSurvey = async () => {
            if (!surveySlug) return;
            await getSurveyQuery({
                variables: {
                    slug: surveySlug,
                },
            });
        };
        getSurvey();
    }, [surveySlug]);

    const createSurvey = async () => {
        const surveySlug = `survey-${generateRandomString(10)}`;
        navigate(
            ROUTES.STUDIO.replace(":orgSlug", orgSlug!)
                .replace(":projectSlug", projectSlug!)
                .replace(":surveySlug", surveySlug),
        );
        const surveyId = crypto.randomUUID();

        await createSurveyMutation({
            variables: {
                input: {
                    id: surveyId,
                    slug: surveySlug,
                },
            },
            onError: () => {
                navigate(
                    ROUTES.SURVEY_LIST.replace(":orgSlug", orgSlug!).replace(
                        ":projectSlug",
                        projectSlug!,
                    ),
                );
            },
        });
    };

    return {
        createSurvey,
        surveySlug,
        survey,
        loading,
        parsedQuestions,
        getSurveyQuery,
    };
};
