import { ProjectTheme } from "@/generated/graphql";
import { PresetThemes } from "@/modules/projects/components/PresetThemes";
import { ThemeCard } from "@/modules/projects/components/ThemeCard";
import { useTheme } from "@/modules/projects/hooks/useTheme";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { useStudioStore } from "@/modules/surveys/states/studio";
import { Button } from "@/ui";
import { Info } from "@/ui/Info";
import { useCallback, useMemo, useState } from "react";

interface ContentProp {
    onOpen: (theme?: Partial<ProjectTheme>) => void;
}

export const DesignEditorContent = ({ onOpen }: ContentProp) => {
    const [selectedTheme, setSelectedTheme] = useState<Partial<ProjectTheme>>();

    const { survey, updateSurvey } = useSurvey();
    const surveyTheme = survey?.theme;

    const { themes, loading } = useTheme();

    const theme = useMemo(() => {
        if (selectedTheme?.id && selectedTheme?.colorScheme) {
            return selectedTheme;
        }

        if (surveyTheme?.id && surveyTheme?.colorScheme) {
            return surveyTheme;
        }

        return null;
    }, [selectedTheme, surveyTheme]);

    const colorScheme = useMemo(() => {
        let colorScheme = {};

        try {
            colorScheme = JSON.parse(theme?.colorScheme ?? "{}");
        } catch (error) {
            colorScheme = theme?.colorScheme ?? {};
        }

        return colorScheme;
    }, [theme]);

    const handleSelectedTheme = useCallback(
        (theme: Partial<ProjectTheme>) => {
            if (survey) {
                setSelectedTheme(theme);
                updateSurvey(survey, { themeId: theme.id });
            }
        },
        [survey, updateSurvey],
    );

    const count = themes?.length ?? 0;
    const createNewTheme = () => {
        useStudioStore.setState({ editTheme: false });
        onOpen();
    };

    return (
        <>
            {theme ? (
                <div>
                    <p className="py-4 text-sm font-normal uppercase">selected theme</p>
                    <div className={`flex h-16 w-full gap-5 rounded-md  bg-intg-bg-15 px-3 py-2`}>
                        <div className="flex gap-5">
                            <div className="flex py-2">
                                {Object.keys(colorScheme).map((key: string, index: number) => {
                                    const color: {
                                        [Key: string]: string;
                                    } = colorScheme;

                                    return (
                                        <div
                                            className={`h-8 w-8 rounded-full border-2 ${index !== 0 ? "-ml-4" : ""}`}
                                            key={index}
                                            style={{
                                                backgroundColor: `${color[key]}`,
                                            }}
                                        />
                                    );
                                })}
                            </div>

                            <div>
                                <p className="font-normal leading-6 first-letter:capitalize">{theme?.name}</p>
                                <p className="font-normal text-intg-text-4">
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                    {/* @ts-ignore */}
                                    {colorScheme["question"] ? "Fetched theme" : null}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Info message="You have not selected any theme for this survey." />
            )}

            <Button
                text="new theme"
                onClick={() => createNewTheme()}
                variant="secondary"
                className="mb-2 mt-4 text-sm font-normal first-letter:capitalize"
            />

            {!loading && count === 0 && (
                <Info message="You don't have any theme. Click the button below to create one or choose from our presets" />
            )}

            {!loading && count !== 0 && (
                <div
                    className={`mt-1 py-2 ${
                        count !== 0 ? "-mt-4 h-fit" : ""
                    } transition-all delay-100 duration-300 ease-in`}
                >
                    <p className="text-sm font-normal capitalize">all themes</p>
                    <div className={`flex-col py-1 transition duration-300 ease-in`}>
                        {themes?.map((projectTheme: Partial<ProjectTheme>, index: number) => {
                            return (
                                <div key={index}>
                                    <ThemeCard
                                        activeTheme={projectTheme.id === theme?.id}
                                        theme={projectTheme}
                                        onClick={() => handleSelectedTheme(projectTheme)}
                                        toggleNewThemeModal={() => onOpen(projectTheme)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {count <= 5 && (
                <div
                    className={`-mt-3 ${
                        count !== 0 ? "h-[395px] translate-y-[20px]" : ""
                    } transition-all delay-100 duration-300 ease-in`}
                >
                    {count !== 0 && <hr className="border-1 border-intg-bg-14" />}

                    <PresetThemes onThemeSelected={async (theme) => handleSelectedTheme(theme)} />
                </div>
            )}
        </>
    );
};
