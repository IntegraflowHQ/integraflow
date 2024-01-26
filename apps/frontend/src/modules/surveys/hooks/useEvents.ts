import {
    EventDefinition,
    useProjectEventsDataQuery,
} from "@/generated/graphql";
import useWorkspace from "@/modules/workspace/hooks/useWorkspace";
import { EventProperties } from "@integraflow/web/src/types";
import { useCallback, useMemo } from "react";

export const useEvents = () => {
    const { workspace } = useWorkspace();
    const { data } = useProjectEventsDataQuery({
        context: {
            headers: {
                Project: workspace?.project.id,
            },
        },
        skip: !workspace?.project.id,
    });

    const eventDefinitions = useMemo(() => {
        return (
            data?.eventDefinitions?.edges.map(({ node }) => node) ||
            ([] as EventDefinition[])
        );
    }, [data?.eventDefinitions]);

    const eventProperties = useMemo(() => {
        return (
            data?.eventProperties?.edges.map(({ node }) => node) ||
            ([] as EventProperties[])
        );
    }, [data?.eventProperties]);

    const propertyDefinitions = useMemo(() => {
        return (
            data?.propertyDefinitions?.edges.map(({ node }) => node) ||
            ([] as PropertyDefinition[])
        );
    }, [data?.propertyDefinitions]);

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
                return {
                    ...p,
                    definition,
                };
            });
        },
        [eventProperties],
    );

    // const eventOptions = useMemo(() => {
    //     return eventDefinitions.map((e) => ({
    //         ...e,
    //         properties: getProperties(e.name),
    //     }));
    // }, [getProperties, eventDefinitions]);

    return {
        eventDefinitions,
        eventProperties,
        propertyDefinitions,
        // eventOptions,
        getProperties,
    };
};
