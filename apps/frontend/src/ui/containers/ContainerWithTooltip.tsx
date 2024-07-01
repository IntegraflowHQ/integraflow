import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

export const ContainerWithTooltip = ({
    text,
    children,
    side = "top",
    align = "center",
}: {
    text: string;
    children: ReactNode;
    side?: TooltipPrimitive.TooltipContentProps["side"];
    align?: TooltipPrimitive.TooltipContentProps["align"];
}) => {
    return (
        <TooltipPrimitive.Provider>
            <TooltipPrimitive.Root delayDuration={200}>
                <TooltipPrimitive.Trigger asChild>
                    <div>{children}</div>
                </TooltipPrimitive.Trigger>

                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        side={side}
                        align={align}
                        className="rounded border border-intg-bg-10 bg-intg-bg-9 px-2 py-3 text-xs leading-[18px] text-intg-text"
                    >
                        {text}
                        <TooltipPrimitive.Arrow
                            width={18}
                            height={16}
                            className="-mt-[1px] fill-[#181325] stroke-intg-bg-10"
                        />
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
};
