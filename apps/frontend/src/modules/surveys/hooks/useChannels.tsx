import {
    SurveyChannelCountableEdge,
    SurveyChannelCreateInput,
    SurveyChannelTypeEnum,
    SurveyChannelUpdateInput,
    useChannelsQuery,
    useSurveyChannelCreateMutation,
    useSurveyChannelUpdateMutation,
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

    const [updateChannelMutation] = useSurveyChannelUpdateMutation();
    const updateChannel = async (
        id: string,
        input: SurveyChannelUpdateInput,
    ) => {
        await updateChannelMutation({
            variables: {
                id,
                input,
            },
            context,
            optimisticResponse: {
                __typename: "Mutation",
                surveyChannelUpdate: {
                    __typename: "SurveyChannelUpdate",
                    surveyChannel: {
                        __typename: "SurveyChannel",
                        id,
                        ...input,
                        type: input.type ?? SurveyChannelTypeEnum.InApp,
                        createdAt: new Date().toISOString(),
                    },
                    surveyErrors: [],
                    errors: [],
                },
            },
            update: (cache, { data }) => {
                if (!data?.surveyChannelUpdate?.surveyChannel) return;
                cache.modify({
                    fields: {
                        channels(existingChannels = []) {
                            const newChannelRef = cache.writeFragment({
                                data: data?.surveyChannelUpdate?.surveyChannel,
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

                            const existingChannelIndex =
                                existingChannels.edges.findIndex(
                                    (edge) => edge.node.id === id,
                                );

                            if (existingChannelIndex > -1) {
                                existingChannels.edges[existingChannelIndex] = {
                                    __typename: "SurveyChannelCountableEdge",
                                    node: newChannelRef,
                                };
                            }

                            return existingChannels;
                        },
                    },
                });
            },
        });
    };

    const getChannels = (type: SurveyChannelTypeEnum) => {
        return (
            channels?.channels?.edges.filter(
                (edge) => edge.node.type === type,
            ) || ([] as SurveyChannelCountableEdge[])
        );
    };

    return {
        loading,
        channels,
        createChannel,
        getChannels,
        updateChannel,
    };
}
