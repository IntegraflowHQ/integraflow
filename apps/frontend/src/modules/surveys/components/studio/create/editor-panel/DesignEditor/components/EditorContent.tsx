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
    const { survey } = useSurvey();
    const surveyTheme = survey?.survey?.theme ?? null;

    const [selectedTheme, setSelectedTheme] =
        React.useState<Partial<ProjectTheme>>();
    const { themes, error } = useThemes();

    const colorScheme = React.useMemo(() => {
        let colorScheme = {};

        try {
            colorScheme = JSON.parse(selectedTheme?.colorScheme ?? "{}");
        } catch (error) {
            colorScheme = selectedTheme?.colorScheme ?? {};
        }

        return colorScheme;
    }, [selectedTheme?.colorScheme]);

    const handleSelectedTheme = (theme: Partial<ProjectTheme>) => {
        setSelectedTheme(theme);
    };

    if (error) {
        toast.error(error.message || error.networkError?.message || "");
    }

    const count = themes?.length ?? 0;

    React.useEffect(() => {
        const theme = survey?.survey?.theme;

        setSelectedTheme(theme as Partial<ProjectTheme>);
    }, [survey]);

    return (
        <>
            <>
                <>
                    {count === 0 ? (
                        <Error message="You don't have any theme. Click the button below to create one or choose from our presets" />
                    ) : null}

                    {count === 0 && (
                        <Button
                            text="new theme"
                            onClick={() => onOpen()}
                            variant="secondary"
                            className="mb-2 mt-4 text-sm font-normal first-letter:capitalize"
                        />
                    )}

                    {count !== 0 ? (
                        <>
                            {selectedTheme ? (
                                <>
                                    <p className="py-4 text-sm font-normal uppercase">
                                        selected theme
                                    </p>
                                    <div
                                        className={` flex h-[100px] w-full gap-5 rounded-md bg-intg-bg-15 px-3 py-2`}
                                    >
                                        <div className="flex gap-5">
                                            <div className="flex py-2">
                                                {Object.keys(colorScheme).map(
                                                    (
                                                        key: string,
                                                        index: number,
                                                    ) => {
                                                        const color: {
                                                            [
                                                                Key: string
                                                            ]: string;
                                                        } = colorScheme;

                                                        return (
                                                            <div
                                                                className={`h-8 w-8 rounded-full border-2 ${
                                                                    index !== 0
                                                                        ? "-ml-4"
                                                                        : ""
                                                                }`}
                                                                key={index}
                                                                style={{
                                                                    backgroundColor: `${color[key]}`,
                                                                }}
                                                            />
                                                        );
                                                    },
                                                )}
                                            </div>

                                            <div>
                                                <p className="font-normal leading-6 first-letter:capitalize">
                                                    {selectedTheme?.name}
                                                </p>
                                                <p className="font-normal text-intg-text-4">
                                                    {selectedTheme
                                                        ? "Fetched theme"
                                                        : null}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="`flex h-[100px] w-full gap-5 rounded-md bg-intg-bg-15 px-3 py-2" />
                            )}

                            <Button
                                text="new theme"
                                onClick={() => onOpen()}
                                variant="secondary"
                                className="mb-2 mt-4 text-sm font-normal first-letter:capitalize"
                            />

                            <div
                                className={`mt-1 py-2 ${
                                    count !== 0 ? "-mt-4 h-fit" : ""
                                } transition-all delay-100 duration-300 ease-in`}
                            >
                                <p className="text-sm font-normal capitalize">
                                    all themes
                                </p>
                                <div
                                    className={`flex-col py-1 transition duration-300 ease-in`}
                                >
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
                                                            handleSelectedTheme(
                                                                theme,
                                                            )
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
                    ) : null}

                    <div
                        className={`-mt-3 ${
                            count !== 0 ? "h-[370px] translate-y-[20px]" : ""
                        } transition-all delay-100 duration-300 ease-in`}
                    >
                        {count !== 0 && (
                            <hr className="border-1 border-intg-bg-14" />
                        )}

                        <PresetThemes />
                    </div>
                </>
            </>
        </>
    );
};
