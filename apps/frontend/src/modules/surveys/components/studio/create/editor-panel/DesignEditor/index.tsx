import { ProjectTheme } from "@/generated/graphql";
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
    const [theme, setTheme] = React.useState<Partial<ProjectTheme>>();

    const { createTheme, updateTheme } = useThemes();

    const handleCreateTheme = () => {
        if (theme?.name && theme.colorScheme) {
            if (theme.id) {
                updateTheme(theme);
                toast.success("Theme updated successfully");
                setOpenState(!newThemeOpenState);
            } else {
                createTheme(theme);
                toast.success("Theme created successfully");
                setOpenState(!newThemeOpenState);
            }
        } else {
            toast.error("Please fill all the fields");
        }
    };

    const handleThemeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTheme({
            ...(theme ?? {}),
            name: e.target.value,
        });
    };

    const onOpen = (theme?: Partial<ProjectTheme>) => {
        transformTheme(theme);
        setOpenState(true);
    };

    const handleSelectedOption = (
        themeInfo: (typeof THEMES_INFO)[0],
        color: string,
    ) => {
        const colorScheme: { [key: string]: string } = {};

        for (let i = 0; i < THEMES_INFO.length; i++) {
            colorScheme[THEMES_INFO[i]?.name] =
                theme?.colorScheme?.[THEMES_INFO[i]?.name] ??
                THEMES_INFO[i].color;

            if (THEMES_INFO[i]?.name === themeInfo.name) {
                colorScheme[THEMES_INFO[i]?.name] = color;
            }
        }

        setTheme({
            ...(theme ?? {}),
            colorScheme,
        });
    };

    const transformTheme = (theme?: Partial<ProjectTheme>) => {
        const colorScheme: { [key: string]: string } = {};

        for (let i = 0; i < THEMES_INFO.length; i++) {
            colorScheme[THEMES_INFO[i]?.name] =
                theme?.colorScheme?.[THEMES_INFO[i]?.name] ??
                THEMES_INFO[i].color;
        }

        setTheme({
            ...(theme ?? {}),
            name: theme?.name ?? "",
            colorScheme,
        });
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
                                value={theme?.name ?? ""}
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
                    {THEMES_INFO.map((themeInfo) => {
                        return (
                            <div
                                key={themeInfo.id}
                                className="my-3 mb-3 flex w-full justify-between rounded-md bg-intg-bg-15 px-3 py-3"
                            >
                                <p className="py-1 text-sm font-normal capitalize text-intg-text-2">
                                    {themeInfo.name}
                                </p>

                                <ColorPicker
                                    onChange={(color) => {
                                        handleSelectedOption(themeInfo, color);
                                    }}
                                >
                                    {" "}
                                    <div
                                        className="h-8 w-8 cursor-pointer rounded-full"
                                        style={{
                                            background:
                                                theme?.colorScheme?.[
                                                    themeInfo.name
                                                ] ?? themeInfo.color,
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
