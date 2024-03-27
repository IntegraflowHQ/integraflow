import {
    Project,
    ProjectTheme,
    ThemesQuery,
    User,
    useProjectThemeCreateMutation,
    useProjectThemeDeleteMutation,
    useProjectThemeUpdateMutation,
    useThemesQuery,
} from "@/generated/graphql";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { Reference } from "@apollo/client";
import { PROJECT_THEME } from "../graphql/fragments/projectFragments";
import { useProject } from "./useProject";

export type ColorScheme = {
    answer: string;
    button: string;
    progress: string;
    question: string;
    background: string;
};

export const useTheme = () => {
    const { user } = useCurrentUser();
    const { project } = useProject();
    const [createThemeMutation] = useProjectThemeCreateMutation();
    const [updateThemeMutation] = useProjectThemeUpdateMutation();
    const [deleteThemeMutation] = useProjectThemeDeleteMutation();

    const {
        data: themes,
        loading,
        error,
        refetch,
    } = useThemesQuery({
        variables: { first: 20 },
        notifyOnNetworkStatusChange: true,
    });

    const transformThemes = (themes: ThemesQuery) => {
        const data = { ...(themes?.themes ?? {}) };

        return data?.edges?.map(({ node }) => {
            let colorScheme = {};
            if (node.colorScheme) {
                try {
                    colorScheme = JSON.parse(node.colorScheme) as ColorScheme;
                } catch (error) {
                    colorScheme = {};
                }
            }

            node.colorScheme = colorScheme;

            return node;
        });
    };

    const createTheme = async (theme: Partial<ProjectTheme>) => {
        const { data } = await createThemeMutation({
            variables: {
                input: {
                    name: theme.name ?? "",
                    colorScheme: JSON.stringify(theme.colorScheme ?? {}),
                },
            },
            notifyOnNetworkStatusChange: true,
            optimisticResponse: {
                __typename: "Mutation",
                projectThemeCreate: {
                    __typename: "ProjectThemeCreate",
                    projectTheme: {
                        __typename: "ProjectTheme",
                        id: theme?.id ?? "",
                        name: theme.name ?? "",
                        colorScheme: JSON.stringify(theme.colorScheme ?? {}),
                    },
                    projectErrors: [],
                },
            },

            update: (cache, { data }) => {
                if (!data?.projectThemeCreate?.projectTheme) return;

                cache.modify({
                    fields: {
                        themes(existingThemeRefs) {
                            const newThemeRef = cache.writeFragment({
                                data: {
                                    ...(data?.projectThemeCreate?.projectTheme ?? {}),
                                    settings: "{}",
                                    project: null,
                                    creator: null,
                                    reference: null,
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString(),
                                },
                                fragment: PROJECT_THEME,
                            });
                            return {
                                ...existingThemeRefs,
                                edges: [
                                    ...existingThemeRefs.edges,
                                    {
                                        __typename: "ProjectTheme",
                                        node: newThemeRef,
                                    },
                                ],
                            };
                        },
                    },
                });
            },
        });

        if (error)
            return {
                error,
            };

        return {
            newThemeData: data?.projectThemeCreate?.projectTheme,
        };
    };

    const updateTheme = async (theme: Partial<ProjectTheme>) => {
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
                        settings: "",
                        project: project as Project,
                        creator: user as User,
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
        });
    };

    const deleteTheme = async (themeId: string) => {
        await deleteThemeMutation({
            variables: {
                id: themeId,
            },
            notifyOnNetworkStatusChange: true,

            optimisticResponse: {
                __typename: "Mutation",
                projectThemeDelete: {
                    __typename: "ProjectThemeDelete",

                    projectTheme: {
                        // ...themes,
                        id: themeId,
                        reference: "",
                        __typename: "ProjectTheme",
                        name: "",
                        colorScheme: "",
                        settings: "",
                        createdAt: new Date().toISOString(),
                        creator: user as User,
                        updatedAt: new Date().toISOString(),
                        project: project as Project,
                    },
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
                                edges: existingThemeRefs.edges.filter((themeRef: Reference) => {
                                    return themeId !== readField("id", themeRef);
                                }),
                            };
                        },
                    },
                });
            },
        });
    };

    return {
        error,
        refetch,
        loading,
        createTheme,
        updateTheme,
        deleteTheme,
        themes: transformThemes(JSON.parse(JSON.stringify(themes ?? {}))),
    };
};
