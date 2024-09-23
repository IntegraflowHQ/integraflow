import { useProject } from "@/modules/projects/hooks/useProject";
import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { ROUTES } from "@/routes";
import { Button, TextInput } from "@/ui";
import { toast } from "@/utils/toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type WorkspaceData = {
    workspaceName: string | undefined;
    workspaceUrl: string | undefined;
};

export const General = () => {
    const navigate = useNavigate();
    const { workspace, updateWorkspace } = useWorkspace();
    const { project } = useProject();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            workspaceName: workspace?.name,
            workspaceUrl: workspace?.slug,
        },
    });

    const onSubmit = async (formInfo: WorkspaceData) => {
        if (!formInfo) {
            toast.error("Field cannot be empty");
            return;
        }

        const response = await updateWorkspace(
            {
                name: formInfo.workspaceName,
                slug: formInfo.workspaceUrl,
            },
            false,
        );

        if (response?.data?.organizationUpdate?.organization?.slug && project?.slug) {
            navigate(
                `${ROUTES.WORKSPACE_SETTINGS}`
                    .replace(":orgSlug", response.data.organizationUpdate.organization?.slug)
                    .replace(":projectSlug", project?.slug),
            );
            toast.success(`Your organization name has been updated`);
        } else {
            toast.error(`Your organization failed to update, please try again later`);
        }
    };
    return (
        <form className="w-[593px] pt-10" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
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
                    defaultValue={workspace?.name}
                    error={!!errors.workspaceName?.message}
                    errorMessage={errors.workspaceName?.message}
                />
                <TextInput
                    prefix="integraflow.app/"
                    label={"Workspace URL"}
                    defaultValue={workspace?.slug}
                    placeholder={""}
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
                            message: "Workspace URL must be at most 48 characters",
                        },
                        pattern: {
                            value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                            message: "Workspace URL must be in the correct format, eg: my-workspace",
                        },
                    })}
                    error={!!errors.workspaceUrl?.message}
                    errorMessage={errors.workspaceUrl?.message}
                />
                <div className="w-[114px]">
                    <Button text="Update" type="submit" className="w-[114px]" size="md" />
                </div>
            </div>

            {/*
            <div className="space-y-6 text-sm text-intg-text-4">
                <div className="space-y-2">
                    <h3 className="font-semibold">Delete Workspace</h3>
                    <p className="text-sm">
                        If you want to permanently delete this workspace and all of it’s data, including all users
                        responses.
                    </p>
                </div>
                <div className="w-[213px]">
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
                                        If you are sure you want to proceed with the deletion of the workspace
                                        Integraflow, please continue below.
                                    </p>
                                    <p>
                                        Keep in mind this operation is irreversible and will result in a complete
                                        deletion of all the data associated with the workspace.
                                    </p>
                                    <p>
                                        Data including but not limited to users, issues and comments will be permanently
                                        deleted.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-intg-text-2">
                                        Enter the wokspace name
                                        <span className="font-semibold">"{`${workspace?.name}`}"</span> to delete this
                                        workspace.
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
            </div> */}
        </form>
    );
};
