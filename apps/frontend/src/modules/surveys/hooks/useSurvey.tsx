import { useSurveyCreateMutation } from "@/generated/graphql";
import { ROUTES } from "@/routes";
import { generateRandomString } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useSurveyStore } from "../states/survey";

export const useSurvey = () => {
    const navigate = useNavigate();
    const { addSurveyDetails } = useSurveyStore();
    const [createSurveyMutation] = useSurveyCreateMutation();
    const { orgSlug, projectSlug } = useParams();

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
            onCompleted: ({ surveyCreate }) => {
                addSurveyDetails({
                    id: surveyCreate?.survey?.id as string,
                    slug: surveyCreate?.survey?.slug as string,
                });
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
    };
};
