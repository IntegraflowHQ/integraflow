import * as Tooltip from "@radix-ui/react-tooltip";
import React from "react";

interface tooltipProp {
    item: React.ReactElement;
    info: string;
    id: string;
}

export const StudioTooltip = ({ item, info, id }: tooltipProp) => {
    return (
        <Tooltip.Provider>
            <Tooltip.Root key={id}>
                <Tooltip.Trigger className="mt-2" asChild>
                    {item}
                </Tooltip.Trigger>

                <Tooltip.Portal>
                    <Tooltip.Content className="tooltip__arrow">
                        <div className="absolute -left-6 -top-2 ml-16 rounded-md border border-intg-text-4 bg-intg-bg-9 px-1 py-2 text-xs text-intg-text-4">
                            <p className="w-28">{info}</p>
                        </div>
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};
