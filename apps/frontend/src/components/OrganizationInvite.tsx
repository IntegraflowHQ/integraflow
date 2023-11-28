import { CopyIcon } from "@/assets/images";
import { Dialog, DialogContent } from "@/components";
import { useOrganizationInviteCreateMutation } from "@/generated/graphql";
import { useSession } from "@/modules/users/hooks/useSession";
import { Button, TextInput } from "@/ui";
import { copyToClipboard } from "@/utils";
import { toast } from "@/utils/toast";
import { useState } from "react";

type Props = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
};

export const OrganizationInvite = ({ open, onOpenChange }: Props) => {
    const [createInvite] = useOrganizationInviteCreateMutation();
    const { viewer } = useSession();

    const [toggleInviteType, setToggleInviteType] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inputError, setInputError] = useState<string | undefined>("");
    const inviteLinkValue =
        "http://localhost:8000/invite/018c0588-69d6-0000-07b3-ae87957d1829/accept";

    const handleEmailInvite = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inviteEmail) {
            setInputError("Field cannot be empty");
            return;
        }

        const emailRegex =
            /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}(?:, ?[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7})*$/;
        if (!emailRegex.test(inviteEmail)) {
            setInputError("Check the format in which the email is entered");
            return;
        }

        const result = await createInvite({
            variables: {
                input: {
                    email: inviteEmail,
                },
            },
        });
        if (result.data?.organizationInviteCreate?.organizationInvite) {
            onOpenChange(!open);
            toast.success(
                "Success! Your email to join the workspace has been sent",
            );
        }

        if (result.data?.organizationInviteCreate?.errors.length > 0) {
            toast.error(
                result.data?.organizationInviteCreate?.errors[0].message,
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                alignHeader="left"
                title={`Invite others to '${viewer?.organization?.name}'`}
                description="Invite others to your project to collaborate together in intergraflow. An invite is specific to an email address and expires after 3 days."
            >
                {!toggleInviteType ? (
                    <form onSubmit={handleEmailInvite}>
                        <div className="mt-3 flex w-full items-end space-x-2">
                            <div className="w-[75%]">
                                <TextInput
                                    label="Email address"
                                    placeholder="example1@gmail.com, example2@gmail.com, "
                                    value={inviteEmail}
                                    onChange={(e) => {
                                        setInviteEmail(e.target.value);
                                        setInputError("");
                                    }}
                                    error={!!inputError}
                                    errorMessage={inputError}
                                />
                            </div>
                            <div
                                className={`${
                                    inputError ? "mb-7" : ""
                                } w-[25%]`}
                            >
                                <Button text="Send Invite" size="md" />
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="mt-3">
                        <p className="mb-4 text-sm text-intg-text">
                            Invite link will provide a unique URL that allow
                            anyone to join your organization
                        </p>

                        <div className="flex w-full items-end space-x-2">
                            <div className="w-[75%]">
                                <TextInput
                                    value={inviteLinkValue}
                                    disabled={true}
                                />
                            </div>
                            <div className="w-[20%]">
                                <Button
                                    text="Copy"
                                    size="md"
                                    icon={<CopyIcon />}
                                    textAlign="center"
                                    onClick={() =>
                                        copyToClipboard(
                                            inviteLinkValue,
                                            "Invite link copied to clipboard",
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
                <div className="py-4">
                    <hr className="border-intg-bg-4" />
                </div>
                <div className="w-[30%]">
                    <Button
                        variant="custom"
                        text={
                            toggleInviteType
                                ? "Invite with email"
                                : "Invite with link"
                        }
                        className=" bg-transparent text-intg-text hover:text-intg-bg-2"
                        size="md"
                        onClick={() => setToggleInviteType(!toggleInviteType)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
