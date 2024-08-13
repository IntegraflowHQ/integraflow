import { RoleLevel } from "@/generated/graphql";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { ColorScheme, Theme } from "@/types";
import { Button, ColorPicker } from "@/ui";
import { themeKeys } from "@/utils";
import { X } from "lucide-react";
import { useState } from "react";

type Props = {
    createMode?: boolean;
    defaultValue: Theme;
    onCompleted?: (value: Theme) => void;
    onDeleteClicked?: () => void;
    onClose?: () => void;
};

export const ThemeEditor = ({ onCompleted, onDeleteClicked, onClose, defaultValue, createMode = false }: Props) => {
    const [value, setValue] = useState(defaultValue);
    const { roleLevel } = useAuth();

    return (
        <>
            <div className="delay-400 h-fit rounded-md bg-intg-bg-9 px-4 py-2 transition-all ease-in-out">
                <div className="flex justify-between border-b border-intg-bg-14">
                    <div className="border-b border-[#6941c6]">
                        <input
                            type="text"
                            value={value.name}
                            placeholder="Theme name"
                            onChange={(e) => {
                                setValue((prevValue) => {
                                    return {
                                        ...prevValue,
                                        name: e.target.value,
                                    };
                                });
                            }}
                            className="w-[130px] text-ellipsis bg-transparent px-3 py-2 text-sm font-normal capitalize text-intg-text-2 focus:outline-intg-bg-2"
                        />
                    </div>

                    <div className="mt-2 flex gap-2">
                        <div className="hover:cursor-pointer" onClick={onClose}>
                            <X size={25} color="#AFAAC7" />
                        </div>
                    </div>
                </div>

                {themeKeys.map((key) => {
                    return (
                        <div
                            key={key}
                            className="my-3 mb-3 flex w-full justify-between rounded-md bg-intg-bg-15 px-3 py-3"
                        >
                            <p className="py-1 text-sm font-normal capitalize text-intg-text-2">
                                {key.replace(/[A-Z]/g, " $&")}
                            </p>

                            <ColorPicker
                                defaultColor=""
                                onChange={(color) => {
                                    setValue((prevState) => {
                                        return {
                                            ...prevState,
                                            colorScheme: {
                                                ...prevState.colorScheme,
                                                [key]: color,
                                            },
                                        };
                                    });
                                }}
                            >
                                {" "}
                                <div
                                    className="h-8 w-8 cursor-pointer rounded-full"
                                    style={{
                                        background: value.colorScheme[key as keyof ColorScheme],
                                    }}
                                />
                            </ColorPicker>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex justify-end gap-2">
                {!createMode && [RoleLevel.Admin, RoleLevel.Owner].includes(roleLevel ?? RoleLevel.Member) ? (
                    <Button
                        text="Delete theme"
                        variant="secondary"
                        onClick={onDeleteClicked}
                        className="w-max px-[12px] py-[12px] font-normal"
                    />
                ) : null}
                <Button
                    onClick={() => {
                        onCompleted?.(value);
                    }}
                    text={!createMode ? "Update theme" : "Create theme"}
                    className="w-max px-[12px] py-[12px] font-normal"
                />
            </div>
        </>
    );
};
