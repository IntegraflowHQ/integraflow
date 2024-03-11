import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    title: string;
    label: string;
    showGotoPrevious?: boolean;
};

export const SettingsScreen = ({ children, title, label, showGotoPrevious = true }: Props) => {
    return (
        <div className="pb-[72px]">
            <div className="pl-[72px] pt-[80px] text-intg-text">
                {showGotoPrevious && (
                    <button className="flex">
                        <span>
                            <ArrowLeft />
                        </span>
                        <span>Go back</span>
                    </button>
                )}
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm">{label}</p>
            </div>
            <div className="py-6">
                <hr className="border border-intg-bg-4" />
            </div>
            <div className="flex items-center justify-center">{children}</div>
        </div>
    );
};
