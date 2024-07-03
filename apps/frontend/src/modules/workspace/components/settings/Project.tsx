import { useProject } from "@/modules/projects/hooks/useProject";
import { Button, TextInput } from "@/ui";
import { toast } from "@/utils/toast";
import { useForm } from "react-hook-form";
import { SettingsScreen } from "./SettingsScreen";

type ProjectData = {
    name: string | undefined;
};

export const Project = () => {
    const { updateProject, project } = useProject();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: project?.name,
        },
    });

    const onSubmit = async (formInfo: ProjectData) => {
        if (formInfo.name) {
            updateProject({
                name: formInfo.name,
            });
            toast.success("Your project name has been updated");
        }
    };
    return (
        <SettingsScreen title="Project" label="Manage your Integraflow Project">
            <div className="my-6 w-[593px] rounded-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        <TextInput
                            label={"Project Name"}
                            className="font-semibold"
                            defaultValue={project?.name}
                            {...register("name", {
                                required: {
                                    value: true,
                                    message: "Workspace URL is required",
                                },
                            })}
                            error={!!errors.name?.message}
                            errorMessage={errors.name?.message}
                        />
                        <div className="w-[114px]">
                            <Button text="Update" size="md" type="submit" />
                        </div>
                    </div>
                </form>
            </div>
        </SettingsScreen>
    );
};
