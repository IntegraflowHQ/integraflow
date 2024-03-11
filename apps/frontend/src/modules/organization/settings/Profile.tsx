import { Button, TextInput } from "@/ui";
import Frame from "assets/images/Frame.png";
import { useForm } from "react-hook-form";
import { SettingsScreen } from "./SettingsScreen";

type ProfileData = {
    email: string;
    fullName: string;
    username: string;
};

export const Profile = () => {
    const {
        watch,
        setValue,
        register,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm({
        defaultValues: {
            email: "",
            fullName: "",
            username: "",
        },
    });

    const onSubmit = async (formInfo: ProfileData) => {
        console.log(formInfo);
    };
    return (
        <SettingsScreen title="Profile" label="Manage your Integraflow Profile">
            <form className="w-[593px]" onSubmit={handleSubmit(onSubmit)}>
                <div className="my-6 rounded-md">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-intg-text-2">Profile picture</p>
                            <img src={Frame} alt="" />
                        </div>

                        <TextInput
                            label={"Email"}
                            className="font-semibold"
                            {...register("email", {
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
                            label={"Full Name"}
                            {...register("fullName", {
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
                        <TextInput
                            label={"Username - Nickname or first name, however you want yo be called in Integraflow"}
                            defaultValue=""
                            {...register("username", {
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
                    <hr className="my-6 border-[1px] border-intg-bg-4" />
                </div>
                <Button text="Update" className="w-[114px]" />
            </form>
        </SettingsScreen>
    );
};
