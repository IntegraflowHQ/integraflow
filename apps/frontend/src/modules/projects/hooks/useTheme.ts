import { useThemesQuery } from "@/generated/graphql";
import useWorkspace from "@/modules/workspace/hooks/useWorkspace";

export const useThemes = () => {
    const { workspace } = useWorkspace();

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

            const { answer, button, progress, question, background } =
                parsedColorScheme;

            const colorPalette = [
                answer,
                button,
                progress,
                question,
                background,
            ];

            return {
                ...theme,
                name,
                colorScheme: parsedColorScheme,
                colorPalette: colorPalette,
            };
        });

        return {
            data: themesInfo,
            totalCount: data?.totalCount,
        };
    };

    return {
        error,
        loading,
        themes: getThemeProperties(),
    };
};
