import * as Tooltip from "@radix-ui/react-tooltip";
import React from "react";

interface tooltipProp {
  item: React.ReactElement;
  info: string;
}

export const StudioTooltip = ({ item, info }: tooltipProp) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{item}</Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content className="ml-16 mt-16 h-fit w-fit rounded-lg border border-intg-text-4 bg-intg-bg-9 px-2 py-1 text-xs text-intg-text-4">
            {info}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
