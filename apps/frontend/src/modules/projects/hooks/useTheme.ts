import {
    ProjectTheme,
    ProjectThemeCreateInput,
    useProjectThemeCreateMutation,
    useProjectThemeDeleteMutation,
    useProjectThemeUpdateMutation,
    useThemesQuery,
} from "@/generated/graphql";
import { ParsedTheme, Theme } from "@/types";
import { parseTheme } from "@/utils";
import { Reference } from "@apollo/client";
import { useMemo } from "react";
import { PROJECT_THEME } from "../graphql/fragments/projectFragments";

export const useTheme = () => {
    const [createThemeMutation] = useProjectThemeCreateMutation();
    const [updateThemeMutation] = useProjectThemeUpdateMutation();
    const [deleteThemeMutation] = useProjectThemeDeleteMutation();

    const {
        data: themesData,
        loading,
        error,
        refetch,
    } = useThemesQuery({
        variables: { first: 20 },
    });

    const themes = useMemo(() => {
        return (
            themesData?.themes?.edges.map((theme) => {
                return parseTheme(theme.node as ProjectTheme);
            }) || ([] as ParsedTheme[])
        );
    }, [themesData]);

    const createTheme = async ({
        input,
        onSuccess,
        onError,
    }: {
        input: ProjectThemeCreateInput;
        onSuccess?: (theme: ProjectTheme) => void;
        onError?: () => void;
    }) => {
        await createThemeMutation({
            variables: {
                input,
            },
            optimisticResponse: {
                __typename: "Mutation",
                projectThemeCreate: {
                    __typename: "ProjectThemeCreate",
                    projectTheme: {
                        __typename: "ProjectTheme",
                        id: input?.id ?? "",
                        name: input.name ?? "",
                        reference: "",
                        colorScheme: input.colorScheme,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                    projectErrors: [],
                    errors: [],
                },
            },

            update: (cache, { data }) => {
                if (!data?.projectThemeCreate?.projectTheme) return;

                cache.modify({
                    fields: {
                        themes(existingThemeRefs) {
                            const newThemeRef = cache.writeFragment({
                                data: data?.projectThemeCreate?.projectTheme,
                                fragment: PROJECT_THEME,
                            });
                            return {
                                ...existingThemeRefs,
                                edges: [
                                    {
                                        __typename: "ProjectTheme",
                                        node: newThemeRef,
                                    },
                                    ...existingThemeRefs.edges,
                                ],
                            };
                        },
                    },
                });
            },

            onCompleted: (data) => {
                if (!data.projectThemeCreate?.projectTheme?.id) {
                    return;
                }

                onSuccess?.(data.projectThemeCreate.projectTheme as ProjectTheme);
            },

            onError,
        });
    };

    const updateTheme = async ({
        theme,
        onSuccess,
        onError,
    }: {
        theme: Theme;
        onSuccess?: (theme: ProjectTheme) => void;
        onError?: () => void;
    }) => {
        if (!theme.id) return;

        await updateThemeMutation({
            variables: {
                id: theme.id,
                input: {
                    name: theme.name ?? "",
                    colorScheme: JSON.stringify(theme.colorScheme ?? {}),
                },
            },
            notifyOnNetworkStatusChange: true,
            optimisticResponse: {
                __typename: "Mutation",
                projectThemeUpdate: {
                    __typename: "ProjectThemeUpdate",

                    projectTheme: {
                        __typename: "ProjectTheme",
                        id: theme.id,
                        name: theme.name ?? "",
                        reference: "",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        colorScheme: JSON.stringify(theme.colorScheme ?? {}),
                    },
                    errors: [],
                    projectErrors: [],
                },
            },

            update: (cache, { data }) => {
                if (!data?.projectThemeUpdate?.projectTheme) return;

                cache.modify({
                    id: cache.identify(data?.projectThemeUpdate?.projectTheme),
                    fields: {
                        themes(existingTheme = {}) {
                            return {
                                ...existingTheme,
                                edges: [...existingTheme.edges],
                            };
                        },
                    },
                });
            },

            onCompleted: (data) => {
                if (!data.projectThemeUpdate?.projectTheme?.id) {
                    return;
                }

                onSuccess?.(data.projectThemeUpdate.projectTheme as ProjectTheme);
            },

            onError,
        });
    };

    const deleteTheme = async ({
        themeId,
        onSuccess,
        onError,
    }: {
        themeId: string;
        onSuccess?: () => void;
        onError?: () => void;
    }) => {
        await deleteThemeMutation({
            variables: {
                id: themeId,
            },
            notifyOnNetworkStatusChange: true,

            optimisticResponse: {
                __typename: "Mutation",
                projectThemeDelete: {
                    __typename: "ProjectThemeDelete",
                    projectTheme: null,
                    errors: [],
                    projectErrors: [],
                },
            },

            update: (cache, { data }) => {
                if (!data?.projectThemeDelete?.projectTheme) return;

                cache.modify({
                    fields: {
                        themes(existingThemeRefs, { readField }) {
                            return {
                                ...existingThemeRefs,
                                edges: existingThemeRefs.edges.filter(({ node }: { node: Reference }) => {
                                    return themeId !== readField("id", node);
                                }),
                            };
                        },
                    },
                });
            },

            onCompleted: () => {
                onSuccess?.();
            },

            onError,
        });
    };

    return {
        error,
        refetch,
        loading,
        createTheme,
        updateTheme,
        deleteTheme,
        themes,
    };
};
