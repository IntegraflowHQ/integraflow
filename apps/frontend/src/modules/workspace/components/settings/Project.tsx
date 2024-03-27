import { useProject } from "@/modules/projects/hooks/useProject";
import { Button, Dialog, DialogContent, TextInput } from "@/ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SettingsScreen } from "./SettingsScreen";

type ProjectData = {
    name: string | undefined;
};

export const Project = () => {
    const { updateProject, project } = useProject();

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
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
        console.log(formInfo);
        if (formInfo.name) {
            updateProject({
                name: formInfo.name,
            });
        }
    };
    return (
        <SettingsScreen title="Project" label="Manage your Integraflow Profile">
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

                <hr className="my-6 border-[1px] border-intg-bg-4" />

                <div className="space-y-6 text-sm text-intg-text-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold">Delete Project</h3>
                        <p className="max-w-[386px] text-sm">
                            If you want to permanently delete this workspace and all of it’s data, including all users
                            responses.
                        </p>
                    </div>
                    <div className="w-[187px]">
                        <Button
                            text="Delete this project"
                            size="md"
                            variant="custom"
                            className="bg-[#CE3C55] text-white"
                            onClick={() => setOpenDeleteModal(true)}
                        />
                        <Dialog open={openDeleteModal} onOpenChange={(value) => setOpenDeleteModal(value)}>
                            <DialogContent alignHeader="left" title={"Verify workspace delete request"}>
                                <div className="space-y-6">
                                    <div className="space-y-3 text-sm text-intg-text">
                                        <p>
                                            If you are sure you want to proceed with the deletion of the project
                                            Integraflow, please continue below.
                                        </p>
                                        <p>
                                            Keep in mind this operation is irreversible and will result in a complete
                                            deletion of all the data associated with the project.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-intg-text-2">
                                            Enter the project name{" "}
                                            <span className="font-semibold">"{`${project?.name}`}"</span> to delete this
                                            project.
                                        </p>
                                        <TextInput placeholder="Enter the deletion code" />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-intg-text">
                                        <input type="checkbox" className="mt-1 self-start" />
                                        <p>
                                            I acknowledge that all of the workspace data will be deleted and want to
                                            proceed.
                                        </p>
                                    </div>
                                    <hr className="border-[1px] border-intg-bg-4" />

                                    <Button
                                        text="Delete this workspace"
                                        variant="custom"
                                        size="md"
                                        className="bg-[#CE3C55]"
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </SettingsScreen>
    );
};
