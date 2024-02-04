import {
    SurveyUpdateInput,
    useGetSurveyQuery,
    useSurveyCreateMutation,
    useSurveyUpdateMutation,
} from "@/generated/graphql";
import { ROUTES } from "@/routes";
import { ParsedQuestion } from "@/types";
import { generateRandomString } from "@/utils";
import { useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const useSurvey = () => {
    const { orgSlug, projectSlug, surveySlug } = useParams();
    const navigate = useNavigate();

    const [createSurveyMutation, { loading: loadingCreateSurvey }] =
        useSurveyCreateMutation();

    const [surveyUpdateMutation] = useSurveyUpdateMutation();

    const { data: survey } = useGetSurveyQuery({
        variables: {
            slug: surveySlug,
        },
    });

    const surveyId = survey?.survey?.id;

    const parsedQuestions = useMemo(() => {
        const questions = survey?.survey?.questions?.edges || [];

        return [...questions]
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

    const createSurvey = async () => {
        const surveySlug = `survey-${generateRandomString(10)}`;

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
            onCompleted() {
                navigate(
                    ROUTES.STUDIO.replace(":orgSlug", orgSlug!)
                        .replace(":projectSlug", projectSlug!)
                        .replace(":surveySlug", surveySlug),
                );
            },
        });
    };

    const updateSurvey = useCallback(
        async (id: string, input: SurveyUpdateInput) => {
            await surveyUpdateMutation({
                variables: {
                    id,
                    input,
                },
            });
        },
        [surveyUpdateMutation],
    );

    return {
        createSurvey,
        updateSurvey,
        surveySlug,
        survey,
        parsedQuestions,
        loadingCreateSurvey,
        surveyId,
    };
};
