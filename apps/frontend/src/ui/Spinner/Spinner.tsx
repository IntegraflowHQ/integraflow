import { cn } from "@/utils";
import LogoIcon from "assets/images/logo-icon.png";
import SpinnerImage from "assets/images/Spinner.png";

export const Spinner = ({ className }: { className?: string }) => {
    return (
        <div className={cn("relative w-[74px]", className ? className : "")}>
            <img src={SpinnerImage} className="spinner__circle" alt="spinner" />
            <img src={LogoIcon} alt="logo" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
    );
};
