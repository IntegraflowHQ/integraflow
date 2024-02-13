import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { forwardRef } from "react";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export const DropdownMenuContent = forwardRef<
    HTMLDivElement,
    DropdownMenuPrimitive.DropdownMenuContentProps
>(({ children, ...props }, forwardedRef) => {
    return (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content ref={forwardedRef} {...props}>
                {children}
                <DropdownMenuPrimitive.Arrow />
            </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
    );
});

export const DropdownMenuLabel = DropdownMenuPrimitive.Label;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuItem = DropdownMenuPrimitive.Item;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuSub = DropdownMenuPrimitive.DropdownMenuSub;
export const DropdownMenuSubContent =
    DropdownMenuPrimitive.DropdownMenuSubContent;
export const DropdownMenuSubTrigger =
    DropdownMenuPrimitive.DropdownMenuSubTrigger;
export const DropdownMenuArrow = DropdownMenuPrimitive.Arrow;
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuRadioItem = DropdownMenuPrimitive.RadioItem;
export const DropdownMenuItemIndicator = DropdownMenuPrimitive.ItemIndicator;
