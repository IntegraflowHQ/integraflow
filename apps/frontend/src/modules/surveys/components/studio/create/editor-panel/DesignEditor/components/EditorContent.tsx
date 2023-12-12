import { useThemes } from "@/modules/projects/hooks/useTheme";
import { Button } from "@/ui";
import React from "react";
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
    const THEMES = data?.reverse();

    const palettes = data?.map((theme) => theme.colorPalette);
    const themeName = data?.map((theme) => theme.name);
    const themeId = data?.map((theme) => theme.id);
    const selectedThemeIndex = themeId?.indexOf(selectedTheme ?? "");

    const onSelectedTheme = (index: number) => {
        const selectedTheme = themeId?.[index];
        setSelectedTheme(selectedTheme || "");
    };

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
                    {!loading ? (
                        <>
                            <p className="py-4 text-sm font-normal uppercase">
                                Selected Theme
                            </p>

                            <div
                                className={`trans flex w-full gap-5 rounded-md bg-intg-bg-15 px-3 py-2 transition-all ease-in-out`}
                                onClick={() =>
                                    onSelectedTheme(
                                        selectedThemeIndex as number,
                                    )
                                }
                            >
                                <div className="flex py-2">
                                    {palettes
                                        ?.find(
                                            (_, index) =>
                                                index === selectedThemeIndex,
                                        )
                                        ?.map((color, colorIndex) => (
                                            <div
                                                className={`h-8 w-8 rounded-full border-2  ${
                                                    colorIndex !== 0
                                                        ? "-ml-4"
                                                        : ""
                                                }`}
                                                key={colorIndex}
                                                style={{
                                                    backgroundColor: color,
                                                }}
                                            />
                                        ))}
                                </div>

                                <div>
                                    <p className="text-base font-normal leading-6">
                                        {themeName?.find(
                                            (_, index) =>
                                                index === selectedThemeIndex,
                                        )}
                                    </p>
                                    <p className="text-sm font-normal text-intg-text-4">
                                        Fetched theme
                                    </p>
                                </div>
                            </div>

                            {totalCount === 0 ? (
                                <Button
                                    text="new theme"
                                    onClick={onOpen}
                                    variant="secondary"
                                    className="mb-2 mt-4 text-sm font-normal first-letter:capitalize"
                                />
                            ) : (
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

                                    <div className="flex-col">
                                        {THEMES?.map((theme, index: number) => {
                                            return (
                                                <div key={index}>
                                                    <ThemeCard
                                                        activeTheme={
                                                            index ===
                                                            selectedThemeIndex
                                                        }
                                                        themeData={theme}
                                                        onClick={() =>
                                                            onSelectedTheme(
                                                                index as number,
                                                            )
                                                        }
                                                        toggleNewThemeModal={
                                                            onOpen
                                                        }
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
            )}
        </div>
    );
};
