import { CirclePlusIcon, SettingsIcon } from "@/assets/images";
import { Dialog, DialogContent } from "@/components";
import { useProjectCreateMutation } from "@/generated/graphql";
import { handleRedirect } from "@/modules/auth/helper";
import { useSession } from "@/modules/users/hooks/useSession";
import { Button, TextInput } from "@/ui";
import { getAcronym } from "@/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Projects = () => {
    const { viewer, updateSession } = useSession();

    const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
    const [projectName, setProjectName] = useState<string>("");
    const [projectNameError, setProjectNameError] = useState("");

    const navigate = useNavigate();
    const [projectCreate] = useProjectCreateMutation();

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
                    Project: viewer?.project?.id,
                },
            },
        });

        if (result.data?.projectCreate) {
            updateSession({ project: result.data.projectCreate.project });
            setOpenCreateProjectModal(false);
        }
    };

    useEffect(() => {
        if (openCreateProjectModal === false) {
            setProjectName("");
            setProjectNameError("");
        }
    }, [openCreateProjectModal]);

    useEffect(() => {
        handleRedirect(viewer, navigate);
    }, [viewer]);

    return (
        <>
            <div className="mb-9 space-y-2">
                <p className="text-xs text-intg-text-4">Project</p>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="outline-none">
                        <p className="flex w-[177px] items-center text-intg-text-4">
                            <span className="mr-3 rounded bg-gradient-button px-1.5 uppercase">
                                {getAcronym(viewer?.project?.name as string)}
                            </span>
                            <span className="capitalize">
                                {viewer?.project?.name}
                            </span>
                            <span className="ml-auto">
                                <ChevronDown size={16} />
                            </span>
                        </p>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            align="start"
                            alignOffset={50}
                            className="border-intg-bg-10  w-[221px] rounded border bg-intg-bg-9 p-2 text-white"
                        >
                            <DropdownMenu.Group>
                                {viewer?.projects?.edges.map((item) => {
                                    return (
                                        <DropdownMenu.Item
                                            key={item.node.id}
                                            className="hover:bg-intg-bg-10 flex cursor-pointer rounded p-2"
                                            onClick={() => {}}
                                        >
                                            <span className="mr-3 rounded bg-gradient-button px-1.5">
                                                IF
                                            </span>
                                            <span>{item.node.name}</span>
                                        </DropdownMenu.Item>
                                    );
                                })}
                            </DropdownMenu.Group>

                            <DropdownMenu.Separator className="my-3 border-[.5px] border-intg-bg-4" />
                            <DropdownMenu.Group>
                                <DropdownMenu.Item className="flex cursor-pointer items-center space-x-2 px-3 py-2">
                                    <span>
                                        <SettingsIcon />
                                    </span>
                                    <span>Project Settings</span>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item>
                                    <Button
                                        icon={<CirclePlusIcon />}
                                        variant="custom"
                                        text="New Project"
                                        size="md"
                                        className="bg-intg-bg-11"
                                        onClick={() =>
                                            setOpenCreateProjectModal(true)
                                        }
                                    />
                                </DropdownMenu.Item>
                            </DropdownMenu.Group>
                            <DropdownMenu.CheckboxItem>
                                <DropdownMenu.ItemIndicator />
                            </DropdownMenu.CheckboxItem>

                            <DropdownMenu.Separator />
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>
            <Dialog
                open={openCreateProjectModal}
                onOpenChange={(value) => setOpenCreateProjectModal(value)}
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
        </>
    );
};
