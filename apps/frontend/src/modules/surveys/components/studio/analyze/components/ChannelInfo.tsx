import useAnalyze from "@/modules/surveys/hooks/useAnalyze";
import { Header } from "@/ui";
import { Fragment } from "react/jsx-runtime";

export const ChannelInfo = () => {
    const { activeResponse } = useAnalyze();

    return (
        <div className="flex w-96 flex-col gap-[21px] rounded bg-intg-bg-15 p-3.5">
            <Header title="Channel information" variant="3" className="[&>*]:text-intg-text-11" />

            <div className="grid grid-cols-[max-content,1fr] gap-x-3.5 gap-y-2 -tracking-[0.41px]">
                {Object.entries(activeResponse?.response.userAttributes ?? {}).map(([key, val]) => (
                    <Fragment key={key}>
                        <strong className="w-max self-center rounded bg-intg-bg-22 px-1.5 py-1 text-xs font-normal capitalize leading-[18px] text-intg-text-13">
                            {key.replace("_", " ")}
                        </strong>

                        <span className="self-center text-sm font-normal text-intg-text-2">{val}</span>
                    </Fragment>
                ))}
            </div>
        </div>
    );
};
