import { IntegraflowIconProps } from "@/types";

export const EllipsisVertical = ({ color, size, ...props }: IntegraflowIconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size ?? "24"}
            height={size ?? "24"}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color ?? "#AFAAC7"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
        </svg>
    );
};
