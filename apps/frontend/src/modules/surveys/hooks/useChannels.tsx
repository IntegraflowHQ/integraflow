import {
    SurveyChannelCreateInput,
    SurveyChannelTypeEnum,
    useChannelsQuery,
    useSurveyChannelCreateMutation,
} from "@/generated/graphql";
import useWorkspaceState from "@/modules/workspace/hooks/useWorkspaceState";
import { createSelectors } from "@/utils/selectors";
import { gql } from "@apollo/client";
import { useSurveyStore } from "../states/survey";

export default function useChannels() {
    const surveyStore = createSelectors(useSurveyStore);
    const surveyId = surveyStore.use.id();
    const { workspace } = useWorkspaceState();

    const context = {
        headers: {
            Project: workspace?.project.id,
        },
    };

    const { data: channels, loading } = useChannelsQuery({
        variables: { surveyId },
        context,
    });

    const [createChannelMutation] = useSurveyChannelCreateMutation();
    const createChannel = async (
        input: Omit<SurveyChannelCreateInput, "surveyId">,
    ) => {
        await createChannelMutation({
            variables: {
                input: {
                    ...input,
                    surveyId,
                },
            },
            context,
            optimisticResponse: {
                __typename: "Mutation",
                surveyChannelCreate: {
                    __typename: "SurveyChannelCreate",
                    surveyChannel: {
                        __typename: "SurveyChannel",
                        id: "temp-id",
                        reference: input.id,
                        type: input.type ?? SurveyChannelTypeEnum.InApp,
                        triggers: null,
                        conditions: null,
                        settings: null,
                        createdAt: new Date().toISOString(),
                    },
                    surveyErrors: [],
                    errors: [],
                },
            },
            update: (cache, { data }) => {
                if (!data?.surveyChannelCreate?.surveyChannel) return;
                cache.modify({
                    fields: {
                        channels(existingChannels = []) {
                            console.log("existingChannels: ", existingChannels);
                            const newChannelRef = cache.writeFragment({
                                data: data?.surveyChannelCreate?.surveyChannel,
                                fragment: gql`
                                    fragment NewChannel on SurveyChannel {
                                        id
                                        reference
                                        type
                                        triggers
                                        conditions
                                        settings
                                        createdAt
                                    }
                                `,
                            });
                            return {
                                __typeName: "SurveyChannelCountableConnection",
                                edges: [
                                    ...existingChannels.edges,
                                    {
                                        __typename:
                                            "SurveyChannelCountableEdge",
                                        node: newChannelRef,
                                    },
                                ],
                            };
                        },
                    },
                });
            },
        });
    };

    return {
        loading,
        channels,
        createChannel,
    };
}
