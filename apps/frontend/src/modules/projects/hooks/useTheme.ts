import {
    ProjectTheme,
    ThemesQuery,
    useProjectThemeCreateMutation,
    useProjectThemeDeleteMutation,
    useProjectThemeUpdateMutation,
    useThemesQuery,
} from "@/generated/graphql";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
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

export const useThemes = () => {
    const { user } = useUserState();
    const { workspace } = useWorkspace();
    const [createThemeMutation] = useProjectThemeCreateMutation();
    const [updateThemeMutation] = useProjectThemeUpdateMutation();
    const { updateSurvey } = useSurvey();
    const [deleteThemeMutation] = useProjectThemeDeleteMutation();

    const {
        data: themes,
        loading,
        error,
        refetch,
    } = useThemesQuery({
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

    const createTheme = async (id: string, theme: Partial<ProjectTheme>) => {
        await createThemeMutation({
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
                const themeData = {
                    id: data.projectThemeCreate?.projectTheme?.id ?? "",
                    name: data.projectThemeCreate?.projectTheme?.name ?? "",
                    colorScheme:
                        data.projectThemeCreate?.projectTheme?.colorScheme ??
                        "",
                };

                data.projectThemeCreate?.projectTheme?.id;
                updateSurvey(id, { themeId: themeData.id });
            },

            optimisticResponse: {
                __typename: "Mutation",
                projectThemeCreate: {
                    __typename: "ProjectThemeCreate",
                    projectTheme: {
                        __typename: "ProjectTheme",
                        id: "temp-id",
                        name: theme.name ?? "",
                        colorScheme: JSON.stringify(theme.colorScheme ?? {}),
                    },
                    projectErrors: [],
                },
            },

            // caching the mutation based on the available themes
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
                        colorScheme: JSON.stringify(theme.colorScheme ?? {}),
                        settings: [],
                        project: {
                            id: workspace?.project.id ?? "",
                            name: workspace?.project.name ?? "",
                            slug: workspace?.project.slug ?? "",
                            hasCompletedOnboardingFor: [],
                            timezone: workspace?.project.timezone ?? "",
                            organization: {
                                id: workspace?.project.organization.id ?? "",
                                slug:
                                    workspace?.project.organization.slug ?? "",
                                name:
                                    workspace?.project.organization.name ?? "",
                                memberCount:
                                    workspace?.project.organization
                                        .memberCount ?? 0,
                            },
                        },
                        createdAt: new Date().toISOString(),
                        creator: {
                            id: user?.id ?? "",
                            firstName: user?.firstName ?? "",
                            lastName: user?.lastName ?? "",
                            email: user?.email ?? "",
                            isActive: user?.isActive ?? false,
                            isOnboarded: user?.isOnboarded ?? false,
                            isStaff: user?.isStaff ?? false,
                        },
                        updatedAt: new Date().toISOString(),
                    },
                    errors: [],
                    projectErrors: [],
                },
            },
        });
    };

    const deleteTheme = async (surveyId: string, themeId: string) => {
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

            onCompleted: () => {
                updateSurvey(surveyId, { themeId: undefined });
            },

            optimisticResponse: {
                __typename: "Mutation",
                projectThemeDelete: {
                    __typename: "ProjectThemeDelete",

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    projectTheme: {
                        __typename: "ProjectTheme",
                        id: themeId,
                    },
                    errors: [],
                    projectErrors: [],
                },
            },

            update: (cache, { data }) => {
                console.log(
                    "data from useThemes",
                    data?.projectThemeDelete?.projectTheme,
                );

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
