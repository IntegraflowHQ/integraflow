import * as Popover from "@radix-ui/react-popover";
import Sketch from "@uiw/react-color-sketch";
import React, { useState } from "react";

interface ColorPickerProps {
    children: React.ReactNode;
    defaultColor?: string;
    onChange: (color: string) => void;
}

/**
 *
 * @param {string} defaultColor - optional prop that accepts a hex code
 * @param {string} children - this is a required prop. It holds the value that gies into the Trigger primitive from Radix
 * @param {func} onChange - required a callback prop for tracking the input values
 * @returns - a parent component that you can use to wrap the any element or custom component
 * @example
 *
 * import { ColorPicker } from "ui/ColorPicker"
 *
 * export const PickerExample = () => {
 *  return (
 *    <ColorPicker onChange={(color) => setColor(color)}>
 *       <div className="h-8 w-8 trigger" />
 *    </ColorPicker>
 *  )
 * }
 *
 * @info **NOTE: feel free to define your functions in a way that fits your needs**
 */

export const ColorPicker = ({
    defaultColor = "#124CA4",
    onChange,
    children,
}: ColorPickerProps) => {
    const [color, setColor] = useState(defaultColor);

    const handleColorChange = (color: { hex: string }) => {
        setColor(color.hex);
        onChange(color.hex);
    };

    return (
        <Popover.Root>
            <Popover.Trigger>{children}</Popover.Trigger>

            <Popover.Portal>
                <Popover.Content>
                    <Sketch
                        style={{
                            background: "#261F36",
                            borderRadius: "8px",
                            border: "1px solid #392d72",
                            marginLeft: "-40px !important",
                        }}
                        color={color}
                        onChange={handleColorChange}
                    />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};
