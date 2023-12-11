import { useThemes } from "@/modules/projects/hooks/useTheme";
import { Button } from "@/ui";
import React from "react";
import { ThemeCard } from "./ThemeCard";

const THEMES = [
    {
        palette: ["#CCA8E9", "#C3BEF0", "#CADEFC", "#DEFCF9"],
        themeName: "Outer space",
    },
    {
        palette: ["#748DA6", "#9CB4CC", "#D3CEDF", "#F2D7D9"],
        themeName: "Tropical tone",
    },
    {
        palette: ["#EEF2E6", "#D6CDA4", "#3D8361", "#1C6758"],
        themeName: "Battle cat",
    },
    {
        palette: ["#BFACE0", "#BFACE0", "#A084CA", "#645CAA"],
        themeName: "Impressionist blue",
    },
    {
        palette: ["#7A4495", "#B270A2", "#FF8FB1", "#FCE2DB"],
        themeName: "Vanilla pudding",
    },
    {
        palette: ["#FFEEAF", "#E1FFEE", "#A5F1E9", "#7FBCD2"],
        themeName: "Azure blue",
    },
    {
        palette: ["#54BAB9", "#9ED2C6", "#E9DAC1", "#F7ECDE"],
        themeName: "Tint of rose",
    },
];

interface ContentProp {
    onOpen: () => void;
}

export const DesignEditorContent = ({ onOpen }: ContentProp) => {
    const { themes, loading } = useThemes();
    const { data } = themes;

    const palettes = data?.map((theme) => theme.colorPalette);

    console.log(palettes);

    return (
        <div>
            <p className="py-4 text-sm font-normal uppercase">Selected Theme</p>

            <div className="flex w-full gap-5 rounded-md bg-intg-bg-15 px-3 py-2">
                {/* color palette -- theme */}
                {!loading ? (
                    <div className="flex py-2">
                        {palettes?.map((palette, index) => (
                            <div className="flex" key={index}>
                                {palette?.map((color, colorIndex) => (
                                    <div
                                        className={`h-8 w-8 rounded-full border-2 ${
                                            colorIndex !== 0 ? "-ml-3" : ""
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
                ) : (
                    <div className="flex py-2 text-sm font-normal text-intg-text-2">
                        loading...
                    </div>
                )}

                <div>
                    <p className="text-base font-normal leading-6">
                        Your branded dark theme
                    </p>
                    <p className="text-sm font-normal text-intg-text-4">
                        Fetched theme
                    </p>
                </div>
            </div>

            {/* all themes */}
            <div className="h-full py-6">
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
                    {THEMES?.map(
                        (theme, index: React.Key | number | number) => {
                            return <ThemeCard themeData={theme} key={index} />;
                        },
                    )}
                </div>
            </div>
        </div>
    );
};
