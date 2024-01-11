import {
    ProjectTheme,
    ThemesQuery,
    useProjectThemeCreateMutation,
    useProjectThemeDeleteMutation,
    useProjectThemeUpdateMutation,
    useThemeQuery,
} from "@/generated/graphql";
import useUserState from "@/modules/users/hooks/useUserState";
import useWorkspace from "@/modules/workspace/hooks/useWorkspace";
import { Reference } from "@apollo/client";
import { PROJECT_THEME } from "../graphql/fragments/projectFragments";

export type ColorScheme = {
    answer: string;
    button: string;
    progress: string;
    question: string;
    background: string;
};

export const useTheme = () => {
    const { workspace } = useWorkspace();
    const { user } = useUserState();
    const [createThemeMutation] = useProjectThemeCreateMutation();
    const [updateThemeMutation] = useProjectThemeUpdateMutation();
    const [deleteThemeMutation] = useProjectThemeDeleteMutation();

    const {
        data: themes,
        loading,
        error,
        refetch,
    } = useThemeQuery({
        variables: { first: 20 },
        notifyOnNetworkStatusChange: true,
        context: {
            headers: {
                Project: workspace?.project.id,
            },
        },
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
            context: {
                headers: {
                    Project: workspace?.project.id,
                },
            },

            onCompleted: (data) => {
                const newThemeData = {
                    id: data.projectThemeCreate?.projectTheme?.id ?? "",
                    name: data.projectThemeCreate?.projectTheme?.name ?? "",
                    colorScheme:
                        data.projectThemeCreate?.projectTheme?.colorScheme ??
                        "",
                };

                return newThemeData;
            },

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
                                    ...(data?.projectThemeCreate
                                        ?.projectTheme ?? {}),
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
            context: {
                headers: {
                    Project: workspace?.project.id,
                },
            },
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
                        project: {
                            __typename: "Project",
                            id: "",
                            name: "",
                            slug: "",
                            hasCompletedOnboardingFor: null,
                            timezone: "",
                            organization: {
                                id: workspace?.organization.id ?? "",
                                slug: workspace?.organization.slug ?? "",
                                name: workspace?.organization.name ?? "",
                                memberCount:
                                    workspace?.organization.memberCount ?? 0,
                            },
                        },

                        creator: {
                            __typename: "User",
                            firstName: user?.firstName ?? "",
                            lastName: user?.lastName ?? "",
                            email: user?.email ?? "",
                            id: user?.id ?? "",
                            isActive: user?.isActive ?? false,
                            isStaff: user?.isStaff ?? false,
                            isOnboarded: user?.isOnboarded ?? false,
                            organization: {
                                id: workspace?.organization.id ?? "",
                                slug: workspace?.organization.slug ?? "",
                                name: workspace?.organization.name ?? "",
                                memberCount:
                                    workspace?.organization.memberCount ?? 0,
                            },
                            project: {
                                id: workspace?.project.id ?? "",
                                name: workspace?.project.name ?? "",
                                slug: workspace?.project.slug ?? "",
                                hasCompletedOnboardingFor: null,
                                timezone: "",
                                organization: {
                                    id: workspace?.organization.id ?? "",
                                    slug: workspace?.organization.slug ?? "",
                                    name: workspace?.organization.name ?? "",
                                    memberCount:
                                        workspace?.organization.memberCount ??
                                        0,
                                },
                            },
                            organizations: {
                                __typename: "OrganizationCountableConnection",
                                edges: [],
                            },
                        },
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
            context: {
                headers: {
                    Project: workspace?.project.id,
                },
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
                        updatedAt: new Date().toISOString(),

                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        creator: {
                            firstName: "",
                            lastName: "",
                            email: "",
                        },

                        project: {
                            __typename: "Project",
                            id: "",
                            name: "",
                            slug: "",
                            hasCompletedOnboardingFor: null,
                            timezone: "",
                            organization: {
                                id: workspace?.organization.id ?? "",
                                slug: workspace?.organization.slug ?? "",
                                name: workspace?.organization.name ?? "",
                                memberCount:
                                    workspace?.organization.memberCount ?? 0,
                            },
                        },
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
                                edges: existingThemeRefs.edges.filter(
                                    (themeRef: Reference) => {
                                        return (
                                            themeId !==
                                            readField("id", themeRef)
                                        );
                                    },
                                ),
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
