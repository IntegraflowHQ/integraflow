import { useThemes } from "@/modules/projects/hooks/useTheme";
import { Button } from "@/ui";
import React from "react";
import { Error } from "./Errors";
import { ThemeCard } from "./ThemeCard";

interface ContentProp {
    onOpen: () => void;
}

export const DesignEditorContent = ({ onOpen }: ContentProp) => {
    const [selectedTheme, setSelectedTheme] = React.useState<string>("");

    const { themes, error, loading } = useThemes();
    const { data, totalCount } = themes;
    const THEMES = data;

    const palettes = data?.map((theme) => theme.colorPalette);
    const themeName = data?.map((theme) => theme.name);
    const themeId = data?.map((theme) => theme.id);

    const onSelectedTheme = (index: number) => {
        const selectedTheme = themeId?.[index];
        setSelectedTheme(selectedTheme || "");
    };

    const selectedThemePosition = THEMES?.findIndex(
        (theme) => theme.id === selectedTheme,
    );
    console.log(`slected theme index ${selectedThemePosition}`);

    return (
        <div>
            {totalCount === 0 ? (
                <Error message="You don't have any theme. Click the button below to create one." />
            ) : error?.networkError ? (
                <Error
                    message={
                        error?.networkError?.message ||
                        "An error occurred while loading themes. Please check your internet connection and try again."
                    }
                />
            ) : error ? (
                <Error
                    message={
                        error?.message
                            ? error.message
                            : "An error occured, try refreshng your browser. If the error still persists, contact support."
                    }
                />
            ) : (
                <>
                    <p className="py-4 text-sm font-normal uppercase">
                        Selected Theme
                    </p>

                    {!loading ? (
                        <div
                            className={`flex w-full gap-5 rounded-md border border-red-400 bg-intg-bg-15 px-3 py-2 transition-all ease-in-out`}
                            style={{
                                transform: `translateY(${
                                    (selectedThemePosition ?? 0 + 1) > 1
                                        ? (selectedThemePosition ?? 0 + 1) * 174
                                        : (selectedThemePosition ?? 0 + 1) * 248
                                }px)`,
                            }}
                            onClick={() =>
                                onSelectedTheme(
                                    parseInt(themes.data?.[1].id || ""),
                                )
                            }
                        >
                            <div className="flex py-2">
                                {palettes?.slice(1)?.map((palette, index) => (
                                    <div className="flex" key={index}>
                                        {palette?.map((color, colorIndex) => (
                                            <div
                                                className={`h-8 w-8 rounded-full border-2 ${
                                                    colorIndex !== 0
                                                        ? "-ml-3"
                                                        : ""
                                                }`}
                                                key={colorIndex}
                                                style={{
                                                    backgroundColor: color,
                                                }}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div>
                                <p className="text-base font-normal leading-6">
                                    {themeName?.slice(1)}
                                </p>
                                <p className="text-sm font-normal text-intg-text-4">
                                    Fetched theme
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex py-2 text-sm font-normal text-intg-text-2">
                            loading...
                        </div>
                    )}
                </>
            )}

            <div
                className={`h-full py-6  ${
                    totalCount === 2 ? "-mt-4" : ""
                } transition-all delay-300 ease-in-out`}
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

                {totalCount === 0 ? null : (
                    <div className="flex-col">
                        {THEMES?.map((theme, index: number) => {
                            const themeCardPosition: number = index + 1;
                            const isSelected = selectedTheme === theme.id;
                            const translateY = isSelected
                                ? themeCardPosition > 1
                                    ? themeCardPosition * 125
                                    : 174
                                : 174;

                            return (
                                <div
                                    className={`${
                                        isSelected ? "" : "translate-y-0"
                                    } transition-all delay-300 ease-in-out`}
                                    style={
                                        isSelected
                                            ? {
                                                  transform: `translateY(-${translateY}px)`,
                                              }
                                            : {
                                                  transform: `translateY(${0}px)`,
                                              }
                                    }
                                    key={index}
                                >
                                    <ThemeCard
                                        themeData={theme}
                                        onClick={() =>
                                            onSelectedTheme(index as number)
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
