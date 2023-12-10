import * as Switch from "@radix-ui/react-switch";

type Props = {
    label: string;
};

export const SwitchButton = ({ label }: Props) => {
    return (
        <form>
            <div className="flex items-center justify-between">
                <label
                    className="pr-[15px] text-[15px] leading-none text-white"
                    htmlFor={label}
                >
                    {label}
                </label>
                <Switch.Root
                    className="relative h-[24px] w-[35px] cursor-default rounded-xl border border-[#524770] bg-white outline-none data-[state=checked]:bg-black"
                    id="airplane-mode"
                    style={{
                        "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)",
                    }}
                >
                    <Switch.Thumb className="block h-[13px] w-[13px] translate-x-0.5 rounded-full bg-intg-bg-2  transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[15px]" />
                </Switch.Root>
            </div>
        </form>
    );
};
