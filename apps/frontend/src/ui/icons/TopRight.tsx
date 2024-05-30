import { IntegraflowIconProps } from "@/types";

export const TopRight = ({ color, size, ...props }: IntegraflowIconProps) => {
    const width = size ?? 21;
    const height = (width * 26) / 21;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 21 26"
            fill="none"
            {...props}
        >
            <path
                d="M19.8016 7V19C19.8016 23.8 18.6016 25 13.8016 25H6.60156C1.80156 25 0.601562 23.8 0.601562 19V7C0.601562 2.2 1.80156 1 6.60156 1H13.8016C18.6016 1 19.8016 2.2 19.8016 7Z"
                stroke={color ?? "#AFAAC7"}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.1984 4.6001H11.3984"
                stroke={color ?? "#AFAAC7"}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
