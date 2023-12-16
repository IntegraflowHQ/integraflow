import { useGetSurveyListQuery } from "@/generated/graphql";
import useWorkspace from "@/modules/workspace/hooks/useWorkspace";

export const useSurveyList = () => {
    const { workspace } = useWorkspace();

    const {
        data: surveyList,
        loading,
        error,
    } = useGetSurveyListQuery({
        variables: {
            first: 20,
        },
        notifyOnNetworkStatusChange: true,
        context: {
            headers: {
                Project: workspace?.project.id,
            },
        },
    });

    return {
        surveyList,
        loading,
        error,
    };
};
