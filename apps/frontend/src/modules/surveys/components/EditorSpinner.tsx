interface EditorSpinnerProps {
    startColor: string;
    endColor: string;
    size: string;
}

export const EditorSpinner = ({
    startColor,
    endColor,
    size,
}: EditorSpinnerProps) => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <div className="flex min-h-screen w-full items-center justify-center">
                <div
                    className={`flex h-${size} w-${size} animate-spin items-center justify-center rounded-full bg-gradient-to-tr from-[${startColor}] to-[${endColor}]`}
                >
                    <div
                        className={`h-${Number(size) - 2} w-${
                            Number(size) - 2
                        } rounded-full bg-intg-bg-9`}
                    ></div>
                </div>
            </div>
        </div>
    );
};
