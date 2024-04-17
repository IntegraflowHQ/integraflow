import { cn } from "@/utils";
import { toPng } from "html-to-image";
import { Download, TrendingDown, TrendingUp } from "lucide-react";
import { ReactNode, useRef, useState } from "react";

type Props = {
    icon: ReactNode;
    title: string;
    value: string;
    trend: string;
    trendName: string;
    trendVariant: "positive" | "negative" | "neutral";
};

const PRINT_IGNORE = "print-ignore";

export const Summary = ({ icon, title, value, trend, trendName, trendVariant }: Props) => {
    const [hovered, setHovered] = useState(false);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const ref = useRef<HTMLDivElement>(null);

    const filter = (node: HTMLElement) => {
        const exclusionClasses = [PRINT_IGNORE];
        return !exclusionClasses.some((className) => node.classList?.contains(className));
    };

    const download = async () => {
        if (!ref.current || !titleRef.current) {
            return;
        }

        const url = await toPng(ref.current, {
            backgroundColor: "#181325",
            filter,
        });
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title}.png`;
        link.click();
    };

    return (
        <div
            className="flex w-full flex-col gap-8 rounded-lg bg-intg-bg-9 p-4"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            ref={ref}
        >
            <div className="flex items-center justify-between" style={{ lineHeight: "normal" }}>
                <header className="flex items-center gap-2.5 text-intg-text" style={{ lineHeight: "normal" }}>
                    {icon}
                    <h2 ref={titleRef} style={{ lineHeight: "normal" }}>
                        {title}
                    </h2>
                </header>

                <button onClick={download} className={PRINT_IGNORE}>
                    <Download
                        size={20}
                        className={cn("transition-colors", hovered ? "text-intg-text" : "text-transparent")}
                    />
                </button>
            </div>

            <div>
                <div>
                    <strong className="text-4xl font-medium leading-[43.57px] text-white">{value}</strong>
                </div>

                <div className="flex justify-between">
                    <span className="text-intg-text-10">{trendName}</span>

                    <div
                        className={cn(
                            "flex items-center gap-1",
                            trendVariant === "positive" ? "text-intg-chart-positive" : "",
                            trendVariant === "negative" ? "text-intg-chart-negative" : "",
                            trendVariant === "neutral" ? "text-intg-chart-neutral" : "",
                        )}
                    >
                        {trendVariant === "positive" ? <TrendingUp /> : <TrendingDown />}
                        <span>{trend}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
