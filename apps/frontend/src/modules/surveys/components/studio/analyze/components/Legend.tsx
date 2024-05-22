import { cn } from "@/utils";
import React from "react";

type Props = React.HtmlHTMLAttributes<HTMLDivElement> & {
    data: {
        name: string;
        color: string;
        value: number;
    }[];
};

export const Legend = ({ className, data, ...props }: Props) => {
    const total = data.reduce((acc, d) => {
        return acc + d.value;
    }, 0);

    return (
        <div
            className={cn("flex flex-1 flex-col gap-6 self-center text-sm text-intg-text", className ?? "")}
            {...props}
        >
            {data.map((d, i) => (
                <div className="flex items-center gap-2" key={i}>
                    <div className={`bg-[${d.color}] rounded-s" h-3 w-3`}></div>
                    <p>
                        {d.name} - <span className="text-white">({d.value})</span>{" "}
                        <span>({((d.value / total) * 100).toFixed()}%)</span>
                    </p>
                </div>
            ))}
        </div>
    );
};
