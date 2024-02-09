import {
    ProjectTheme,
    ThemesQuery,
    useProjectThemeCreateMutation,
    useProjectThemeUpdateMutation,
    useThemesQuery,
} from "@/generated/graphql";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { PROJECT_THEME } from "../graphql/fragments/projectFragments";
import { useProject } from "./useProject";

export type ColorScheme = {
    answer: string;
    button: string;
    progress: string;
    question: string;
    background: string;
};

export const useThemes = () => {
    const { user } = useCurrentUser();
    const { project } = useProject();
    const [createThemeMutation] = useProjectThemeCreateMutation();
    const [updateThemeMutation] = useProjectThemeUpdateMutation();
    const { updateSurvey } = useSurvey();

    const {
        data: themes,
        loading,
        error,
    } = useThemesQuery({
        variables: { first: 20 },
        notifyOnNetworkStatusChange: true,
        context: {
            headers: {
                Project: project?.id,
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
                    Project: project?.id,
                },
            },
            onCompleted: (data) => {
                const themeData = {
                    name: data.projectThemeCreate?.projectTheme?.name ?? "",
                    colorScheme:
                        data.projectThemeCreate?.projectTheme?.colorScheme ??
                        "",
                };

                data.projectThemeCreate?.projectTheme?.id;
                updateSurvey(
                    { themeId: data.projectThemeCreate?.projectTheme?.id },
                    themeData,
                );
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
                    Project: project?.id,
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
                            id: project?.id ?? "",
                            name: project?.name ?? "",
                            slug: project?.slug ?? "",
                            hasCompletedOnboardingFor: [],
                            timezone: project?.timezone ?? "",
                            organization: {
                                id: project?.organization?.id ?? "",
                                slug: project?.organization?.slug ?? "",
                                name: project?.organization?.name ?? "",
                                memberCount:
                                    project?.organization?.memberCount ?? 0,
                            },
                        },
                        createdAt: new Date().toISOString(),
                        creator: user,
                        updatedAt: new Date().toISOString(),
                    },
                    projectErrors: [],
                },
            },
        });
    };

    return {
        error,
        loading,
        createTheme,
        updateTheme,
        themes: transformThemes(JSON.parse(JSON.stringify(themes ?? {}))),
    };
};
