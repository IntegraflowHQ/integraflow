import { ProjectTheme } from "@/generated/graphql";
import { useThemes } from "@/modules/projects/hooks/useTheme";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { Button } from "@/ui";
import { toast } from "@/utils/toast";
import React from "react";
import { Error } from "./Errors";
import { PresetThemes } from "./PresetThemes";
import { ThemeCard } from "./ThemeCard";

interface ContentProp {
    onOpen: (theme?: Partial<ProjectTheme>) => void;
}

export const DesignEditorContent = ({ onOpen }: ContentProp) => {
    const { updateSurvey, survey } = useSurvey();
    const [selectedTheme, setSelectedTheme] =
        React.useState<Partial<ProjectTheme>>();

    const { themes, error } = useThemes();

    /* const getCustomThemes = () => {
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
    }; */

    const colorScheme = React.useMemo(() => {
        let colorScheme = {};

        try {
            colorScheme = JSON.parse(selectedTheme?.colorScheme ?? "{}");
        } catch (error) {
            colorScheme = selectedTheme?.colorScheme ?? {};
        }

        return colorScheme;
    }, [selectedTheme]);

    const handleSelectedTheme = (theme: Partial<ProjectTheme>) => {
        setSelectedTheme(theme);

        theme.colorScheme = JSON.stringify(theme.colorScheme);
        updateSurvey({ themeId: theme.id }, theme);
    };

    // const allThemes = getCustomThemes().map((theme) => theme);
    // const currentTheme = getSelectedTheme();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // const { name, colors } = getSelectedTheme();

    console.log(themes);

    if (error) {
        toast.error(error.message || error.networkError?.message || "");
    }

    React.useEffect(() => {
        const theme = survey?.survey?.theme;
        if (theme) {
            setSelectedTheme(theme as Partial<ProjectTheme>);
        }
    }, [survey]);

    const count = themes?.length ?? 0;

    return (
        <>
            {count === 0 ? (
                <>
                    <Error message="You don't have any theme. Click the button below to create one or choose from our presets" />

                    <Button
                        text="new theme"
                        onClick={() => onOpen()}
                        variant="secondary"
                        className="mb-2 mt-4 text-sm font-normal first-letter:capitalize"
                    />

                    <div
                        className={` ${
                            count !== 0
                                ? "h-[0px] opacity-0"
                                : "h-[350px] opacity-100"
                        } transition-all delay-200 duration-300 ease-in-out`}
                    >
                        <PresetThemes />
                    </div>
                </>
            ) : (
                <>
                    {selectedTheme ? (
                        <>
                            <p className="py-4 text-sm font-normal uppercase">
                                selected theme
                            </p>
                            <div
                                className={`flex w-full gap-5 rounded-md bg-intg-bg-15 px-3 py-2 transition-all ease-in-out`}
                            >
                                <div className="flex gap-5">
                                    <div className="flex py-2">
                                        {Object.keys(colorScheme).map(
                                            (key: string, index: number) => {
                                                return (
                                                    <div
                                                        className={`h-8 w-8 rounded-full border-2 ${
                                                            index !== 0
                                                                ? "-ml-4"
                                                                : ""
                                                        }`}
                                                        key={index}
                                                        style={{
                                                            backgroundColor: `${colorScheme[key]}`,
                                                        }}
                                                    />
                                                );
                                            },
                                        )}
                                    </div>

                                    <div>
                                        <p className="font-normal leading-6 first-letter:capitalize">
                                            {selectedTheme.name}
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
                            count !== 0 ? "-mt-4 h-fit" : ""
                        } transition-all delay-100 duration-300 ease-in-out`}
                    >
                        <p className="py-2 text-sm font-normal capitalize">
                            all themes
                        </p>

                        <Button
                            text="new theme"
                            onClick={() => onOpen()}
                            variant="secondary"
                            className="text-sm font-normal first-letter:capitalize"
                        />

                        <div className="flex-col py-1 transition-all duration-300 ease-in-out">
                            {themes?.map(
                                (
                                    theme: Partial<ProjectTheme>,
                                    index: number,
                                ) => {
                                    return (
                                        <div key={index}>
                                            <ThemeCard
                                                activeTheme={
                                                    theme.id ===
                                                    selectedTheme?.id
                                                }
                                                theme={theme}
                                                onClick={() =>
                                                    handleSelectedTheme(theme)
                                                }
                                                toggleNewThemeModal={() =>
                                                    onOpen(theme)
                                                }
                                            />
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
