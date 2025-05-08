import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import Logo from "../assets/images/logo.png";
import { Button, GlobalSpinner, SelectInput, TextInput } from "../ui";

enum WorkspaceSize {
    Select = "Select your company size",
    Small = "0-10",
    Medium = "11-50",
    Large = "50+",
}

type WorkSpaceData = {
    workspaceName: string;
    workspaceRole: string;
    workspaceSize: string;
    workspaceUrl: string;
};

const WorkspaceSizeOptions = [
    { label: WorkspaceSize.Select, value: "null" },
    { label: WorkspaceSize.Small, value: WorkspaceSize.Small },
    { label: WorkspaceSize.Medium, value: WorkspaceSize.Medium },
    { label: WorkspaceSize.Large, value: WorkspaceSize.Large },
];

const WorkspaceRoles = [
    { label: "Select your role in the company", value: "null" },
    { label: "Developer", value: "Developer" },
    { label: "Designer", value: "Designer" },
    { label: "Product Manager", value: "Product Manager" },
    { label: "Project Manager", value: "Project Manager" },
    { label: "Marketing", value: "Marketing" },
    { label: "Sales", value: "Sales" },
    { label: "Customer Support", value: "Customer Support" },
    { label: "Other", value: "Other" },
];

const CreateWorkspace = () => {
    const { createWorkspace, loading } = useWorkspace();
    const {
        watch,
        setValue,
        register,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm({
        defaultValues: {
            workspaceSize: WorkspaceSizeOptions[0].value,
            workspaceRole: WorkspaceRoles[0].value,
            workspaceName: "",
            workspaceUrl: "",
        },
    });
    const [workspaceError, setWorkspaceError] = useState<string>();
    const [name, url] = watch(["workspaceName", "workspaceUrl"]);

    useEffect(() => {
        if (name && !touchedFields.workspaceUrl) {
            setValue("workspaceUrl", `${slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g })}`);
        }
        if (!name && !touchedFields.workspaceUrl) {
            setValue("workspaceUrl", "");
        }
    }, [name, setValue, touchedFields.workspaceUrl]);

    useEffect(() => {
        setWorkspaceError("");
    }, [url]);

    const onSubmit = async (formInfo: WorkSpaceData) => {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        if (formInfo) {
            const input = {
                name: formInfo.workspaceName,
                slug: formInfo.workspaceUrl,
                timezone: userTimezone,
            };

            const survey = {
                companyRole: formInfo.workspaceRole,
                companySize: formInfo.workspaceSize,
            };

            const response = await createWorkspace(input, survey);

            if (response instanceof Error) {
                setWorkspaceError(response.message);
                return;
            }

            if (response?.organizationErrors?.length) {
                setWorkspaceError(response.organizationErrors[0].message ?? "");
                return;
            }
        }
    };

    if (loading) {
        return <GlobalSpinner />;
    }

    return (
        <main className="h-screen w-screen bg-intg-black">
            <div
                className="h-full overflow-y-auto px-12 pt-[50px]"
                style={{
                    backgroundImage: "radial-gradient(rgba(28, 15, 89, 0.30) 50%, rgba(5, 5, 5, 0.30))",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            >
                <div>
                    <img src={Logo} alt="Logo" />
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="m-auto rounded-md p-12 lg:max-w-lg">
                        <h3 className="mb-2 px-4 text-center text-3xl font-semibold text-intg-text">
                            Create a new workspace
                        </h3>
                        <p className="text-center text-base text-intg-text-4">Sign in to access your dashboard</p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="my-6 rounded-md">
                                <div className="space-y-4">
                                    <TextInput
                                        label={"Workspace Name"}
                                        placeholder={"Workspace Name"}
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
                                        error={!!errors.workspaceName?.message}
                                        errorMessage={errors.workspaceName?.message}
                                    />
                                    <TextInput
                                        prefix="integraflow.app/"
                                        label={"Workspace URL"}
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
                                                message: "Workspace URL must be at most 20 characters",
                                            },
                                            pattern: {
                                                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                                message:
                                                    "Workspace URL must be in the correct format, eg: my-workspace",
                                            },
                                        })}
                                        error={!!errors.workspaceUrl?.message || !!workspaceError}
                                        errorMessage={
                                            errors.workspaceUrl?.message ? errors.workspaceUrl?.message : workspaceError
                                        }
                                    />
                                </div>
                                <hr className="my-6 border-[1px] border-intg-bg-4" />
                                <div className="space-y-4">
                                    <SelectInput
                                        title={"How large is your company"}
                                        defaultValue={WorkspaceSizeOptions[0].value}
                                        options={WorkspaceSizeOptions}
                                        {...register("workspaceSize", {
                                            required: {
                                                value: true,
                                                message: "Workspace size is required",
                                            },
                                        })}
                                    />
                                    <SelectInput
                                        title={"What is your role in the company"}
                                        defaultValue={WorkspaceRoles[0].value}
                                        options={WorkspaceRoles}
                                        {...register("workspaceRole", {
                                            required: {
                                                value: true,
                                                message: "Workspace role is required",
                                            },
                                        })}
                                    />
                                </div>
                            </div>
                            <Button text="Create Workspace" data-testid="create-workspace" />
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CreateWorkspace;
