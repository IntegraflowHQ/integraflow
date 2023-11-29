import { addEllipsis, cn } from "@/utils";
import React from "react";

export interface NavItemProps {
    leftIcon?: React.ReactNode;
    text?: string;
    rightIcon?: React.ReactNode;
    ellipsis?: boolean;
    ellipsisLength?: number;
    classnames?: string;
}

export const NavItem = ({
    leftIcon,
    rightIcon,
    text,
    ellipsis = false,
    ellipsisLength,
    classnames = "",
}: NavItemProps) => {
    return (
        <div
            className={cn(
                "mx-auto flex w-full cursor-pointer items-center gap-2 overflow-x-hidden rounded capitalize text-intg-text",
                classnames,
            )}
        >
            <span>{leftIcon}</span>
            <p className="flex-1 text-left text-sm">
                {ellipsis
                    ? addEllipsis(text as string, ellipsisLength as number)
                    : text}
            </p>
            <span>{rightIcon}</span>
        </div>
    );
};
