import { useSurveyDeleteMutation } from "@generated/graphql";
import { useSurvey } from "./useSurvey";

export const useDeleteSurvey = () => {
    const { survey } = useSurvey();
    const [deleteSurveyMutation] = useSurveyDeleteMutation();
};
