import { ProjectTheme } from "@/generated/graphql";
import { useStudioStore } from "@/modules/surveys/states/studio";
import { CheckCircle, Pen } from "lucide-react";
import React from "react";

interface CardProps {
    onClick: () => void;
    activeTheme: boolean;
    toggleNewThemeModal: () => void;
    theme: Partial<ProjectTheme>;
}

export const ThemeCard = ({
    theme,
    onClick,
    activeTheme,
    toggleNewThemeModal,
    ...props
}: CardProps) => {
    const [isHovered, setIsHovered] = React.useState<boolean>(false);

    const togglePenVisibility = () => {
        setIsHovered(!isHovered);
    };

    const getColorScheme = (theme: Partial<ProjectTheme>, key: string) => {
        return theme.colorScheme[key];
    };

    const editTheme = () => {
        useStudioStore.setState({ editTheme: true });
        toggleNewThemeModal();
    };

    // const onSelectTheme = (event: React.MouseEvent<HTMLDivElement>) => {
    //     event.stopPropagation();
    //     onClick();
    // };

    return (
        <div
            className={`${
                activeTheme ? "border border-intg-bg-2" : ""
            } relative my-3 mb-2 flex w-full justify-between rounded bg-intg-bg-15 px-3 py-2 hover:cursor-pointer`}
            onClick={onClick}
            onMouseEnter={togglePenVisibility}
            onMouseLeave={togglePenVisibility}
            {...props}
        >
            {activeTheme && (
                <CheckCircle
                    size={20}
                    fill="#53389E"
                    color="#DAD1EE"
                    className="absolute inset-x-[472px] -mt-[12px] hover:cursor-wait"
                />
            )}

            <div className="flex gap-5">
                <div className="flex py-2">
                    {Object.keys(theme.colorScheme).map((key, index) => {
                        return (
                            <div
                                className={`h-8 w-8 rounded-full border-2 ${
                                    index !== 0 ? "-ml-4" : ""
                                }`}
                                key={index}
                                style={{
                                    backgroundColor: `${getColorScheme(
                                        theme,
                                        key,
                                    )}`,
                                }}
                            />
                        );
                    })}
                </div>

                <div>
                    <p className="font-normal leading-6 first-letter:capitalize">
                        {theme.name}
                    </p>
                    <p className="font-normal text-intg-text-4">Custom theme</p>
                </div>
            </div>

            {isHovered ? (
                <Pen
                    size={8}
                    color="#AFAAC7"
                    onClick={() => editTheme()}
                    className={`mt-[6px] h-9 w-9 rounded-md bg-intg-bg-11 px-1 py-2 text-sm transition-all duration-500 ease-in-out hover:cursor-pointer hover:bg-intg-bg-9`}
                />
            ) : null}
        </div>
    );
};
