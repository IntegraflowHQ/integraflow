import { StarIcon } from "@/ui/icons/StarIcon";

type Props = {
    color?: "default" | "active";
    onClick?: () => void;
};

export const StarBtn = ({ onClick, color }: Props) => {
    return (
        <div
            onClick={onClick}
            className="w-fit cursor-pointer rounded bg-transparent p-2 transition-colors delay-150 duration-300 hover:bg-intg-bg-7"
        >
            <StarIcon color={color} />
        </div>
    );
};
