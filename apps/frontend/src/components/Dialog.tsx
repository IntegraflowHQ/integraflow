import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import React, { forwardRef } from "react";

type Props = {
    children: React.ReactNode;
    title?: string;
    description?: string;
    alignHeader?: "center" | "left";
};

export const DialogContent = forwardRef<HTMLElement, Props>(
    ({ children, title, alignHeader = "left", ...props }, forwardedRef) => (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay
                className="fixed inset-0"
                style={{
                    background: "rgba(20, 23, 26, 0.20);",
                    backdropFilter: "blur(8px)",
                }}
            />
            <DialogPrimitive.Content
                {...props}
                ref={forwardedRef}
                className="fixed left-1/2 top-1/2 h-fit -translate-x-1/2 -translate-y-1/2  bg-intg-bg-8 p-12 text-white"
            >
                {alignHeader === "left" && (
                    <>
                        <div className="flex justify-between">
                            <DialogPrimitive.Title className="text-600 text-2xl">
                                {title}
                            </DialogPrimitive.Title>
                            <DialogPrimitive.Close aria-label="Close">
                                <XIcon />
                            </DialogPrimitive.Close>
                        </div>
                        <DialogPrimitive.Description className="text-sm text-intg-text">
                            {props.description}
                        </DialogPrimitive.Description>
                    </>
                )}
                {alignHeader === "center" && (
                    <>
                        <div className="flex justify-end">
                            <DialogPrimitive.Close aria-label="Close">
                                <XIcon />
                            </DialogPrimitive.Close>
                        </div>
                        <div className="text-center">
                            <DialogPrimitive.Title className="text-600 text-2xl">
                                {title}
                            </DialogPrimitive.Title>
                            <DialogPrimitive.Description className="text-sm text-intg-text">
                                {props.description}
                            </DialogPrimitive.Description>
                        </div>
                    </>
                )}
                {children}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    ),
);

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
