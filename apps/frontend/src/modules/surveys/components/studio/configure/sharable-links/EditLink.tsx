import useChannels from "@/modules/surveys/hooks/useChannels";
import { Button, DatePicker, Switch, TextInput } from "@/ui";
import { SubmitHandler, useForm } from "react-hook-form";
import { LinkProps } from "./Link";

type Inputs = {
    name: string;
    singleUse: boolean;
    startDate?: Date;
    endDate?: Date;
};

export default function EditLink({ link }: LinkProps) {
    const { updateChannel } = useChannels();
    const linkSettings = link.settings
        ? JSON.parse(link.settings)
        : {
              name: "",
              singleUse: false,
              startDate: new Date().toISOString(),
              endDate: new Date().toISOString(),
          };
    const { register, handleSubmit, watch, setValue } = useForm<Inputs>({
        defaultValues: {
            name: linkSettings.name,
            singleUse: linkSettings.singleUse,
            startDate: linkSettings.startDate
                ? new Date(linkSettings.startDate)
                : new Date(),
            endDate: linkSettings.endDate
                ? new Date(linkSettings.endDate)
                : new Date(),
        },
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        updateChannel(link, {
            conditions: link.conditions,
            triggers: link.triggers,
            settings: JSON.stringify(data),
        });
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full max-w-lg flex-col gap-4">
                <TextInput
                    label="Link name"
                    {...register("name", { required: true })}
                />
                <Switch
                    label="Allow multiple response from the same device"
                    onChange={(event) => {
                        setValue("singleUse", event.target.value);
                    }}
                    value={watch("singleUse")}
                />
                <DatePicker
                    label="Start date"
                    value={watch("startDate")}
                    onChange={(event) => {
                        setValue("startDate", event.target.value);
                    }}
                />
                <DatePicker
                    label="End date"
                    onChange={(event) => {
                        setValue("endDate", event.target.value);
                    }}
                    value={watch("endDate")}
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button text="Cancel" variant="secondary" />
                <Button text="Save" />
            </div>
        </form>
    );
}
