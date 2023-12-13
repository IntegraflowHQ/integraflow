import {
    useProjectThemeCreateMutation,
    useThemesQuery,
} from "@/generated/graphql";
import useWorkspace from "@/modules/workspace/hooks/useWorkspace";
import { PROJECT_THEME } from "../graphql/fragments/projectFragments";

export type ColorScheme = {
    answer: string;
    button: string;
    progress: string;
    question: string;
    background: string;
};

export const useThemes = () => {
    const { workspace } = useWorkspace();
    const [createThemeMutation] = useProjectThemeCreateMutation();

    const {
        data: themes,
        loading,
        error,
    } = useThemesQuery({
        variables: { first: 20 },
        notifyOnNetworkStatusChange: true,
        context: {
            headers: {
                Project: workspace?.project.id,
            },
        },
    });

    const getThemeProperties = () => {
        const data = themes?.themes;

        const themeData = data?.edges?.map((theme) => {
            return theme.node;
        });

        const themesInfo = themeData?.map((theme) => {
            const { name, colorScheme } = theme || {};

            const parsedColorScheme = colorScheme
                ? JSON.parse(colorScheme)
                : {};

            return {
                ...theme,
                name,
                colorScheme: parsedColorScheme,
            };
        });

        return {
            themes: themeData,
            data: themesInfo,
            totalCount: data?.totalCount,
        };
    };

    const createSurveyTheme = async (
        themeName: string,
        colorScheme: ColorScheme,
    ) => {
        await createThemeMutation({
            variables: {
                input: {
                    name: themeName,
                    colorScheme: JSON.stringify(colorScheme),
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
                projectThemeCreate: {
                    __typename: "ProjectThemeCreate",
                    projectTheme: {
                        __typename: "ProjectTheme",
                        id: "temp-id",
                        name: themeName,
                        colorScheme: JSON.stringify(colorScheme),
                    },
                },
            },
            // caching the mutation based on the available themes
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

    return {
        error,
        loading,
        themes: getThemeProperties(),
        createTheme: (themeName: string, colorScheme: ColorScheme) =>
            createSurveyTheme(themeName, colorScheme),
    };
};
