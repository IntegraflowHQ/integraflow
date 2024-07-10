import useAnalyze from "@/modules/surveys/hooks/useAnalyze";
import { Header } from "@/ui";

export const ChannelInfo = () => {
    const { activeResponse } = useAnalyze();

    return (
        <div className="flex w-96 flex-col gap-[21px] rounded bg-intg-bg-15 p-3.5">
            <Header title="Response Details" variant="3" className="[&>*]:text-intg-text-11" />

            <div className="flex flex-col gap-2 -tracking-[0.41px]">
                {Object.entries(activeResponse?.response.userAttributes ?? {}).map(([key, val]) => (
                    <div className="flex items-center gap-3.5" key={key}>
                        <strong className="min-w-max rounded bg-intg-bg-22 px-1.5 py-1 text-xs font-normal capitalize leading-[18px] text-intg-text-13">
                            {key.replace(/_/g, " ")}
                        </strong>

                        <span className="truncate text-sm font-normal text-intg-text-2">{val}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
