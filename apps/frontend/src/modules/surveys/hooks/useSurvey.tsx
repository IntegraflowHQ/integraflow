import {
    ProjectTheme,
    SurveyQuestion,
    SurveyStatusEnum,
    SurveyTypeEnum,
    SurveyUpdateInput,
    User,
    useGetSurveyQuery,
    useSurveyCreateMutation,
    useSurveyUpdateMutation,
} from "@/generated/graphql";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { ROUTES } from "@/routes";
import { generateRandomString, parseQuestion } from "@/utils";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const useSurvey = () => {
    const { orgSlug, projectSlug, surveySlug } = useParams();
    const { user } = useCurrentUser();
    const navigate = useNavigate();

    const [createSurveyMutation, { loading: loadingCreateSurvey }] = useSurveyCreateMutation();
    const [updateSurveyMutation] = useSurveyUpdateMutation();

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
            .map(({ node: question }) => parseQuestion(question as SurveyQuestion));
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
                navigate(ROUTES.SURVEY_LIST.replace(":orgSlug", orgSlug!).replace(":projectSlug", projectSlug!));
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

    const updateSurvey = async (input: SurveyUpdateInput, newTheme?: Partial<ProjectTheme>) => {
        if (!surveyId || !user || !survey) return;

        await updateSurveyMutation({
            variables: {
                id: surveyId,
                input: {
                    ...input,
                    themeId: input.themeId,
                    settings: JSON.stringify(input?.settings ?? {}),
                },
            },
            optimisticResponse: {
                __typename: "Mutation",
                surveyUpdate: {
                    __typename: "SurveyUpdate",
                    survey: {
                        __typename: "Survey",
                        id: surveyId,
                        name: input.name ?? survey?.survey?.name,
                        reference: survey?.survey?.reference ?? "",
                        type: input.type ?? survey?.survey?.type ?? SurveyTypeEnum.Survey,
                        status: input.status ?? survey.survey?.status ?? SurveyStatusEnum.Draft,
                        slug: input.slug ?? surveySlug ?? "",
                        questions: survey?.survey?.questions ?? {
                            __typename: "SurveyQuestionCountableConnection",
                            edges: [],
                        },
                        channels: survey?.survey?.channels ?? {
                            __typename: "SurveyChannelCountableConnection",
                            edges: [],
                        },
                        createdAt: survey?.survey?.createdAt ?? new Date().toISOString(),
                        updatedAt: new Date().toISOString(),

                        creator: survey?.survey?.creator ?? (user as User),
                        theme: (newTheme as ProjectTheme) ?? survey?.survey?.theme,
                        settings: input.settings ?? survey?.survey?.settings ?? null,
                    },
                    surveyErrors: [],
                    errors: [],
                },
            },
            update: (cache, { data }) => {
                if (!data?.surveyUpdate?.survey) return;

                cache.modify({
                    id: cache.identify(survey),
                    fields: {
                        survey(existingSurvey = {}) {
                            return {
                                ...existingSurvey,
                                edges: [...existingSurvey.edges],
                            };
                        },
                    },
                });
            },
        });
    };

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
