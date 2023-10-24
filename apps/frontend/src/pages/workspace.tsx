import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { Button, Select, TextInput } from "../ui";

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

const Workspace = () => {
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

  const [name] = watch(["workspaceName"]);
  useEffect(() => {
    if (name && !touchedFields.workspaceUrl) {
      setValue(
        "workspaceUrl",
        `${slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g })}`,
      );
    }
    if (!name && !touchedFields.workspaceUrl) {
      setValue("workspaceUrl", "");
    }
    console.log(name);
  }, [name]);

  const onSubmit = (data: WorkSpaceData) => {
    console.log("first");
    console.log(data);
  };
  const urlRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="overflow-scroll rounded-md border p-5  shadow-md lg:max-w-lg">
        <h3 className="text-center text-2xl font-semibold">
          Create a new workspace
        </h3>
        <p className="mt-4 text-center">
          Workspaces are where you manage your team's work. They can be
          customized to fit how your team works.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-6 mt-8 rounded-md border bg-[#eee] p-6">
            <TextInput
              ref={nameRef}
              label={"Workspace Name"}
              placeholder={""}
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
                  message: "Workspace name must be at most 20 characters",
                },
              })}
              error={!!errors.workspaceName?.message}
              errorMessage={errors.workspaceName?.message}
            />
            <TextInput
              ref={urlRef}
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
              error={!!errors.workspaceUrl?.message}
              errorMessage={errors.workspaceUrl?.message}
            />

            <Select
              title={"How large is your company"}
              defaultValue={WorkspaceSizeOptions[0].value}
              options={WorkspaceSizeOptions}
              register={register("workspaceSize", {
                required: {
                  value: true,
                  message: "Workspace size is required",
                },
              })}
            />

            <Select
              title={"What is your role in the company"}
              defaultValue={WorkspaceRoles[0].value}
              options={WorkspaceRoles}
              register={register("workspaceRole", {
                required: {
                  value: true,
                  message: "Workspace role is required",
                },
              })}
            />
          </div>
          <Button text="Create Workspace" />
          {/* <div className="text-center"> */}
          {/* <Button
              className="bg-tasker-black hover:bg-tasker-black border-tasker-black w-2/3 border-2 "
              type="submit"
            >
              Create Workspace
            </Button> */}
          {/* </div> */}
        </form>
      </div>
    </div>
  );
};

export default Workspace;
