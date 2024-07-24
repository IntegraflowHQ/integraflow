import { cn } from "@/utils";
import LogoIcon from "assets/images/logo-icon.png";
import SpinnerImage from "assets/images/Spinner.png";

export const Spinner = ({
    className,
    removeLogo,
    size = "lg",
}: {
    className?: string;
    removeLogo?: boolean;
    size?: "lg" | "md";
}) => {
    return (
        <div className={cn(size === "lg" ? "w-[74px]" : "w-[34px]", "relative", className ? className : "")}>
            <img src={SpinnerImage} className="spinner__circle" alt="spinner" />
            {removeLogo ? null : (
                <img
                    src={LogoIcon}
                    alt="logo"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            )}
        </div>
    );
};
