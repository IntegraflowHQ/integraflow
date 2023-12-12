import { CheckCircle, Pen } from "lucide-react";
import React from "react";

interface CardProps {
    themeData: { colorPalette: string[]; name: string };
    onClick: () => void;
    activeTheme: boolean;
    toggleNewThemeModal: () => void;
}

export const ThemeCard = ({
    themeData: { name, colorPalette },
    onClick,
    activeTheme,
    toggleNewThemeModal,
    ...props
}: CardProps) => {
    const [isHovered, setIsHovered] = React.useState<boolean>(false);

    const togglePenVisibility = () => {
        setIsHovered(!isHovered);
    };

    return (
        <div
            className={`${
                activeTheme ? "border border-intg-bg-2" : ""
            } trasition-all relative my-3 mb-2 flex w-full justify-between rounded-md bg-intg-bg-15 px-3 py-2 duration-300 ease-in-out hover:cursor-pointer`}
            onClick={onClick}
            onMouseEnter={togglePenVisibility}
            onMouseLeave={togglePenVisibility}
            {...props}
        >
            {activeTheme && (
                <CheckCircle
                    color="#DAD1EE"
                    size={20}
                    className="absolute inset-x-[472px] -mt-[12px] hover:cursor-wait"
                />
            )}

            <div className="flex gap-5">
                <div className="flex py-2">
                    {colorPalette.map((color, index) => {
                        return (
                            <div
                                className={`h-8 w-8 rounded-full border-2 ${
                                    index !== 0 ? "-ml-4" : ""
                                }`}
                                key={index}
                                style={{ backgroundColor: `${color}` }}
                            />
                        );
                    })}
                </div>

                <div>
                    <p className="font-normal leading-6 first-letter:capitalize">
                        {name}
                    </p>
                    <p className="font-normal text-intg-text-4">
                        Fetched theme
                    </p>
                </div>
            </div>

            {isHovered ? (
                <Pen
                    onClick={toggleNewThemeModal}
                    size={8}
                    color="#AFAAC7"
                    className={`mt-[6px] h-9 w-9 rounded-md bg-intg-bg-11 px-1 py-2 text-sm transition-all duration-500 ease-in-out hover:cursor-pointer hover:bg-intg-bg-9`}
                />
            ) : null}
        </div>
    );
};
