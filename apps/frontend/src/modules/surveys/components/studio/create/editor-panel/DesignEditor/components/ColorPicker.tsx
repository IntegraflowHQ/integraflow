import * as Popover from "@radix-ui/react-popover";
import Sketch from "@uiw/react-color-sketch";
import React, { useState } from "react";

interface ColorPickerProps {
    children: React.ReactNode;
    defaultColor?: string;
    onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
    defaultColor = "#124CA4",
    onChange,
    children,
}) => {
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
