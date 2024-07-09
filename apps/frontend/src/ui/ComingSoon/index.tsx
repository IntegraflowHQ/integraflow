import { cn } from "@/utils";
import Button from "../Button/Button";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    notifyFn?: () => void;
};
export const ComingSoon = ({ className, children, notifyFn, ...props }: Props) => {
    return (
        <div className={cn("relative w-full", className ?? "")} {...props}>
            {children}

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg">
                <span className="text-lg text-white">Coming Soon</span>
                <Button variant="secondary" text="Notify me" className="w-max px-8 py-[8px]" onClick={notifyFn} />
            </div>
        </div>
    );
};
