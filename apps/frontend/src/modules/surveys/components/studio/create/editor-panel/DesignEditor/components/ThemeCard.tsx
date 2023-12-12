interface CardProps {
    themeData: { colorPalette: string[]; name: string };
    onClick: () => void;
}

export const ThemeCard = ({
    themeData: { name, colorPalette },
    onClick,
    ...props
}: CardProps) => {
    return (
        <div
            className="my-3 mb-2 flex w-full gap-5 rounded-md bg-intg-bg-15 px-3 py-2 hover:cursor-pointer"
            onClick={onClick}
            {...props}
        >
            <div className="flex py-2">
                {colorPalette.map((color, index) => {
                    return (
                        <div
                            className={`h-8 w-8 rounded-full border-2 ${
                                index !== 0 ? "-ml-3" : ""
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
                <p className="font-normal text-intg-text-4">Fetched theme</p>
            </div>
        </div>
    );
};
