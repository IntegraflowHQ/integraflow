import * as Tabs from "@radix-ui/react-tabs";
import { MoreHorizontal, X } from "lucide-react";
import React from "react";
import { DesignEditorContent } from "./EditorContent";

const TABS = [
  {
    id: crypto.randomUUID(),
    label: "theme",
    content: <DesignEditorContent />,
  },
];

export const UpdateDesignEditor = () => {
  const [activeThemeTab, setActiveThemeTab] = React.useState(TABS[0].id);

  React.useEffect(() => {
    setActiveThemeTab(TABS[0].id);
  }, []);

  return (
    <div className="-pb-2 h-fit rounded-md bg-intg-bg-9 px-4 py-2 text-white">
      <Tabs.Root
        className="flex justify-between border-b border-intg-bg-12"
        defaultValue="theme"
      >
        <Tabs.List aria-label="update your theme survey">
          {TABS.map(({ label, id }, index: React.Key | undefined | number) => {
            return (
              <Tabs.Trigger
                key={`studio-theme-${id}-${index}`}
                value="theme"
                className={`${
                  activeThemeTab === id ? "border-intg-bg-14" : ""
                } border border-x-0 border-t-0 px-3 py-2 font-light capitalize`}
              >
                {label}
              </Tabs.Trigger>
            );
          })}
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

      <div className="mt-4">{TABS[0].content}</div>
    </div>
  );
};
