import { Project, useProjectCreateMutation } from "@/generated/graphql";
import useWorkspace from "@/modules/workspace/hooks/useWorkspace";
import { Button, Dialog, DialogContent, TextInput } from "@/ui";
import { omitTypename } from "@/utils";
import { toast } from "@/utils/toast";
import React, { useState } from "react";
import { useProject } from "../hooks/useProject";

type Props = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
};

export const CreateNewProject = ({ open, onOpenChange }: Props) => {
    const [projectCreate] = useProjectCreateMutation();
    const { workspace, switchProject } = useWorkspace();
    const { upsertProject } = useProject();

    const [projectName, setProjectName] = useState<string>("");
    const [projectNameError, setProjectNameError] = useState<
        string | undefined
    >("");

    const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!projectName) {
            setProjectNameError("Field cannot be empty");
            return;
        }
        if (projectName.split("").length <= 2) {
            setProjectNameError("Minimum length of project is 3");
            return;
        }

        const result = await projectCreate({
            variables: {
                input: { name: projectName },
            },
            context: {
                headers: {
                    Project: workspace?.project?.id,
                },
            },
        });

        if (result.data?.projectCreate?.projectErrors.length > 0) {
            toast.error(result.data.projectCreate.projectErrors[0].message);
        }

        if (result.data?.projectCreate?.project) {
            toast.success("Project created");
            upsertProject(
                omitTypename(result.data.projectCreate.project as Project),
            );
            switchProject(
                omitTypename(result.data.projectCreate.project as Project),
            );
            onOpenChange(!open);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open: boolean) => {
                onOpenChange(open);
                open === false ? setProjectName("") : null;
            }}
        >
            <DialogContent title="Create new survey">
                <div className="mt-6 w-[34rem]">
                    <form onSubmit={handleCreateProject}>
                        <TextInput
                            label="Project Name"
                            placeholder="Project name"
                            value={projectName}
                            onChange={(e) => {
                                setProjectName(e.target.value);
                                setProjectNameError("");
                            }}
                            error={!!projectNameError}
                            errorMessage={projectNameError}
                        />
                        <div className="my-6">
                            <hr className="border-intg-bg-4" />
                        </div>
                        <div className="w-full">
                            <Button
                                text="Create Project"
                                className="w-full px-8 py-4"
                                type="submit"
                            />
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
