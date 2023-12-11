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
    const { register, handleSubmit, watch, setValue } = useForm<Inputs>({
        defaultValues: {
            name: link.name,
            singleUse: link.singleUse,
            startDate: link.startDate ? new Date(link.startDate) : new Date(),
            endDate: link.endDate ? new Date(link.endDate) : new Date(),
        },
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

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
