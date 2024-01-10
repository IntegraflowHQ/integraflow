import {
    EventDefinition,
    PersonCountableEdge,
    PropertyDefinition,
    SurveyChannel,
    SurveyChannelCountableEdge,
    SurveyChannelCreateInput,
    SurveyChannelTypeEnum,
    SurveyChannelUpdateInput,
    usePersonsQuery,
    useProjectEventsDataQuery,
    useSurveyChannelCreateMutation,
    useSurveyChannelDeleteMutation,
    useSurveyChannelUpdateMutation,
} from "@/generated/graphql";
import useWorkspaceState from "@/modules/workspace/hooks/useWorkspaceState";
import { ParsedChannel } from "@/types";
import { fromSurveyChannel, toSurveyChannel } from "@/utils";
import { EventProperties } from "@integraflow/web/src/types";
import { useCallback, useMemo } from "react";
import { SURVEY_CHANNEL } from "../graphql/fragments/surveyFragment";
import { useSurvey } from "./useSurvey";

export default function useChannels() {
    const { survey, surveyId } = useSurvey();
    const { workspace } = useWorkspaceState();

    const { data: eventsData } = useProjectEventsDataQuery({
        skip: !workspace?.project.id,
    });

    const { data: personsData } = usePersonsQuery();

    const [createChannelMutation] = useSurveyChannelCreateMutation();
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

    const [updateChannelMutation] = useSurveyChannelUpdateMutation();
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

    const [deleteChannelMutation] = useSurveyChannelDeleteMutation();
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

    const eventDefinitions = useMemo(() => {
        return (
            eventsData?.eventDefinitions?.edges.map(({ node }) => node) ||
            ([] as EventDefinition[])
        );
    }, [eventsData?.eventDefinitions]);

    const eventProperties = useMemo(() => {
        return (
            eventsData?.eventProperties?.edges.map(({ node }) => node) ||
            ([] as EventProperties[])
        );
    }, [eventsData?.eventProperties]);

    const propertyDefinitions = useMemo(() => {
        return (
            eventsData?.propertyDefinitions?.edges.map(({ node }) => node) ||
            ([] as PropertyDefinition[])
        );
    }, [eventsData?.propertyDefinitions]);

    const getPropertyDefinition = useCallback(
        (property: string) => {
            return propertyDefinitions.find((p) => p.name === property);
        },
        [propertyDefinitions],
    );

    const getProperties = useCallback(
        (event: string) => {
            const properties = eventProperties.filter((p) => p.event === event);
            return properties.map((p) => {
                const definition = p.property
                    ? getPropertyDefinition(p.property as string)
                    : undefined;

                return definition;
            });
        },
        [eventProperties, getPropertyDefinition],
    );

    const personProperties = useMemo(() => {
        const persons =
            personsData?.persons?.edges || ([] as PersonCountableEdge[]);
        const attributeKeysSet = new Set<string>();

        persons.forEach((person) => {
            const attributes = JSON.parse(person.node.attributes);
            const keys = Object.keys(attributes);

            keys.forEach((key) => attributeKeysSet.add(key));
        });

        const attributes = Array.from(attributeKeysSet);
        return attributes.map((attribute) => {
            return getPropertyDefinition(attribute);
        });
    }, [getPropertyDefinition, personsData?.persons?.edges]);

    console.log("personProperties: ", personProperties);

    return {
        eventDefinitions,
        eventProperties,
        propertyDefinitions,
        personProperties,
        getProperties,
        getPropertyDefinition,
        createChannel,
        getChannels,
        updateChannel,
        deleteChannel,
    };
}
