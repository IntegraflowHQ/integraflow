import { Jsonish } from "@/types";

export const Attribute = ({ name, value, type }: { name: string; value: Jsonish; type?: string }) => {
    return (
        <div className="flex items-center gap-3.5 -tracking-[0.41px]">
            <strong className="min-w-max rounded bg-intg-bg-22 px-1.5 py-1 text-xs font-normal leading-[18px] text-intg-text-13">
                {name}
            </strong>

            <span className="truncate text-sm font-normal text-intg-text-2">{value?.toString()}</span>

            {type ? <span className="rounded-sm bg-intg-bg-10 px-1.5 py-1 text-xs text-intg-text">{type}</span> : null}
        </div>
    );
};
