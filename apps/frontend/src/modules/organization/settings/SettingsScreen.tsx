import { cn } from "@/utils";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
    children: ReactNode;
    title: string;
    label: string;
    showGotoPrevious?: boolean;
};

export const SettingsScreen = ({ children, title, label, showGotoPrevious = true }: Props) => {
    const navigate = useNavigate();

    return (
        <div className="pb-[72px]">
            <div className={cn(showGotoPrevious ? "pt-[60px]" : "pt-[80px]", "pl-[72px]  text-intg-text")}>
                <div className="mb-4">
                    {showGotoPrevious && (
                        <button className="flex" onClick={() => navigate(-1)}>
                            <span>
                                <ArrowLeft />
                            </span>
                            <span>Go back</span>
                        </button>
                    )}
                </div>
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
