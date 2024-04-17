import { Header } from "@/ui";
import { TrendingUp } from "@/ui/icons";

export const Trends = () => {
    return (
        <div className={"flex h-full w-full min-w-[660px] flex-col gap-6 rounded-xl bg-intg-bg-9 px-6 py-9"}>
            <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <TrendingUp strokeWidth={4} size={62} color="#AFAAC7" />
                    <Header
                        title="No trends yet"
                        description="Overview Report to get a quick summary and analysis of responses, CX metrics and survey distribution channels."
                        className="max-w-[386px] text-center"
                    />
                </div>
            </div>
        </div>
    );
};
