import { Download } from "lucide-react";

export const ExportBtn = () => {
    return (
        <button
            className={"flex gap-2 rounded-[4px] bg-intg-bg-14 px-3 py-2 text-sm -tracking-[0.41px] text-intg-text"}
            onClick={() => {
                // TODO: implement export
            }}
        >
            <Download size={20} />
            <span>Export</span>
        </button>
    );
};
