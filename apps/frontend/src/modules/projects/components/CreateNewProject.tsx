import { Button, Dialog, DialogContent, TextInput } from "@/ui";
import { toast } from "@/utils/toast";
import React, { useState } from "react";
import { useProject } from "../hooks/useProject";

type Props = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
};

export const CreateNewProject = ({ open, onOpenChange }: Props) => {
    const { createProject } = useProject();

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

        const response = await createProject(projectName);

        if (response instanceof Error) {
            toast.error(response.message);
            return;
        }

        if (response?.projectErrors?.length) {
            toast.error(response.projectErrors[0].message as string);
            return;
        }

        if (response?.project) {
            toast.success("Project created");
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
