import {
    EventDefinition,
    useProjectEventsDataQuery,
} from "@/generated/graphql";
import useWorkspace from "@/modules/workspace/hooks/useWorkspace";
import { EventProperties } from "@integraflow/web/src/types";
import { useMemo } from "react";

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

    return {
        eventDefinitions,
        eventProperties,
        propertyDefinitions,
    };
};
