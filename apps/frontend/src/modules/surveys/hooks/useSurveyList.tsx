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
        // fetchPolicy: "network-only",
    });

    const totalCount = surveyList?.surveys?.totalCount;
    const pageInfo = surveyList?.surveys?.pageInfo;

    const transformedSurveyList = surveyList?.surveys?.edges?.map((edge) => {
        return {
            id: edge?.node?.id,
            slug: edge?.node?.slug,
            status: edge?.node?.status,
            createdAt: edge?.node?.createdAt,
            name: edge?.node?.name ? edge?.node?.name : "Untitled survey",
            creator: {
                email: edge?.node?.creator.email,
                fullName: `${edge?.node?.creator.firstName} ${edge?.node?.creator.lastName}`,
            },
        };
    });

    return {
        error,
        loading,
        pageInfo,
        totalSurveys: totalCount,
        surveyList: transformedSurveyList,
    };
};
