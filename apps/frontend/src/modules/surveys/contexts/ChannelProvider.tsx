import {
    SurveyChannel,
    SurveyChannelCountableEdge,
    SurveyChannelCreateInput,
    SurveyChannelTypeEnum,
    SurveyChannelUpdateInput,
    useSurveyChannelCreateMutation,
    useSurveyChannelDeleteMutation,
    useSurveyChannelUpdateMutation,
} from "@/generated/graphql";
import { ParsedChannel } from "@/types";
import { fromSurveyChannel, toSurveyChannel } from "@/utils";
import { ReactNode, createContext, useCallback, useMemo } from "react";
import { SURVEY_CHANNEL } from "../graphql/fragments/surveyFragment";
import { useSurvey } from "../hooks/useSurvey";

function useChannelContextFactory() {
    const { survey, surveyId } = useSurvey();
    const [createChannelMutation] = useSurveyChannelCreateMutation();
    const [updateChannelMutation] = useSurveyChannelUpdateMutation();
    const [deleteChannelMutation] = useSurveyChannelDeleteMutation();

    const createChannel = async (
        input: Omit<SurveyChannelCreateInput, "surveyId">,
    ) => {
        if (!surveyId) return;
        const data: SurveyChannelCreateInput = {
            type: input.type ?? SurveyChannelTypeEnum.WebSdk,
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
                        channels(existingChannels) {
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

    const updateChannel = async (
        channel: ParsedChannel,
        input: SurveyChannelUpdateInput,
    ) => {
        const surveyChannel = toSurveyChannel(channel);

        await updateChannelMutation({
            variables: {
                id: channel.id,
                input,
            },
            optimisticResponse: {
                __typename: "Mutation",
                surveyChannelUpdate: {
                    __typename: "SurveyChannelUpdate",
                    surveyChannel: {
                        __typename: "SurveyChannel",
                        id: channel.id,
                        type: input.type ?? surveyChannel.type,
                        triggers: input.triggers ?? surveyChannel.triggers,
                        conditions:
                            input.conditions ?? surveyChannel.conditions,
                        settings: input.settings ?? surveyChannel.settings,
                        reference: surveyChannel.reference,
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

    const deleteChannel = async (channel: SurveyChannel) => {
        await deleteChannelMutation({
            variables: {
                id: channel.id,
            },
            optimisticResponse: {
                __typename: "Mutation",
                surveyChannelDelete: {
                    __typename: "SurveyChannelDelete",
                    surveyChannel: {
                        __typename: "SurveyChannel",
                        ...channel,
                    },
                    surveyErrors: [],
                    errors: [],
                },
            },
            update: (cache, { data }) => {
                if (!data?.surveyChannelDelete?.surveyChannel) return;
                cache.modify({
                    id: `Survey:${surveyId}`,
                    fields: {
                        channels(existingChannels, { readField }) {
                            return {
                                __typeName: "SurveyChannelCountableConnection",
                                edges: existingChannels.edges.filter(
                                    (edge: SurveyChannelCountableEdge) =>
                                        readField("id", edge.node) !==
                                        channel.id,
                                ),
                            };
                        },
                    },
                });
            },
        });
    };

    const channels = useMemo(() => {
        return (
            survey?.survey?.channels?.edges.map((edge) => {
                return fromSurveyChannel(edge.node);
            }) || ([] as ParsedChannel[])
        );
    }, [survey?.survey?.channels?.edges]);

    const getChannels = useCallback(
        (type: SurveyChannelTypeEnum) => {
            return (
                channels.filter((channel) => channel.type === type) ||
                ([] as ParsedChannel[])
            );
        },
        [channels],
    );

    return {
        createChannel,
        getChannels,
        updateChannel,
        deleteChannel,
    };
}

export type ChannelContextValue = ReturnType<typeof useChannelContextFactory>;

const createChannelContext = () => {
    return createContext<ChannelContextValue | null>(null);
};

export const ChannelContext = createChannelContext();

export const ChannelProvider = ({ children }: { children: ReactNode }) => {
    const value = useChannelContextFactory();

    return (
        <ChannelContext.Provider value={value}>
            {children}
        </ChannelContext.Provider>
    );
};
