import * as Tabs from "@radix-ui/react-tabs";
import { MoreHorizontal, X } from "lucide-react";
import React from "react";
import { DesignEditorContent } from "./EditorContent";
import { ThemesMenu } from "./ThemesMenu";

const THEMES_INFO = [
  {
    name: "question",
    color: "linear-gradient(to right top, #299532, #7EE787)",
  },
  { name: "answer", color: "#ECB22E" },
  { name: "button", color: "#36C5F0" },
  { name: "background", color: "#E01E5A" },
];

export const UpdateDesignEditor = () => {
  const [newThemeOpenState, setOpenState] = React.useState<boolean>(false);

  const themeSettingsPanel = (
    <>
      <div className="h-fit rounded-md bg-intg-bg-9 px-4 py-2">
        <Tabs.Root className="flex justify-between border-b border-intg-bg-12">
          <Tabs.List aria-label="create a new theme">
            <Tabs.Trigger
              value="theme-name"
              className="border-intg-bg-14 border-b px-3 py-2 font-light capitalize text-white"
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

        {THEMES_INFO.map(
          ({ name, color }, index: React.Key | number | undefined) => {
            return (
              <div
                key={index}
                className="my-3 mb-3 flex w-full justify-between rounded-md bg-intg-bg-13 px-3 py-3"
              >
                <p className="py-1 font-light capitalize text-intg-text-2">
                  {name}
                </p>
                <div
                  className="h-8 w-8 rounded-full"
                  style={{
                    background: `${color}`,
                  }}
                />
              </div>
            );
          },
        )}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button className="bg-intg-bg-15 w-38 h-11 rounded-sm border border-intg-bg-2 px-3 font-normal text-white">
          Revert changes
        </button>

        <button className="w-38 h-11 rounded-sm bg-intg-bg-2 px-3 font-normal text-white">
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
            className="flex justify-between border-b border-intg-bg-12"
            defaultValue="theme"
          >
            <Tabs.List aria-label="update your theme survey">
              <Tabs.Trigger
                value="theme"
                className={`border-intg-bg-14 border border-x-0 border-t-0 px-3 py-2 font-light capitalize`}
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
