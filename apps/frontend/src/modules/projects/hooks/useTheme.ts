import { useThemesLazyQuery } from "@/generated/graphql";
import { useProjectThemesStore } from "../states/themes";

export const useThemes = () => {
    const themeStore = useProjectThemesStore();
    const [fn, { loading, error }] = useThemesLazyQuery();

    const getThemes = async (first = 20) => {
        themeStore.getAvailableThemes([], false, null, 0);

        try {
            const { data } = await fn({
                variables: { first },
            });

            const totalThemes = data?.themes?.totalCount;
            const themes = data?.themes?.edges.map((edges) => edges.node || []);

            themeStore.getAvailableThemes(
                themes || [],
                false,
                null,
                totalThemes,
            );

            return {
                error,
                loading,
                themes: themes || [],
                totalCount: totalThemes,
            };
        } catch (err) {
            themeStore.getAvailableThemes(
                [],
                false,
                error?.message ||
                    "An error occured while fetching your themes. Try refreshing",
                0,
            );

            return {
                error,
                themes: [],
                totalCount: 0,
                loading: false,
            };
        }
    };

    return {
        getThemes,
    };
};
