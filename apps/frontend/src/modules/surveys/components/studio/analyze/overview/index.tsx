import { cn } from "@/utils";
import { LinkIcon } from "lucide-react";
import { OverviewCards } from "../components/OverviewCards";

export const Overview = () => {
    let overview = "h";
    return (
        <div
            className={cn(
                "flex min-h-full w-full min-w-[660px] flex-col gap-6 rounded-xl bg-intg-bg-9 p-12",
                overview ? "min-h-full" : "h-full",
            )}
        >
            {overview ? (
                <div>
                    <h3 className="text-2xl font-semibold text-white">Overview</h3>
                    <p className="font-sm w-[474px] text-intg-text">
                        Overview Report to get a quick summary and analysis of responses, CX metrics and survey
                        distribution channels.
                    </p>
                    <div className="flex gap-6 bg-intg-bg-15 p-6">
                        <OverviewCards text="" title="" icon={<LinkIcon />} number={0} key={"key"} graph />
                        <OverviewCards text="" title="" icon={<LinkIcon />} number={0} key={"key"} graph />
                        <OverviewCards text="" title="" icon={<LinkIcon />} number={0} key={"key"} graph />
                    </div>
                </div>
            ) : (
                <div className="flex min-h-full flex-col items-center justify-center">
                    <LinkIcon className="text-intg-text" size={62} strokeWidth={2} />
                    <div className="space-y-2 text-center ">
                        <p className="text-2xl font-semibold text-white">No overview yet </p>
                        <p className="w-[386px] text-sm text-intg-text">
                            Overview Report to get a quick summary and analysis of responses, CX metrics and survey
                            distribution channels.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
