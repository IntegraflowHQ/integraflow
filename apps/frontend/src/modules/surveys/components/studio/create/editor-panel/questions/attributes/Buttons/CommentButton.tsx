import { CommentIcon } from "@/ui/icons/CommentIcon";

type Props = {
    color?: "default" | "active";
    onClick?: () => void;
};

export const CommentButton = ({ onClick, color }: Props) => {
    return (
        <div
            onClick={onClick}
            className="w-fit cursor-pointer rounded bg-transparent p-2 transition-colors delay-150 duration-300 hover:bg-intg-bg-7"
        >
            <CommentIcon color={color} />
        </div>
    );
};
