import { useThemes } from "@/modules/projects/hooks/useTheme";

const PRESET_THEMES = [
    {
        name: "Outer space",
        colorScheme: {
            question: "#9CB4CC",
            answer: "#FF8FB1",
            progress: "#D3CEDF",
            button: "#F2D7D9",
            background: "#7FBCD2",
        },
    },
    {
        name: "Tropical tone",
        colorScheme: {
            question: "#F7D6E0",
            answer: "#CCA8E9",
            progress: "#C3BEF0",
            button: "#CADEFC",
            background: "#DEFCF9",
        },
    },
    {
        name: "Battle cat",
        colorScheme: {
            question: "#9CB4CC",
            answer: "#FF8FB1",
            progress: "#D3CEDF",
            button: "#FCE8DA",
            background: "#F2D7D9",
        },
    },
];

const getPresetThemes = () => {
    const themes = [];

    for (const theme of PRESET_THEMES) {
        const { name, colorScheme } = theme;
        const themeColors = Object.keys(colorScheme).map(
            (key) => theme?.colorScheme[key as keyof typeof theme.colorScheme],
        );

        themes.push({
            name,
            colors: themeColors,
        });
    }

    return themes;
};

export const PresetThemes = () => {
    const presetThemes = getPresetThemes();
    const { createTheme } = useThemes();

    const handleCreateTheme = (index: number) => {
        const theme = presetThemes[index];
        createTheme(theme.name, JSON.parse(JSON.stringify(theme.colors)));
    };

    return (
        <div className="cursor:pointer py-4">
            <p className="text-md font-normal text-intg-text-1 first-letter:capitalize">
                preset themes
            </p>

            <div className="flex flex-col">
                {presetThemes.map((theme, index) => (
                    <div
                        key={index}
                        onClick={() => handleCreateTheme(index)}
                        className="my-[6px] flex w-full rounded-md bg-intg-bg-15 px-2 py-2 transition-all ease-in-out"
                    >
                        <div className="flex gap-5">
                            <div className="flex py-2">
                                {theme.colors.map((color, index) => {
                                    return (
                                        <div
                                            className={`${
                                                index !== 0 ? "-ml-4" : ""
                                            } h-8 w-8 rounded-full border-2 py-2`}
                                            style={{
                                                background: `${color}`,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                            <div>
                                <p className="font-normal leading-6 text-intg-text-1 first-letter:capitalize">
                                    {theme.name}
                                </p>
                                <p className="font-normal text-intg-text-4">
                                    Fetched theme
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
