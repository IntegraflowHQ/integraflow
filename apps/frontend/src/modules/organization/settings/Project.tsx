import { Button, TextInput } from "@/ui";
import Frame from "assets/images/Frame.png";
import { useForm } from "react-hook-form";
import { SettingsScreen } from "./SettingsScreen";

type ProfileData = {
    email: string;
    fullName: string;
    username: string;
};

export const Project = () => {
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
        <SettingsScreen title="Project" label="Manage your Integraflow Profile">
            <div className="w-[593px]" onSubmit={handleSubmit(onSubmit)}>
                <div className="my-6 rounded-md">
                    <div className="space-y-4">
                        <div className="space-y-4 text-sm text-intg-text-2">
                            <p>Profile picture</p>
                            <img src={Frame} alt="" />
                            <p>Pick a logo for your workspace. Recommended size is 256x256px</p>
                        </div>
                    </div>
                    <hr className="my-6 border-[1px] border-intg-bg-4" />
                    <div className="space-y-6">
                        <TextInput label={"Email"} className="font-semibold" />

                        <Button text="Update" className="w-[187px]" size="md" />
                    </div>

                    <hr className="my-6 border-[1px] border-intg-bg-4" />

                    <div className="space-y-6 text-sm text-intg-text-4">
                        <div className="space-y-2">
                            <h3 className="font-semibold">Delete Project</h3>
                            <p className="text-sm">
                                If you want to permanently delete this workspace and all of it’s data, including all
                                users responses.
                            </p>
                        </div>
                        <Button text="Delete this project" size="md" className="bg-[##CE3C55]" />
                    </div>
                </div>
            </div>
        </SettingsScreen>
    );
};
