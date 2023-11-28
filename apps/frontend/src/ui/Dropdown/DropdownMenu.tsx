import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { forwardRef } from "react";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

// interface Props extends DropdownMenuPrimitive.DropdownMenuContentProps = {
//     children: React.ReactNode;
//     classname: string;
// };

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
export const DropdownMenuSubContent = DropdownMenuPrimitive.DropdownMenuSubContent;
export const DropdownMenuSubTrigger = DropdownMenuPrimitive.DropdownMenuSubTrigger;


// export const DropdownMenuCheckboxItem = React.forwardRef(
//     ({ children, ...props }, forwardedRef) => {
//         return (
//             <DropdownMenuPrimitive.CheckboxItem {...props} ref={forwardedRef}>
//                 {children}
//                 <DropdownMenuPrimitive.ItemIndicator>
//                     {props.checked === "indeterminate" && <PenLineIcon />}
//                     {props.checked === true && <CheckIcon />}
//                 </DropdownMenuPrimitive.ItemIndicator>
//             </DropdownMenuPrimitive.CheckboxItem>
//         );
//     },
// );

// export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// export const DropdownMenuRadioItem = React.forwardRef(
//     ({ children, ...props }, forwardedRef) => {
//         return (
//             <DropdownMenuPrimitive.RadioItem {...props} ref={forwardedRef}>
//                 {children}
//                 <DropdownMenuPrimitive.ItemIndicator>
//                     <CheckIcon />
//                 </DropdownMenuPrimitive.ItemIndicator>
//             </DropdownMenuPrimitive.RadioItem>
//         );
//     },
// );

export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
