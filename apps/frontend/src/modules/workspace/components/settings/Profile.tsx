import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Button, TextInput } from "@/ui";
import { toast } from "@/utils/toast";
import { useForm } from "react-hook-form";
import { SettingsScreen } from "./SettingsScreen";

type ProfileData = {
    firstName: string | undefined;
    lastName: string | undefined;
};

export const Profile = () => {
    const { updateUser, user } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
        },
    });

    const onSubmit = async (formInfo: ProfileData) => {
        if (formInfo.lastName || formInfo.firstName) {
            await updateUser({
                firstName: formInfo.firstName,
                lastName: formInfo.lastName,
            });
            toast.success("Your profile has been updated");
        }
    };

    return (
        <SettingsScreen title="Profile" label="Manage your Integraflow Profile">
            <form className="w-[593px]" onSubmit={handleSubmit(onSubmit)}>
                <div className="my-6 rounded-md">
                    <div className="space-y-6">
                        <TextInput
                            label={"Email"}
                            className="font-semibold"
                            disabled={true}
                            defaultValue={user.email}
                        />
                        <TextInput
                            label={"First name"}
                            className="font-semibold"
                            defaultValue={user.firstName}
                            {...register("firstName", {
                                required: {
                                    value: true,
                                    message: "First name is required",
                                },
                                maxLength: {
                                    value: 48,
                                    message: "First name must be at most 48 characters",
                                },
                            })}
                            error={!!errors.firstName?.message}
                            errorMessage={errors.firstName?.message}
                        />
                        <TextInput
                            label={"Last name"}
                            defaultValue={user.lastName}
                            {...register("lastName", {
                                required: {
                                    value: true,
                                    message: "Last name is required",
                                },
                                maxLength: {
                                    value: 48,
                                    message: "Last name must be at most 60 characters",
                                },
                            })}
                            error={!!errors.lastName?.message}
                            errorMessage={errors.lastName?.message}
                        />
                    </div>
                </div>
                <Button text="Update" className="w-[114px]" />
            </form>
        </SettingsScreen>
    );
};
