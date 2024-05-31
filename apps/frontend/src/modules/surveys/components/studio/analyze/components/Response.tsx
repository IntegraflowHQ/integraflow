import Frame from "assets/images/Frame.png";

type Props = React.HtmlHTMLAttributes<HTMLDivElement> & {
    title: string;
    responder: string;
    date: Date;
    score?: string;
    cps?: string;
    ces?: string;
};

export const Response = ({ title, responder, date, ...props }: Props) => {
    function relativeDays(timestamp: number) {
        const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
        const aDay = 1000 * 60 * 60 * 24;
        const diffInDays = Math.round((timestamp - Date.now()) / aDay);
        return formatter.format(diffInDays, "day");
    }

    return (
        <div className="flex flex-col gap-3 rounded-lg bg-intg-bg-21 px-[14px] py-4" {...props}>
            <div className="flex items-center justify-between">
                <h4 className="text-base font-medium text-intg-text-11">{title}</h4>

                <span className="text-sm capitalize text-intg-text">
                    {relativeDays(date.getTime())} |{" "}
                    {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <img src={Frame} alt="picture frame" className="h-6 w-6 rounded object-contain" />
                <strong className="text-sm font-medium text-intg-text">{responder}</strong>
            </div>
        </div>
    );
};
