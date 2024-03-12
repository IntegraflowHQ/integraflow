import { Button, TextInput } from "@/ui";
import Frame from "assets/images/Frame.png";
import { useForm } from "react-hook-form";

type WorkspaceData = {
    workspaceName: string;
    workspaceUrl: string;
};

export const General = () => {
    const {
        watch,
        setValue,
        register,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm({
        defaultValues: {
            workspaceName: "",
            workspaceUrl: "",
        },
    });

    const onSubmit = async (formInfo: WorkspaceData) => {
        console.log(formInfo);
    };
    return (
        <form className="w-[593px]" onSubmit={handleSubmit(onSubmit)}>
            <div className="my-6 rounded-md">
                <div className="space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-4 text-sm text-intg-text-2">
                            <p>Profile picture</p>
                            <img src={Frame} alt="" />
                            <p>Pick a logo for your workspace. Recommended size is 256x256px</p>
                        </div>
                    </div>

                    <hr className="my-6 border-[1px] border-intg-bg-4" />

                    <TextInput
                        label={"Workspace Name"}
                        className="font-semibold"
                        {...register("workspaceName", {
                            required: {
                                value: true,
                                message: "Workspace name is required",
                            },
                            minLength: {
                                value: 3,
                                message: "Workspace name must be at least 3 characters",
                            },
                            maxLength: {
                                value: 64,
                                message: "Workspace name must be at most 64 characters",
                            },
                        })}
                        // error={!!errors.workspaceName?.message}
                        // errorMessage={errors.workspaceName?.message}
                    />
                    <TextInput
                        label={"Workspace Url"}
                        {...register("workspaceUrl", {
                            required: {
                                value: true,
                                message: "Workspace URL is required",
                            },
                            minLength: {
                                value: 3,
                                message: "Workspace URL must be at least 3 characters",
                            },
                            maxLength: {
                                value: 48,
                                message: "Workspace URL must be at most 20 characters",
                            },
                            pattern: {
                                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                message: "Workspace URL must be in the correct format, eg: my-workspace",
                            },
                        })}
                        // error={!!errors.workspaceUrl?.message || !!workspaceError}
                        // errorMessage={errors.workspaceUrl?.message ? errors.workspaceUrl?.message : workspaceError}
                    />
                </div>
            </div>
            <Button text="Update" className="w-[114px]" size="md" />

            <hr className="my-6 border-[1px] border-intg-bg-4" />

            <div className="space-y-6 text-sm text-intg-text-4">
                <div className="space-y-2">
                    <h3 className="font-semibold">Delete Workspace</h3>
                    <p className="text-sm">
                        If you want to permanently delete this workspace and all of it’s data, including all users
                        responses.
                    </p>
                </div>
                <Button text="Delete this project" size="md" className="bg-[##CE3C55]" />
            </div>
        </form>
    );
};
