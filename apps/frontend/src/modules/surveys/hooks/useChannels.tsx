import {
    SurveyChannel,
    SurveyChannelCountableEdge,
    SurveyChannelCreateInput,
    SurveyChannelTypeEnum,
    SurveyChannelUpdateInput,
    useSurveyChannelCreateMutation,
    useSurveyChannelUpdateMutation,
} from "@/generated/graphql";
import useWorkspaceState from "@/modules/workspace/hooks/useWorkspaceState";
import { SURVEY_CHANNEL } from "../graphql/fragments/surveyFragment";
import { useSurvey } from "./useSurvey";

export default function useChannels() {
    const { survey, surveyId } = useSurvey();
    const { workspace } = useWorkspaceState();

    const context = {
        headers: {
            Project: workspace?.project.id,
        },
    };

    const [createChannelMutation] = useSurveyChannelCreateMutation();
    const createChannel = async (
        input: Omit<SurveyChannelCreateInput, "surveyId">,
    ) => {
        if (!surveyId) return;
        const data: SurveyChannelCreateInput = {
            type: input.type ?? SurveyChannelTypeEnum.InApp,
            id: input.id ?? crypto.randomUUID(),
            triggers: input.triggers ?? "{}",
            conditions: input.conditions ?? "{}",
            settings: input.settings ?? "{}",
            surveyId,
        };
        await createChannelMutation({
            variables: {
                input: data,
            },
            context,
            optimisticResponse: {
                __typename: "Mutation",
                surveyChannelCreate: {
                    __typename: "SurveyChannelCreate",
                    surveyChannel: {
                        __typename: "SurveyChannel",
                        ...data,
                        reference: data.id,
                        createdAt: new Date().toISOString(),
                    },
                    surveyErrors: [],
                    errors: [],
                },
            },
            update: (cache, { data }) => {
                if (!data?.surveyChannelCreate?.surveyChannel) return;
                cache.modify({
                    id: `Survey:${surveyId}`,
                    fields: {
                        channels(existingChannels = []) {
                            const newChannelRef = cache.writeFragment({
                                data: data?.surveyChannelCreate?.surveyChannel,
                                fragment: SURVEY_CHANNEL,
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
        channel: SurveyChannel,
        input: SurveyChannelUpdateInput,
    ) => {
        await updateChannelMutation({
            variables: {
                id: channel.id,
                input,
            },
            context,
            optimisticResponse: {
                __typename: "Mutation",
                surveyChannelUpdate: {
                    __typename: "SurveyChannelUpdate",
                    surveyChannel: {
                        __typename: "SurveyChannel",
                        id: channel.id,
                        type: input.type ?? channel.type,
                        triggers: input.triggers ?? channel.triggers,
                        conditions: input.conditions ?? channel.conditions,
                        settings: input.settings ?? channel.settings,
                        reference: channel.reference,
                        createdAt: new Date().toISOString(),
                    },
                    surveyErrors: [],
                    errors: [],
                },
            },
            update: (cache, { data }) => {
                if (!data?.surveyChannelUpdate?.surveyChannel) return;
                cache.writeFragment({
                    id: `SurveyChannel:${channel.id}`,
                    fragment: SURVEY_CHANNEL,
                    data: data?.surveyChannelUpdate?.surveyChannel,
                });
            },
        });
    };

    const getChannels = (type: SurveyChannelTypeEnum) => {
        return (
            survey?.survey?.channels?.edges.filter(
                (edge) => edge.node.type === type,
            ) || ([] as SurveyChannelCountableEdge[])
        );
    };

    return {
        createChannel,
        getChannels,
        updateChannel,
    };
}
