import { Theme } from "@/types";
import { ThemeCard } from "./ThemeCard";

const PRESET_THEMES: Theme[] = [
    {
        id: null,
        name: "Inferno Dragon",
        colorScheme: {
            question: "#ee9b0c",
            answer: "#ec0b0b",
            progress: "#ff2a05",
            button: "#d0a689",
            background: "#db420a",
        },
    },
    {
        id: null,
        name: "Deep Space",
        colorScheme: {
            answer: "#041b3f",
            background: "#0b1527",
            button: "#6799e5",
            progress: "#071f41",
            question: "#010c1e",
        },
    },
    {
        id: null,
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
        id: null,
        name: "Rain Forest",
        colorScheme: {
            question: "#7bfda2",
            answer: "#78e510",
            progress: "#d9e51a",
            button: "#dbbe11",
            background: "#ec7e0f",
        },
    },
];

export interface PresetThemesProps {
    onThemeSelect: (theme: Theme) => void;
}

export const PresetThemes = ({ onThemeSelect }: PresetThemesProps) => {
    return (
        <div className="py-4">
            <p className="text-md py-3 font-normal text-intg-text-1 first-letter:capitalize">preset themes</p>

            <div className="flex flex-col gap-1.5">
                {PRESET_THEMES.map((theme) => (
                    <ThemeCard
                        preset
                        name={theme.name}
                        colorScheme={theme.colorScheme}
                        onClick={() => onThemeSelect(theme)}
                        key={theme.name}
                    />
                ))}
            </div>
        </div>
    );
};
