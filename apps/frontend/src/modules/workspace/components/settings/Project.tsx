import { useProject } from "@/modules/projects/hooks/useProject";
import { Button, TextInput } from "@/ui";
import { addEllipsis, copyToClipboard } from "@/utils";
import { toast } from "@/utils/toast";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SettingsScreen } from "./SettingsScreen";

type ProjectData = {
    name: string | undefined;
};

export const Project = () => {
    const { updateProject, project, loading, refreshProjectToken } = useProject();

    const [projectToken, setProjectToken] = useState(project?.apiToken);

    const handleProjectTokeRefresh = async () => {
        const response = await refreshProjectToken();
        if (response?.project) {
            setProjectToken(response?.project.apiToken);
        }
    };

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
            <div className="my-6 w-[593px] space-y-8 rounded-md">
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
                <hr className="border-intg-bg-4" />
                <div className="flex w-full items-end gap-2">
                    <div className="flex-1">
                        <TextInput
                            label="API Key"
                            placeholder=""
                            value={addEllipsis(projectToken as string, 40)}
                            disabled={true}
                            rightIcon={
                                <Button
                                    variant="custom"
                                    size="sm"
                                    disabled={loading}
                                    onClick={handleProjectTokeRefresh}
                                    icon={<RefreshCcwIcon size={16} className={loading ? "spinner__circle" : ""} />}
                                />
                            }
                        />
                    </div>
                    <Button
                        text="Copy"
                        size="md"
                        icon={<CopyIcon size={16} />}
                        textAlign="center"
                        disabled={loading}
                        onClick={() => copyToClipboard(project?.apiToken as string, "API key copied to clipboard")}
                        className="min-w-max max-w-[20%]"
                    />
                </div>
            </div>
        </SettingsScreen>
    );
};
