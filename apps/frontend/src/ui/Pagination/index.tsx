import { cn } from "@/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nexPageFn: () => void;
    prevPageFn: () => void;
    totalCount: number;
    itemName: string;
    className?: string;
};

export const Pagination = ({
    hasNextPage,
    hasPrevPage,
    nexPageFn,
    prevPageFn,
    totalCount,
    itemName,
    className,
}: Props) => {
    return (
        <div className={cn("flex items-center justify-between text-intg-text-4", className ?? "")}>
            <p>
                {totalCount} {itemName}
            </p>

            <div className="flex gap-4">
                <button
                    disabled={!hasPrevPage}
                    onClick={prevPageFn}
                    className={cn(
                        !hasPrevPage ? "cursor-not-allowed opacity-50" : "",
                        "flex items-center gap-1 rounded-md font-normal transition hover:bg-intg-bg-8",
                    )}
                >
                    <ChevronLeft />
                    <span className="py-1 pr-2">Prev page</span>
                </button>

                <button
                    disabled={!hasNextPage}
                    onClick={nexPageFn}
                    className={cn(
                        !hasNextPage ? "cursor-not-allowed opacity-50" : "",
                        "flex items-center gap-1 rounded-md font-normal transition hover:bg-intg-bg-8",
                    )}
                >
                    <span className="py-1 pl-2">Next page</span>
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
};
