import * as Switch from "@radix-ui/react-switch";
import { Moon, Sun } from "lucide-react";
import React from "react";

export interface ToggleProps {
    label?: string;
    variant: "soft" | "solid" | "detailed";
}

/**
 * @param {string} variant accepts either "solid", "soft" or "detailed"
 * @param {string} label  accpets a string, but is optional. When you use it, it takes the `name` value from your data array.
 * @returns a react component `<SwitchToggle />
 * @example
 *
 * import {SwitchToggle, ToggleProps } from "@/ui/ToggleSwitch";
 *
 * interface SurveyProps extends ToggleProps {
 *    id: string;
 *   name: string;
 * }
 *
 *
 * const DATA: SurveyProps[] = [
 *   {
 *       id: crypto.randomUUID(),
 *       name: "Progress bar",
 *       variant: "soft",
 *   },
 * ];
 *
 *  <SwitchToggle label={DATA[0].name} variant={DATA[0].variant} />
 */

const BACKGROUND_THEMES = [
    { id: crypto.randomUUID(), name: "light", icon: <Sun size="20" /> },
    { id: crypto.randomUUID(), name: "dark", icon: <Moon size="20" /> },
];

export const SwitchToggle = ({
    variant,
    label,
}: ToggleProps & { label: string }) => {
    const defaultLabel = label || "survey item";
    const [backgroundTheme, setBackgroundTheme] = React.useState<string>("");

    const handleThemeChange = (index: number) => {
        const selectedTheme = BACKGROUND_THEMES[index];
        const selectedThemeId = selectedTheme.id;

        setBackgroundTheme(selectedThemeId);
    };

    React.useEffect(() => {
        handleThemeChange(0);
    }, []);

    return (
        <>
            <label htmlFor={defaultLabel} />

            {variant === "detailed" ? (
                <Switch.Root
                    id="toggle item"
                    className={`bg-intg-bg-18mt-[10px] h-11 w-40 rounded-md px-1`}
                >
                    <Switch.Thumb className="-mt-[4px] block h-8 w-[67px] translate-x-0.5 rounded-md bg-intg-bg-2 py-1 text-sm font-normal text-white transition-transform duration-100  will-change-transform data-[state=checked]:translate-x-[82px] data-[state=checked]:text-white" />
                    <div className="stickymt-[28px] flex w-36 items-center justify-between gap-2 px-1">
                        {BACKGROUND_THEMES.map(({ id, name, icon }, index) => {
                            return (
                                <div
                                    key={id}
                                    onClick={() => handleThemeChange(index)}
                                    className={`flex gap-1 px-[2px] py-[2px] text-center ${
                                        backgroundTheme === id
                                            ? "text-white"
                                            : "text-intg-text-4"
                                    }`}
                                >
                                    {icon}{" "}
                                    <p className="text-sm font-normal capitalize">
                                        {name}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </Switch.Root>
            ) : (
                <Switch.Root
                    id="toggle item"
                    className={`border-intg-bg-16  h-7 w-9 rounded-l-2xl rounded-r-2xl border-2 ${
                        variant === "solid" ? "bg-intg-bg-17" : ""
                    }`}
                >
                    <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-intg-bg-2 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[13px]" />
                </Switch.Root>
            )}
        </>
    );
};
