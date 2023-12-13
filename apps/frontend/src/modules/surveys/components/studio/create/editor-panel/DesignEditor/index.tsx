import { useThemes } from "@/modules/projects/hooks/useTheme";
import { Button, ColorPicker } from "@/ui";
import { toast } from "@/utils/toast";
import * as Tabs from "@radix-ui/react-tabs";
import { MoreHorizontal, X } from "lucide-react";
import React from "react";
import { DesignEditorContent } from "./components/EditorContent";
import { ThemesMenu } from "./components/ThemesMenu";

const THEMES_INFO = [
    {
        id: crypto.randomUUID(),
        name: "question",
        color: "#A0EFF2",
    },
    { id: crypto.randomUUID(), name: "answer", color: "#ECB22E" },
    { id: crypto.randomUUID(), name: "progress", color: "#FF9551" },
    { id: crypto.randomUUID(), name: "button", color: "#36C5F0" },
    { id: crypto.randomUUID(), name: "background", color: "#E01E5A" },
];

export const UpdateDesignEditor = () => {
    const [newThemeOpenState, setOpenState] = React.useState<boolean>(false);
    const [selectedColors, setSelectedColors] = React.useState<{
        [Key: string]: string;
    }>({});
    const [, setThemeOption] = React.useState<string>("");

    // query fields
    const [themeName, setThemeName] = React.useState<string>("");
    const [colorScheme, setColorScheme] = React.useState<string>("");

    const { createTheme } = useThemes();

    const handleCreateTheme = () => {
        if (themeName && colorScheme !== "") {
            createTheme(themeName, JSON.parse(colorScheme));
            toast.success("Theme created successfully");
        } else {
            toast.error("Please fill all the fields");
        }
    };

    const handleThemeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setThemeName(e.target.value);
    };

    const handleSelectedOption = (index: number, color: string) => {
        const selectedThemeOption = THEMES_INFO[index];
        setThemeOption(selectedThemeOption.id);

        const updatedTheme = THEMES_INFO.map((theme, i) => {
            if (i === index) {
                return {
                    ...theme,
                    color,
                };
            }
            return theme;
        });

        const updatedThemeData = updatedTheme.map((theme) =>
            theme.id === selectedThemeOption.id ? { ...theme, color } : theme,
        );

        const colors: { [key: string]: string } = {};
        for (const theme of updatedThemeData) {
            colors[theme.name] = theme.color;
        }

        setSelectedColors({
            ...selectedColors,
            [selectedThemeOption?.name]: color,
        });
        setColorScheme(JSON.stringify(colors));
    };

    const themeSettingsPanel = (
        <>
            <div className="delay-400 h-fit rounded-md bg-intg-bg-9 px-4 py-2 transition-all ease-in-out">
                <Tabs.Root className="flex justify-between border-b border-intg-bg-14">
                    <Tabs.List aria-label="create a new theme">
                        <Tabs.Trigger
                            value="theme-name"
                            className="border-b border-[#6941c6]"
                        >
                            <input
                                type="text"
                                value={themeName}
                                placeholder="Theme name"
                                onChange={(e) => handleThemeName(e)}
                                className="w-[120px] text-ellipsis bg-transparent px-3 py-2 text-sm font-normal capitalize text-intg-text-2 focus:outline-intg-bg-2"
                            />
                        </Tabs.Trigger>
                    </Tabs.List>

                    <div className="mt-2 flex gap-2">
                        <ThemesMenu />
                        <div
                            className="hover:cursor-pointer"
                            onClick={() => setOpenState(!true)}
                        >
                            <X size={25} color="#AFAAC7" />
                        </div>
                    </div>
                </Tabs.Root>

                <>
                    {THEMES_INFO.map(({ name, color }, index: number) => {
                        return (
                            <div
                                key={index}
                                className="my-3 mb-3 flex w-full justify-between rounded-md bg-intg-bg-15 px-3 py-3"
                            >
                                <p className="py-1 text-sm font-normal capitalize text-intg-text-2">
                                    {name}
                                </p>

                                <ColorPicker
                                    onChange={(color) => {
                                        handleSelectedOption(index, color);
                                    }}
                                >
                                    <div
                                        className="h-8 w-8 cursor-pointer rounded-full"
                                        style={{
                                            background: `${
                                                selectedColors[
                                                    THEMES_INFO[index].name
                                                ]
                                                    ? selectedColors[
                                                          THEMES_INFO[index]
                                                              .name
                                                      ]
                                                    : color
                                            }`,
                                        }}
                                    />
                                </ColorPicker>
                            </div>
                        );
                    })}
                </>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <Button
                    onClick={handleCreateTheme}
                    text="Update theme"
                    className="w-max px-[12px] py-[12px] font-normal"
                />
            </div>
        </>
    );

    const onOpen = () => {
        setOpenState(!false);
    };

    return (
        <>
            {!newThemeOpenState ? (
                <div className="h-fit rounded-md bg-intg-bg-9 px-4 py-2 text-white">
                    <Tabs.Root
                        className="flex justify-between border-b border-intg-bg-14"
                        defaultValue="theme"
                    >
                        <Tabs.List aria-label="update your theme survey">
                            <Tabs.Trigger
                                value="theme"
                                className={`border border-x-0 border-t-0 border-[#6941c6] px-3 py-2 text-sm font-normal capitalize`}
                            >
                                theme
                            </Tabs.Trigger>
                        </Tabs.List>

                        {/* tab controls */}
                        <div className="mt-2 flex gap-2">
                            <div className="hover:cursor-pointer">
                                <MoreHorizontal size={25} color="#AFAAC7" />
                            </div>
                            <div className="hover:cursor-pointer">
                                <X size={25} color="#AFAAC7" />
                            </div>
                        </div>
                    </Tabs.Root>

                    <div className="mt-4">
                        <DesignEditorContent onOpen={onOpen} />
                    </div>
                </div>
            ) : (
                themeSettingsPanel
            )}
        </>
    );
};
