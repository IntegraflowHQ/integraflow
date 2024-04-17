import useChannels from "@/modules/surveys/hooks/useChannels";
import { ChannelSettings } from "@/types";
import { Button, DatePicker, Switch, TextInput } from "@/ui";
import { addDays, subDays } from "date-fns";
import { SubmitHandler, useForm } from "react-hook-form";
import { LinkProps } from "./Link";

type Props = LinkProps & {
    settings: ChannelSettings;
    close: () => void;
};

export default function EditLink({ link, settings, close }: Props) {
    const { updateChannel } = useChannels();
    const { register, handleSubmit, watch, setValue } = useForm<ChannelSettings>({
        defaultValues: {
            name: settings?.name ?? "",
            singleUse: settings?.singleUse ?? false,
            startDate: settings?.startDate,
            endDate: settings?.endDate,
        },
    });

    const onSubmit: SubmitHandler<ChannelSettings> = (data) => {
        updateChannel(link, {
            settings: JSON.stringify(data),
        });
        close();
    };

    return (
        <form className="flex w-[572px] flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
                <TextInput label="Link name" {...register("name", { required: true })} />
                <Switch
                    name="singleUse"
                    label="Allow multiple response from the same device"
                    onChange={(event) => {
                        setValue("singleUse", event.target.value);
                    }}
                    value={watch("singleUse")}
                />
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
                    fromDate={watch("startDate") ? addDays(new Date(watch("startDate") as string), 1) : undefined}
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    text="Cancel"
                    variant="secondary"
                    type="button"
                    onClick={close}
                    className="w-max px-[24px] py-[12px] font-normal"
                />
                <Button text="Save" type="submit" className="w-max px-[24px] py-[12px] font-normal" />
            </div>
        </form>
    );
}
