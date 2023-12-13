import { useThemes } from "@/modules/projects/hooks/useTheme";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { Button } from "@/ui";
import { toast } from "@/utils/toast";
import React from "react";
import { Error } from "./Errors";
import { PresetThemes } from "./PresetThemes";
import { ThemeCard } from "./ThemeCard";

interface ContentProp {
    onOpen: () => void;
}

export const DesignEditorContent = ({ onOpen }: ContentProp) => {
    const { updateSurvey, survey } = useSurvey();
    const currentSurveyTheme = survey?.survey?.theme;
    const [selectedThemeId, setSelectedThemeId] = React.useState<string>("");
    const [selectedTheme, setSelectedTheme] = React.useState<object>({});

    const { themes, error } = useThemes();
    const { data, totalCount } = themes;

    const onSelectedTheme = (index: number) => {
        const selectedThemeIndex = data?.[index]?.id || "";

        setSelectedThemeId(selectedThemeIndex);

        const theme = themes?.themes?.find(
            (theme) => theme.id === selectedThemeIndex,
        );

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setSelectedTheme(theme);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        updateSurvey({ themeId: selectedThemeIndex }, theme);
    };

    const getCustomThemes = () => {
        const customThemes = data?.map((theme) => theme);
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
        if (!selectedThemeId) return [];
        let colors: string[] = [];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { id, name } = selectedTheme;

        if (currentSurveyTheme?.id === id) {
            const colorScheme = JSON.parse(currentSurveyTheme?.colorScheme);
            colors = Object.values(colorScheme).map((color) => color);
        }

        return {
            id,
            name,
            colors,
        };
    };

    const allThemes = getCustomThemes().map((theme) => theme);
    const currentTheme = getSelectedTheme();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { id, name, colors } = currentTheme;

    if (error) {
        toast.error(error.message || error.networkError?.message || "");
    }

    React.useEffect(() => {
        if (currentSurveyTheme) {
            setSelectedThemeId(currentSurveyTheme.id);
            setSelectedTheme(currentSurveyTheme);
        }
    }, [currentSurveyTheme]);

    return (
        <>
            {allThemes.length === 0 ? (
                <>
                    <Error message="You don't have any theme. Click the button below to create one or choose from our presets" />

                    <Button
                        text="new theme"
                        onClick={onOpen}
                        variant="secondary"
                        className="mb-2 mt-4 text-sm font-normal first-letter:capitalize"
                    />

                    <div
                        className={` ${
                            totalCount !== 0
                                ? "h-[400px] opacity-100"
                                : "h-[0px] opacity-0"
                        } transition-all delay-1000 duration-300 ease-in-out`}
                    >
                        <PresetThemes />
                    </div>
                </>
            ) : (
                <>
                    {selectedThemeId ? (
                        <>
                            <p className="py-4 text-sm font-normal uppercase">
                                selected theme
                            </p>
                            <div
                                className={`flex w-full gap-5 rounded-md bg-intg-bg-15 px-3 py-2 transition-all ease-in-out`}
                            >
                                <div className="flex gap-5">
                                    <div className="flex py-2">
                                        {colors.map(
                                            (color: string, index: number) => {
                                                return (
                                                    <div
                                                        className={`h-8 w-8 rounded-full border-2 ${
                                                            index !== 0
                                                                ? "-ml-4"
                                                                : ""
                                                        }`}
                                                        key={index}
                                                        style={{
                                                            backgroundColor: `${color}`,
                                                        }}
                                                    />
                                                );
                                            },
                                        )}
                                    </div>

                                    <div>
                                        <p className="font-normal leading-6 first-letter:capitalize">
                                            {name}
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

                    <div
                        className={`h-fit py-6 ${
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

                        <div className="flex-col py-1 transition-all duration-300 ease-in-out">
                            {allThemes?.map((theme, index: number) => {
                                return (
                                    <div key={index}>
                                        <ThemeCard
                                            activeTheme={
                                                theme.id ===
                                                currentSurveyTheme?.id
                                            }
                                            name={theme.name}
                                            colors={theme.colors}
                                            onClick={() =>
                                                onSelectedTheme(index)
                                            }
                                            toggleNewThemeModal={onOpen}
                                            setThemeData={() => {
                                                theme.name, theme.colors;
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
