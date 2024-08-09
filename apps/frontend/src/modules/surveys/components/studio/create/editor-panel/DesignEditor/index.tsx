import { ProjectTheme } from "@/generated/graphql";
import { PresetThemes } from "@/modules/projects/components/PresetThemes";
import { ThemeCard } from "@/modules/projects/components/ThemeCard";
import { useTheme } from "@/modules/projects/hooks/useTheme";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { useStudioStore } from "@/modules/surveys/states/studio";
import { Theme } from "@/types";
import { Button, Info } from "@/ui";
import { parseTheme } from "@/utils";
import { toast } from "@/utils/toast";
import { useState } from "react";
import { ThemeEditor } from "./ThemeEditor";

const CREATE_THEME_DEFAULT_VALUE: Theme = {
    id: null,
    name: "",
    colorScheme: {
        question: "#A0EFF2",
        answer: "#ECB22E",
        progressBar: "#FF9551",
        button: "#36C5F0",
        background: "#E01E5A",
    },
};

export const UpdateDesignEditor = () => {
    const { updateSurvey, survey } = useSurvey();
    const { themes, loading, createTheme, updateTheme, deleteTheme } = useTheme();
    const [themeEditorValue, setThemeEditorValue] = useState<Theme | null>(null);
    const { theme: surveyTheme, updateStudio } = useStudioStore((state) => state);

    const handleSelectedTheme = async (theme: Theme) => {
        if (!survey || !theme.id) {
            return;
        }

        const prevTheme = survey.theme ? (JSON.parse(JSON.stringify(survey.theme)) as ProjectTheme) : undefined;

        updateStudio({ theme });
        const result = await updateSurvey(
            {
                ...survey,
                theme: {
                    ...survey.theme,
                    id: theme.id,
                    name: theme.name,
                    colorScheme: JSON.stringify(theme.colorScheme),
                },
            },
            { themeId: theme.id },
        );

        if (result.errors && result.errors.length > 0) {
            updateStudio({ theme: parseTheme(prevTheme as ProjectTheme) });
        }
    };

    const handleSubmit = async (theme: Theme) => {
        if (!theme.name) {
            return toast.error("Please enter a theme name.");
        }
        if (!survey) {
            return;
        }

        updateStudio({ theme });

        const prevTheme = survey.theme ? (JSON.parse(JSON.stringify(survey.theme)) as ProjectTheme) : undefined;

        if (theme.id) {
            updateTheme({
                theme,
                onSuccess: (newTheme) => {
                    if (theme.id === surveyTheme?.id) {
                        updateSurvey(
                            {
                                ...survey,
                                theme: { ...survey.theme, ...newTheme },
                            },
                            { themeId: theme.id },
                        );
                    }
                },
                onError: () => {
                    if (theme.id === surveyTheme?.id && prevTheme) {
                        updateSurvey(
                            {
                                ...survey,
                                theme: prevTheme,
                            },
                            { themeId: prevTheme.id },
                        );
                        updateStudio({ theme: prevTheme ? parseTheme(prevTheme as ProjectTheme) : null });
                    }
                    toast.error("An error occurred while updating theme, please try again later.");
                },
            });
        } else {
            createTheme({
                input: {
                    id: crypto.randomUUID(),
                    name: theme.name,
                    colorScheme: JSON.stringify(theme.colorScheme),
                },
                onSuccess: (newTheme) => {
                    updateSurvey(
                        {
                            ...survey,
                            theme: newTheme,
                        },
                        {
                            themeId: newTheme.id,
                        },
                    );
                },
                onError: () => {
                    if (prevTheme) {
                        updateSurvey(
                            {
                                ...survey,
                                theme: prevTheme,
                            },
                            { themeId: prevTheme.id },
                        );
                        updateStudio({ theme: prevTheme ? parseTheme(prevTheme as ProjectTheme) : null });
                    }
                    toast.error("An error occurred while creating theme, please try again later.");
                },
            });
        }
        setThemeEditorValue(null);
    };

    const handleDeleteTheme = async () => {
        if (!themeEditorValue?.id || !survey) {
            return;
        }

        const prevTheme = survey.theme ? JSON.parse(JSON.stringify(survey.theme)) : undefined;

        updateStudio({ theme: null });
        deleteTheme({
            themeId: themeEditorValue.id,
            onSuccess: () => {
                if (surveyTheme?.id === themeEditorValue.id) {
                    updateSurvey({ ...survey, theme: null }, { themeId: undefined });
                }
            },
            onError: () => {
                if (prevTheme) {
                    updateSurvey(
                        {
                            ...survey,
                            theme: prevTheme,
                        },
                        { themeId: prevTheme.id },
                    );
                    updateStudio({ theme: parseTheme(prevTheme as ProjectTheme) });
                }

                toast.error("An error occurred while deleting theme, please try again later.");
            },
        });

        setThemeEditorValue(null);
    };

    if (themeEditorValue) {
        return (
            <ThemeEditor
                defaultValue={themeEditorValue}
                createMode={themeEditorValue.id ? false : true}
                onCompleted={handleSubmit}
                onDeleteClicked={handleDeleteTheme}
                onClose={() => {
                    setThemeEditorValue(null);
                }}
            />
        );
    }

    return (
        <div className="h-fit rounded-md bg-intg-bg-9 px-4 py-2 text-white">
            <div className="flex justify-between border-b border-intg-bg-14" defaultValue="theme">
                <div
                    className={`border border-x-0 border-t-0 border-[#6941c6] px-3 py-2 text-sm font-normal capitalize`}
                >
                    themes
                </div>
            </div>

            <div className="mt-4">
                {surveyTheme && surveyTheme.name && surveyTheme.colorScheme ? (
                    <div>
                        <p className="py-4 text-sm font-normal uppercase">selected theme</p>
                        <ThemeCard name={surveyTheme.name ?? ""} colorScheme={surveyTheme.colorScheme} />
                    </div>
                ) : (
                    <Info message="You have not selected any theme for this survey." />
                )}

                <Button
                    text="new theme"
                    onClick={() => {
                        setThemeEditorValue(CREATE_THEME_DEFAULT_VALUE);
                    }}
                    variant="secondary"
                    className="mb-2 mt-4 text-sm font-normal first-letter:capitalize"
                />

                {!loading && themes.length === 0 && (
                    <Info message="You don't have any theme. Click the button below to create one or choose from our presets" />
                )}

                {!loading && themes.length !== 0 && (
                    <div
                        className={`mt-1 py-2 ${
                            themes.length !== 0 ? "-mt-4 h-fit" : ""
                        } transition-all delay-100 duration-300 ease-in`}
                    >
                        <p className="text-sm font-normal capitalize">all themes</p>

                        <div className={`flex flex-col gap-1.5 py-1 transition duration-300 ease-in`}>
                            {themes?.map((t, index) => {
                                return (
                                    <div key={index}>
                                        <ThemeCard
                                            active={t.id === surveyTheme?.id}
                                            name={t.name ?? ""}
                                            colorScheme={t.colorScheme}
                                            onClick={() => handleSelectedTheme(t)}
                                            onEditClicked={() => {
                                                setThemeEditorValue(t);
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {themes.length < 5 && (
                    <div
                        className={`-mt-3 ${
                            themes.length !== 0 ? "h-[395px] translate-y-[20px]" : ""
                        } transition-all delay-100 duration-300 ease-in`}
                    >
                        {themes.length !== 0 && <hr className="border-1 border-intg-bg-14" />}

                        <PresetThemes onThemeSelect={handleSubmit} />
                    </div>
                )}
            </div>
        </div>
    );
};
