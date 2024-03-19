import { ColorScheme } from "@/types";
import { themeKeys } from "@/utils";
import { CheckCircle, Pen } from "lucide-react";
import React from "react";

type Props = {
    name: string;
    colorScheme: ColorScheme;
    preset?: boolean;
    active?: boolean;
    onClick?: () => void;
    onEditClicked?: () => void;
};

export const ThemeCard = ({ name, colorScheme, onClick, onEditClicked, active = false, preset = false }: Props) => {
    const [isHovered, setIsHovered] = React.useState<boolean>(false);

    const togglePenVisibility = () => {
        setIsHovered(!isHovered);
    };

    return (
        <div
            className={`${
                active ? "border border-intg-bg-2" : ""
            } relative flex w-full justify-between rounded bg-intg-bg-15 px-3 py-2 hover:cursor-pointer`}
            onClick={onClick}
            onMouseEnter={togglePenVisibility}
            onMouseLeave={togglePenVisibility}
        >
            {active && (
                <CheckCircle
                    size={20}
                    fill="#53389E"
                    color="#DAD1EE"
                    className="absolute inset-x-[472px] -mt-[12px] hover:cursor-wait"
                />
            )}

            <div className="flex gap-5">
                <div className="flex py-2">
                    {themeKeys.map((key, index) => {
                        return (
                            <div
                                className={`h-8 w-8 rounded-full border-2 ${index !== 0 ? "-ml-4" : ""}`}
                                key={key}
                                style={{
                                    backgroundColor: colorScheme[key as keyof ColorScheme],
                                }}
                            />
                        );
                    })}
                </div>

                <div>
                    <p className="font-normal leading-6 first-letter:capitalize">{name}</p>
                    <p className="font-normal text-intg-text-4">{preset ? "Preset theme" : "Custom theme"}</p>
                </div>
            </div>

            {onEditClicked && isHovered && (
                <Pen
                    size={8}
                    color="#AFAAC7"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEditClicked?.();
                    }}
                    className={`mt-[6px] h-9 w-9 rounded-md bg-intg-bg-11 px-1 py-2 text-sm transition-all duration-500 ease-in-out hover:cursor-pointer hover:bg-intg-bg-9`}
                />
            )}
        </div>
    );
};
