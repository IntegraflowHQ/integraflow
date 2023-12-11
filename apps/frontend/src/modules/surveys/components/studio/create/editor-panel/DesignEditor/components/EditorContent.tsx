import { useThemes } from "@/modules/projects/hooks/useTheme";
import { Button } from "@/ui";
import { ThemeCard } from "./ThemeCard";

interface ContentProp {
    onOpen: () => void;
}

export const DesignEditorContent = ({ onOpen }: ContentProp) => {
    const { themes, loading } = useThemes();
    const { data, totalCount } = themes;

    const palettes = data?.map((theme) => theme.colorPalette);
    const themeName = data?.map((theme) => theme.name);
    const THEMES = data;

    return (
        <div>
            {totalCount === 0 ? (
                <p
                    className={`py-2 text-sm font-normal text-intg-text-2 opacity-0 transition-all delay-300 ease-in-out ${
                        totalCount === 0 ? "opacity-100" : ""
                    }`}
                >
                    You don't have any theme. Click the button below to create
                    one.
                </p>
            ) : (
                <>
                    <p className="py-4 text-sm font-normal uppercase">
                        Selected Theme
                    </p>

                    {!loading ? (
                        <div className="flex w-full gap-5 rounded-md bg-intg-bg-15 px-3 py-2">
                            <div className="flex py-2">
                                {palettes?.slice(1)?.map((palette, index) => (
                                    <div className="flex" key={index}>
                                        {palette?.map((color, colorIndex) => (
                                            <div
                                                className={`h-8 w-8 rounded-full border-2 ${
                                                    colorIndex !== 0
                                                        ? "-ml-3"
                                                        : ""
                                                }`}
                                                key={colorIndex}
                                                style={{
                                                    backgroundColor: color,
                                                }}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div>
                                <p className="text-base font-normal leading-6">
                                    {themeName?.slice(1)}
                                </p>
                                <p className="text-sm font-normal text-intg-text-4">
                                    Fetched theme
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex py-2 text-sm font-normal text-intg-text-2">
                            loading...
                        </div>
                    )}
                </>
            )}

            <div
                className={`h-full py-6  ${
                    totalCount === 2 ? "-mt-4" : ""
                } transition-all delay-300 ease-in-out`}
            >
                <p className="py-2 text-sm font-normal capitalize">
                    all themes
                </p>

                <Button
                    text="new theme"
                    onClick={onOpen}
                    variant="secondary"
                    className="text-sm font-normal first-letter:capitalize"
                />

                {totalCount === 0 ? null : (
                    <div className="flex-col">
                        {THEMES?.map(
                            (theme, index: React.Key | number | number) => {
                                return (
                                    <ThemeCard themeData={theme} key={index} />
                                );
                            },
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
