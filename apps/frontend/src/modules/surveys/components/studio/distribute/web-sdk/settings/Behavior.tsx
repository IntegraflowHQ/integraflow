import { Preview } from "@/modules/surveys/components/studio/create/preview-panel";
import useChannels from "@/modules/surveys/hooks/useChannels";
import { BackgroundOverLayType, ChannelSettings, PlacementType, WebChannelAccordionProps } from "@/types";
import { DatePicker, NumberInput, Switch } from "@/ui";
import { BottomLeft, BottomRight, Center, TopLeft, TopRight } from "@/ui/icons";
import { cn } from "@/utils";
import { logDebug } from "@/utils/log";
import { toast } from "@/utils/toast";
import { addDays, subDays } from "date-fns";
import { Ban, Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Background = {
    label: string;
    value: BackgroundOverLayType;
    icon: React.ReactNode;
};

const positions = [
    {
        value: "bottomRight",
        icon: BottomRight,
    },
    {
        value: "bottomLeft",
        icon: BottomLeft,
    },
    {
        value: "center",
        icon: Center,
    },
    {
        value: "topRight",
        icon: TopRight,
    },
    {
        value: "topLeft",
        icon: TopLeft,
    },
];

const backgrounds: Background[] = [
    {
        label: "Light",
        value: "light",
        icon: <Sun size={20} />,
    },
    {
        label: "Dark",
        value: "dark",
        icon: <Moon size={20} />,
    },
    {
        label: "None",
        value: "none",
        icon: <Ban size={20} />,
    },
];

export default function Behavior({ channel }: WebChannelAccordionProps) {
    const { updateChannel, createChannel } = useChannels();

    const { register, watch, setValue } = useForm<ChannelSettings>({
        values: {
            ...channel.settings,
        },
    });

    useEffect(() => {
        const subscription = watch((value) => {
            if (!value) return;
            if (value.recurring && !value.recurringPeriod) return toast.error("Please enter recurring period");
            if (value.closeOnLimit && !value.responseLimit) return toast.error("Please enter response limit");
            if (!channel.id) {
                logDebug("create channel", value);
                createChannel({
                    ...channel,
                    id: crypto.randomUUID(),
                    settings: value,
                });
            } else {
                logDebug("update channel", value);
                updateChannel(channel, {
                    settings: JSON.stringify(value),
                });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch]);

    return (
        <div className="flex gap-[17px] px-4 py-[30px]">
            {/* controls */}
            <div className="h-max w-[312px] rounded-lg bg-intg-bg-9 p-[14px]">
                <div className="flex flex-col gap-3">
                    <div className="w-full space-y-2 rounded-lg bg-intg-bg-15 p-[14px]">
                        <span className="text-sm text-intg-text">Survey position</span>
                        <div className="flex w-full justify-between">
                            {positions.map(({ value, icon: Icon }) => (
                                <button
                                    data-testid={`${value}-position`}
                                    key={value}
                                    className={cn(
                                        "w-max rounded bg-intg-bg-18 px-[14px] py-[8px] hover:bg-gradient-button hover:text-white",
                                        watch("placement") === value ? "bg-gradient-button" : "",
                                    )}
                                    onClick={() => setValue("placement", value as PlacementType)}
                                >
                                    <Icon color={watch("placement") === value ? "#FFFFFF" : "#AFAAC7"} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 rounded-lg bg-intg-bg-15 p-3">
                        <span className="text-sm text-intg-text">Background overlay</span>
                        <div className="flex w-full justify-between gap-2 rounded bg-intg-bg-18 p-1">
                            {backgrounds.map((item) => (
                                <button
                                    data-testid={`${item.label}-overlay`}
                                    key={item.value}
                                    className={cn(
                                        "flex items-center justify-center gap-1 rounded px-3 py-2 text-xs leading-[18px] text-intg-text hover:bg-gradient-button hover:text-white",
                                        watch("backgroundOverlay") === item.value
                                            ? "bg-gradient-button text-white"
                                            : "",
                                    )}
                                    onClick={() => setValue("backgroundOverlay", item.value)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="py-4">
                    <hr className="border-intg-bg-4" />
                </div>

                <div className="flex w-full flex-col gap-3">
                    <Switch
                        name={"recurring"}
                        label="Recurring"
                        value={watch("recurring")}
                        onChange={(e) => setValue("recurring", e.target.value)}
                    />
                    {watch("recurring") && <NumberInput label="Recurring period" {...register("recurringPeriod")} />}
                    <Switch
                        name={"closeOnLimit"}
                        label="Close survey on response limit"
                        value={watch("closeOnLimit")}
                        onChange={(e) => setValue("closeOnLimit", e.target.value)}
                    />
                    {watch("closeOnLimit") && <NumberInput label="Response limit" {...register("responseLimit")} />}
                    <div className="flex gap-1">
                        <DatePicker
                            mode="single"
                            label="Start date"
                            selected={watch("startDate") ? new Date(watch("startDate") as string) : undefined}
                            onSelect={(value) => {
                                if (value) {
                                    setValue("startDate", value.toISOString());
                                } else {
                                    setValue("startDate", "");
                                }
                            }}
                            displayFormat="dd/MM/yyyy"
                            toDate={watch("endDate") ? subDays(new Date(watch("endDate") as string), 1) : undefined}
                        />
                        <DatePicker
                            mode="single"
                            label="End date"
                            selected={watch("endDate") ? new Date(watch("endDate") as string) : undefined}
                            onSelect={(value) => {
                                if (value) {
                                    setValue("endDate", value.toISOString());
                                } else {
                                    setValue("endDate", "");
                                }
                            }}
                            displayFormat="dd/MM/yyyy"
                            fromDate={
                                watch("startDate") ? addDays(new Date(watch("startDate") as string), 1) : undefined
                            }
                        />
                    </div>
                </div>
            </div>

            {/* webview */}
            <Preview className="min-h-[650px] flex-1" mode="sdk" viewPort="desktop" />
        </div>
    );
}
