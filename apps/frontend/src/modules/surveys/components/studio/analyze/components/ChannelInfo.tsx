import { Header } from "@/ui";

const info = {
    browser: "Chrome",
    "ip address": "105.113.59.3",
    "web device": "Desktop",
    "geo location": "Nigeria",
    "operating system": "macOs",
};

export const ChannelInfo = () => {
    return (
        <div className="flex w-96 flex-col gap-[21px] rounded bg-intg-bg-15 p-3.5">
            <Header title="Channel information" variant="3" className="[&>*]:text-intg-text-11" />

            <div className="grid grid-cols-[max-content,1fr] gap-x-3.5 gap-y-2 -tracking-[0.41px]">
                {Object.entries(info).map(([key, val]) => (
                    <>
                        <strong className="bg-intg-bg-22 text-intg-text-13 w-max rounded px-1.5 py-1 text-xs font-normal capitalize leading-[18px]">
                            {key}
                        </strong>

                        <span className="text-sm font-normal text-intg-text-2">{val}</span>
                    </>
                ))}
            </div>
        </div>
    );
};
