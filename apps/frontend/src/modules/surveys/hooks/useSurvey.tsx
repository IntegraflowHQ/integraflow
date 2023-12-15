import {
    useGetSurveyLazyQuery,
    useSurveyCreateMutation,
} from "@/generated/graphql";
import { ROUTES } from "@/routes";
import { generateRandomString } from "@/utils";
import { createSelectors } from "@/utils/selectors";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSurveyStore } from "../states/survey";

export const useSurvey = () => {
    const { orgSlug, projectSlug, surveySlug } = useParams();
    const navigate = useNavigate();

    const surveyStore = createSelectors(useSurveyStore);
    const setOpenQuestion = surveyStore.use.setOpenQuestion();
    const [createSurveyMutation] = useSurveyCreateMutation();
    const openQuestion = surveyStore.use.openQuestion();

    const [getSurveyQuery, { data: survey }] = useGetSurveyLazyQuery();
    const questions = survey?.survey?.questions?.edges || [];
    const currentQuestion = questions.find(
        (question) => question?.node?.id === openQuestion,
    );

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

    const createSurvey = async (_template?: string) => {
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
        questions,
        surveySlug,
        setOpenQuestion,
        openQuestion,
        currentQuestion,
    };
};
