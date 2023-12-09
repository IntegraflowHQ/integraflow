import { ColorPicker } from "@/ui";
import * as Tabs from "@radix-ui/react-tabs";
import { MoreHorizontal, X } from "lucide-react";
import React from "react";
import { DesignEditorContent } from "./components/EditorContent";
import { ThemesMenu } from "./components/ThemesMenu";

const THEMES_INFO = [
    {
        id: crypto.randomUUID(),
        name: "question",
        color: "linear-gradient(to right top, #299532, #7EE787)",
    },
    { id: crypto.randomUUID(), name: "answer", color: "#ECB22E" },
    { id: crypto.randomUUID(), name: "button", color: "#36C5F0" },
    { id: crypto.randomUUID(), name: "background", color: "#E01E5A" },
];

export const UpdateDesignEditor = () => {
    const [newThemeOpenState, setOpenState] = React.useState<boolean>(false);
    const [selectedColor, setSelectedColor] = React.useState<string>("");
    const [themeOption, setThemeOption] = React.useState<string>("");

    const handleSelectedOption = (index: number, color: string) => {
        const selectedThemeOption = THEMES_INFO[index];
        setThemeOption(selectedThemeOption.id);

        if (themeOption) {
            setSelectedColor(color);
        }
    };

    const themeSettingsPanel = (
        <>
            <div className="h-fit rounded-md bg-intg-bg-9 px-4 py-2">
                <Tabs.Root className="flex justify-between border-b border-[#261f36]">
                    <Tabs.List aria-label="create a new theme">
                        <Tabs.Trigger
                            value="theme-name"
                            className="border-b border-[#6941c6] px-3 py-2 font-light capitalize text-white"
                        >
                            theme name
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
                    {THEMES_INFO.map(({ name, color, id }, index: number) => {
                        return (
                            <div
                                key={index}
                                className="my-3 mb-3 flex w-full justify-between rounded-md bg-[#272138] px-3 py-3"
                            >
                                <p className="py-1 font-light capitalize text-intg-text-2">
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
                                                themeOption === id
                                                    ? selectedColor
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
                {/* <Button variant="secondary" className="rounded-sm py-1">
                    Revert changes
                </Button>

                <Button variant="primary" className="rounded-sm py-1">
                    Update theme
                </Button> */}
                <button className="w-38 h-11 rounded-sm border border-intg-bg-2 bg-[#322751] px-3 font-normal text-white transition-all ease-in-out hover:border-2">
                    Revert changes
                </button>

                <button className="w-38 h-11 rounded-sm bg-intg-bg-2 px-3 font-normal text-white transition-all ease-in-out hover:bg-gradient-button-hover">
                    Update theme
                </button>
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
                        className="flex justify-between border-b border-[#261f36]"
                        defaultValue="theme"
                    >
                        <Tabs.List aria-label="update your theme survey">
                            <Tabs.Trigger
                                value="theme"
                                className={`border border-x-0 border-t-0 border-[#6941c6] px-3 py-2 font-light capitalize`}
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
