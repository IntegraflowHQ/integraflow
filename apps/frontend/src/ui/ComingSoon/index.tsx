import { useAuth } from "@/modules/auth/hooks/useAuth";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
import { usePostHog } from "posthog-js/react";
import Button from "../Button/Button";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    notifyFn?: () => {};
};

export const ComingSoon = ({ className, children, notifyFn, ...props }: Props) => {
    const posthog = usePostHog();

    const { user } = useAuth();

    const handleNotify = () => {
        if (user) {
            posthog.capture("Notify me", {
                $set: {
                    email: user.email,
                    organization: { name: user.organization?.name, slug: user.organization?.slug },
                    project: { name: user.project?.name, slug: user.project?.slug },
                },
            });

            toast.custom("We will let you know when this feature is implemented");
        }
    };

    return (
        <div className={cn("relative w-full", className ?? "")} {...props}>
            {children}

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg">
                <span className="text-lg text-white">Coming Soon</span>
                <Button variant="secondary" text="Notify me" className="w-max px-8 py-[8px]" onClick={handleNotify} />
            </div>
        </div>
    );
};
