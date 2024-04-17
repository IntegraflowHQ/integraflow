import { Link, LucideMail, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";

import { User } from "@/generated/graphql";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { useWorkspaceInvite } from "@/modules/workspace/hooks/useWorkspaceInvite";
import { Button, Dialog, DialogContent, TextInput } from "@/ui";
import { CopyIcon } from "@/ui/icons";
import { addEllipsis, copyToClipboard } from "@/utils";
import { toast } from "@/utils/toast";
import { DeepPartial } from "@apollo/client/utilities";

type Props = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
};

const EMAIL_REGEX =
    /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}(?:, ?[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7})*$/;

export const OrganizationInvite = ({ open, onOpenChange }: Props) => {
    const { workspace } = useWorkspace();
    const { loading, emailInvite, getInviteLink, resetInviteLink } = useWorkspaceInvite();
    const { user, updateUser } = useAuth();

    const [toggleInviteType, setToggleInviteType] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inputError, setInputError] = useState<string | undefined>("");
    const [inviteLink, setInviteLink] = useState("");

    const handleLinkInvite = async () => {
        const response = await getInviteLink();
        if (response?.inviteLink) {
            setInviteLink(`${window.location.host}${response?.inviteLink}`);
        }
    };

    const handleEmailInvite = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inviteEmail) {
            setInputError("Field cannot be empty");
            return;
        }

        if (!EMAIL_REGEX.test(inviteEmail)) {
            setInputError("Format: (example@gmail.com, example2@gmail.com)");
            return;
        }

        const emailArray = inviteEmail.trim().split(",");

        const promises = emailArray.map(async (email) => {
            return emailInvite({
                email: email.trim(),
            });
        });

        const responses = await Promise.all(promises);
        const successfulPromises = responses.filter((response) => !(response instanceof Error));

        const updatedUser = JSON.parse(JSON.stringify(user)) as DeepPartial<User>;
        const currentOrganization = updatedUser.organizations?.edges?.find((org) => org?.node?.id === workspace?.id);

        if (currentOrganization?.node?.invites) {
            currentOrganization.node.invites.edges = [
                ...(currentOrganization.node.invites.edges || []),
                ...successfulPromises.map((res) => {
                    return {
                        node: res?.organizationInvite,
                    };
                }),
            ];
            updateUser(updatedUser);
        }

        const failedPromise = responses.filter((response) => {
            if (response instanceof Error) {
                return true;
            }
            return (response?.errors?.length ?? 0) > 0;
        });

        const errorMessages = failedPromise.flatMap((response) => {
            if (response instanceof Error) {
                return [response.message];
            }

            return response?.errors?.map((error) => error.message);
        });

        const flatErrorMessages = new Set(errorMessages);

        if (failedPromise.length === 0) {
            onOpenChange(!open);
            toast.success("Success! Your email to join the workspace has been sent");
        }

        if (flatErrorMessages.size > 0) {
            toast.custom(
                <>
                    {Array.from(flatErrorMessages).map((item, index) => (
                        <>
                            {index > 0 && (
                                <div className="py-2">
                                    <hr className="border-[.5px] border-intg-bg-2" />
                                </div>
                            )}
                            <p>{item}</p>
                        </>
                    ))}
                </>,
                { duration: 5000 },
                "error",
            );
        }
    };

    const handleInviteLinkRefresh = async () => {
        const response = await resetInviteLink();
        if (response?.inviteLink) {
            setInviteLink(`${window.location.host}${response?.inviteLink}`);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                alignHeader="left"
                title={`Invite others to '${workspace?.name}'`}
                description="Invite others to your project to collaborate together in intergraflow. An invite is specific to an email address and expires after 3 days."
            >
                {!toggleInviteType ? (
                    <form onSubmit={handleEmailInvite}>
                        <div className="flex w-full items-start gap-2 pt-3">
                            <div className="w-[70%]">
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
                            <div className={`mt-7 w-[30%]`}>
                                <Button text="Send Invite" size="md" />
                            </div>
                        </div>
                    </form>
                ) : (
                    <div onSubmit={handleLinkInvite} className="mt-3">
                        <p className="mb-4 text-sm text-intg-text">
                            Invite link will provide a unique URL that allow anyone to join your organization
                        </p>
                        <div className="flex w-full items-end gap-2">
                            <div className="w-[75%]">
                                <TextInput
                                    placeholder=""
                                    value={addEllipsis(inviteLink, 40)}
                                    disabled={true}
                                    rightIcon={
                                        <button disabled={loading} onClick={handleInviteLinkRefresh}>
                                            <RefreshCcwIcon size={20} className={loading ? "spinner__circle" : ""} />
                                        </button>
                                    }
                                />
                            </div>
                            <div className="w-[20%]">
                                <Button
                                    text="Copy"
                                    size="md"
                                    icon={<CopyIcon />}
                                    textAlign="center"
                                    disabled={loading}
                                    onClick={() => copyToClipboard(inviteLink, "Invite link copied to clipboard")}
                                />
                            </div>
                        </div>
                    </div>
                )}
                <div className="py-4">
                    <hr className="border-intg-bg-4" />
                </div>
                <div>
                    <Button
                        variant="custom"
                        icon={toggleInviteType ? <LucideMail size={20} /> : <Link size={20} />}
                        text={toggleInviteType ? "Invite with email" : "Invite with link"}
                        className=" w-max bg-transparent text-intg-text hover:text-intg-bg-2"
                        size="md"
                        onClick={() => {
                            setToggleInviteType(!toggleInviteType);
                            !toggleInviteType && handleInviteLinkRefresh();
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
