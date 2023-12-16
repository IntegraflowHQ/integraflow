import { CommentIcon } from "@/ui/icons/CommentIcon";

export const CommentButton = () => {
    return (
        <div className="w-fit cursor-pointer rounded bg-transparent p-2 transition-colors delay-150 duration-300 hover:bg-intg-bg-7">
            <CommentIcon />
        </div>
    );
};
