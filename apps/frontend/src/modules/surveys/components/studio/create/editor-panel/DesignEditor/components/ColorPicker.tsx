import * as Popover from "@radix-ui/react-popover";
import React, { useState } from "react";
import { ColorResult, SketchPicker } from "react-color";

interface ColorPickerProps {
    defaultColor?: string;
    onChange: (color: string) => void;
    selectedColor: string | undefined;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
    defaultColor = "#124CA4",
    onChange,
    selectedColor = "#ffffff",
}) => {
    const [color, setColor] = useState(defaultColor);

    const handleColorChange = (color: ColorResult) => {
        setColor(color.hex);
        onChange(color.hex);
    };

    return (
        <Popover.Root>
            <Popover.Trigger>
                <button className="text-shippy-gray-tx flex items-center space-x-2 rounded-md border bg-transparent px-1 py-2 text-sm font-semibold">
                    <span className="uppercase">{selectedColor}</span>
                    <span
                        className="h-3 w-3 rounded-full shadow-md"
                        style={{ backgroundColor: selectedColor }}
                    ></span>
                </button>
            </Popover.Trigger>
            <Popover.Anchor />
            <Popover.Portal>
                <Popover.Content
                    align="start"
                    className="w-[13rem] border bg-[#fff] px-3 pt-0"
                >
                    <SketchPicker
                        color={color}
                        onChangeComplete={handleColorChange}
                    />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

export default ColorPicker;
