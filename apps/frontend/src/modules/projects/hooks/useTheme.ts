import {
    useProjectThemeCreateMutation,
    useThemesQuery,
} from "@/generated/graphql";
import useWorkspace from "@/modules/workspace/hooks/useWorkspace";
import { Reference, StoreObject, gql } from "@apollo/client";

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
            refetch,
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
                        themes(existingThemeRefs = [], { readField }) {
                            const newThemeRef = cache.writeFragment({
                                data: data?.projectThemeCreate?.projectTheme,
                                fragment: gql`
                                    fragment NewTheme on ProjectTheme {
                                        id
                                        name
                                        colorScheme
                                    }
                                `,
                            });
                            const existingThemeIds = Array.isArray(
                                existingThemeRefs,
                            )
                                ? existingThemeRefs.map(
                                      (
                                          themeRef:
                                              | Reference
                                              | StoreObject
                                              | undefined,
                                      ) => readField("id", themeRef),
                                  )
                                : null;

                            if (
                                existingThemeIds?.includes(
                                    data?.projectThemeCreate?.projectTheme?.id,
                                )
                            ) {
                                return existingThemeRefs;
                            }
                            return [...existingThemeRefs, newThemeRef];
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
