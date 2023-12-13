import { useThemes } from "@/modules/projects/hooks/useTheme";
import { Button } from "@/ui";
import React from "react";
import toast from "react-hot-toast";
import { EditorSpinner } from "./EditorSpinner";
import { Error } from "./Errors";
import { ThemeCard } from "./ThemeCard";
interface ContentProp {
    onOpen: () => void;
}

// const THEMES = [
//     {
//         palette: ["#CCA8E9", "#C3BEF0", "#CADEFC", "#DEFCF9"],
//         themeName: "Outer space",
//     },
//     {
//         palette: ["#748DA6", "#9CB4CC", "#D3CEDF", "#F2D7D9"],
//         themeName: "Tropical tone",
//     },
//     {
//         palette: ["#EEF2E6", "#D6CDA4", "#3D8361", "#1C6758"],
//         themeName: "Battle cat",
//     },
//     {
//         palette: ["#BFACE0", "#BFACE0", "#A084CA", "#645CAA"],
//         themeName: "Impressionist blue",
//     },
//     {
//         palette: ["#7A4495", "#B270A2", "#FF8FB1", "#FCE2DB"],
//         themeName: "Vanilla pudding",
//     },
//     {
//         palette: ["#FFEEAF", "#E1FFEE", "#A5F1E9", "#7FBCD2"],
//         themeName: "Azure blue",
//     },
//     {
//         palette: ["#54BAB9", "#9ED2C6", "#E9DAC1", "#F7ECDE"],
//         themeName: "Tint of rose",
//     },
// ];

export const DesignEditorContent = ({ onOpen }: ContentProp) => {
    const [selectedTheme, setSelectedTheme] = React.useState<string>("");

    const { themes, error, loading } = useThemes();
    const { data, totalCount } = themes;

    const selectedThemeIndex = data?.findIndex(
        (theme) => theme.id === selectedTheme,
    );
    const selectedThemeData = data?.[selectedThemeIndex ?? 0];

    const onSlectedTheme = (index: number) => {
        const selectedTheme = data?.[index]?.id || "";
        setSelectedTheme(selectedTheme);
    };

    const customThemes = data?.map((theme) => theme);

    const getCustomThemes = () => {
        const themes = [];

        for (const theme of customThemes ?? []) {
            const { name, id, colorScheme } = theme;
            const themeColors = Object.keys(colorScheme).map(
                (key) => theme.colorScheme[key],
            );

            themes.push({
                id,
                name,
                colors: themeColors,
            });
        }

        return themes;
    };

    const getSelectedTheme = () => {
        if (!selectedTheme) return [];

        const { name, id, colorScheme } = selectedThemeData;
        const themeColors = Object.keys(colorScheme).map(
            (key) => colorScheme[key],
        );

        return {
            id,
            name,
            colors: themeColors,
        };
    };

    const currentTheme = getSelectedTheme();
    const { colors } = currentTheme;

    const allThemes = getCustomThemes().map((theme) => theme);
    if (error) toast.error(error.message);

    return (
        <>
            {totalCount === 0 ? (
                <>
                    <Error message="You don't have any theme. Click the button below to create one." />
                </>
            ) : error?.networkError ? (
                <Error
                    message={
                        error?.networkError.message ||
                        "An error occured while loading themes. Please check your internet connect and try again"
                    }
                />
            ) : error ? (
                <Error
                    message={
                        error.message
                            ? error.message
                            : "An error occured, try refreshing your browser. If the issue persists, contact support."
                    }
                />
            ) : !loading ? (
                <>
                    {selectedTheme ? (
                        <>
                            <p className="py-4 text-sm font-normal uppercase">
                                selected theme
                            </p>
                            <div className="flex w-full gap-5 rounded-md bg-intg-bg-15 px-3 py-2 transition-all ease-in-out">
                                <div className="flex gap-5">
                                    <div className="flex py-2">
                                        {Array.isArray(colors)
                                            ? colors.map((color, index) => {
                                                  return (
                                                      <div
                                                          className={`h-8 w-8 rounded-full border-2 ${
                                                              index !== 0
                                                                  ? "-ml-4"
                                                                  : ""
                                                          }`}
                                                          key={color}
                                                          style={{
                                                              backgroundColor: `${color}`,
                                                          }}
                                                      />
                                                  );
                                              })
                                            : null}
                                    </div>

                                    <div>
                                        <p className="font-normal leading-6 first-letter:capitalize">
                                            {Array.isArray(currentTheme)
                                                ? null
                                                : currentTheme.name}
                                        </p>
                                        <p className="font-normal text-intg-text-4">
                                            Fetched theme
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="py-4 text-sm font-normal text-intg-text-4 first-letter:capitalize">
                            You have not selected a theme yet
                        </p>
                    )}

                    {totalCount === 0 ? (
                        <Button
                            text="new theme"
                            onClick={onOpen}
                            variant="secondary"
                            className="mb-2 mt-4 text-sm font-normal first-letter:capitalize"
                        />
                    ) : (
                        <div
                            className={`h-full py-6 ${
                                totalCount !== 0 ? "-mt-4" : ""
                            } transition-all delay-100 duration-300 ease-in-out`}
                        >
                            <p className="py-2 text-sm font-normal capitalize">
                                all themes
                            </p>

                            <Button
                                text="new theme"
                                onClick={onOpen}
                                variant="secondary"
                                className="text-sm font-normal first-letter:capitalize"
                            />

                            {/* all themes */}
                            <div className="flex-col">
                                {allThemes?.map((theme, index: number) => {
                                    return (
                                        <div key={theme.id}>
                                            <ThemeCard
                                                activeTheme={
                                                    theme.id === selectedTheme
                                                }
                                                name={theme.name}
                                                colors={theme.colors}
                                                onClick={() =>
                                                    onSlectedTheme(index)
                                                }
                                                toggleNewThemeModal={onOpen}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <EditorSpinner
                    startColor="#53389E"
                    endColor="#d9d9d9"
                    size="10"
                />
            )}
        </>
    );
};
