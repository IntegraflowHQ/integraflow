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
    const { survey } = useSurvey();
    const [createChannelMutation] = useSurveyChannelCreateMutation();
    const [updateChannelMutation] = useSurveyChannelUpdateMutation();
    const [deleteChannelMutation] = useSurveyChannelDeleteMutation();

    const createChannel = async (input: Partial<ParsedChannel>) => {
        if (!survey) return;

        const parsedInput = toSurveyChannel(input as ParsedChannel);
        const data: SurveyChannelCreateInput = {
            type: parsedInput.type ?? SurveyChannelTypeEnum.WebSdk,
            id: parsedInput.id ?? crypto.randomUUID(),
            triggers: parsedInput.triggers ?? "{}",
            conditions: parsedInput.conditions ?? "{}",
            settings: parsedInput.settings ?? "{}",
            surveyId: survey.id,
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
                        link: "",
                        reference: data.id,
                        createdAt: new Date().toISOString(),
                    } as SurveyChannel,
                    surveyErrors: [],
                    errors: [],
                },
            },
            update: (cache, { data }) => {
                if (!data?.surveyChannelCreate?.surveyChannel) return;
                cache.modify({
                    id: `Survey:${survey.id}`,
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
                                        __typename: "SurveyChannelCountableEdge",
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

    const updateChannel = async (channel: ParsedChannel, input: SurveyChannelUpdateInput) => {
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
                        link: surveyChannel.link ?? "",
                        triggers: input.triggers ?? surveyChannel.triggers,
                        conditions: input.conditions ?? surveyChannel.conditions,
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

    const deleteChannel = async (channel: ParsedChannel) => {
        if (!survey) return;

        const surveyChannel = toSurveyChannel(channel);

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
                        ...surveyChannel,
                    },
                    surveyErrors: [],
                    errors: [],
                },
            },
            update: (cache, { data }) => {
                if (!data?.surveyChannelDelete?.surveyChannel) return;
                cache.modify({
                    id: `Survey:${survey?.id}`,
                    fields: {
                        channels(existingChannels, { readField }) {
                            return {
                                __typeName: "SurveyChannelCountableConnection",
                                edges: existingChannels.edges.filter(
                                    (edge: SurveyChannelCountableEdge) =>
                                        readField("id", edge.node) !== surveyChannel.id,
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
            survey?.channels?.edges.map((edge) => {
                return fromSurveyChannel(edge.node);
            }) || ([] as ParsedChannel[])
        );
    }, [survey?.channels?.edges]);

    const getChannels = useCallback(
        (type: SurveyChannelTypeEnum) => {
            return channels.filter((channel) => channel.type === type) || ([] as ParsedChannel[]);
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

    return <ChannelContext.Provider value={value}>{children}</ChannelContext.Provider>;
};
