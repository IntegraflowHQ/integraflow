import { useTheme } from "@/modules/projects/hooks/useTheme";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { toast } from "@/utils/toast";

const PRESET_THEMES = [
    {
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

const getPresetThemes = () => {
    const themes = PRESET_THEMES.map((theme) => ({
        name: theme.name,
        colorScheme: theme.colorScheme,
        colors: Object.values(theme.colorScheme),
    }));

    return themes;
};

export const PresetThemes = () => {
    const presetThemes = getPresetThemes();
    const { survey } = useSurvey();
    const { createTheme, error } = useTheme();

    const handleCreateTheme = async (index: number) => {
        const theme = presetThemes[index];
        const surveyId = survey?.survey?.id;

        try {
            if (surveyId) {
                await createTheme(
                    {
                        name: theme.name,
                        colorScheme: theme.colorScheme,
                    },
                    surveyId ?? "",
                );

                // call update survey
                // trigger a callback to update the survey
                // with a prop onUpdateSurvey
                // on creation of a new theme, it returns a themeID which we'd pass
            }

            toast.success("Theme created successfully");
        } catch (err) {
            toast.error(error?.message || error?.networkError?.message || "");
        }
    };

    return (
        <div className="py-4">
            <p className="text-md py-3 font-normal text-intg-text-1 first-letter:capitalize">
                preset themes
            </p>

            <div className="flex flex-col">
                {presetThemes.map((theme, index) => (
                    <div
                        key={index}
                        onClick={() => handleCreateTheme(index)}
                        className="my-[6px] flex w-full rounded-md bg-intg-bg-15 px-2 py-2 transition-all ease-in-out hover:cursor-pointer"
                    >
                        <div className="flex gap-5">
                            <div className="flex py-2">
                                {theme.colors.map((color, index) => {
                                    return (
                                        <div
                                            key={index}
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
                                    Preset theme
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
