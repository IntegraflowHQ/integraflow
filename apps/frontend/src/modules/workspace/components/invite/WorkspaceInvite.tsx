import { Link, LucideMail, RefreshCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { OrganizationErrorCode, OrganizationInvite, OrganizationInviteCreate, User } from "@/generated/graphql";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { useWorkspaceInvite } from "@/modules/workspace/hooks/useWorkspaceInvite";
import { Button, Dialog, DialogContent, TextInput } from "@/ui";
import { CopyIcon } from "@/ui/icons";
import { copyToClipboard } from "@/utils";
import { toast } from "@/utils/toast";
import { DeepPartial } from "@apollo/client/utilities";

type Props = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
};

const EMAIL_REGEX =
    /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}(?:, ?[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7})*$/;

export const WorkspaceInvite = ({ open, onOpenChange }: Props) => {
    const { workspace } = useWorkspace();
    const { loading, emailInvite, loadingEmailInvite, getInviteLink, resetInviteLink } = useWorkspaceInvite();
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

    useEffect(() => {
        handleLinkInvite();
    }, [onOpenChange]);

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
        const successfulPromises: typeof responses = [];
        const failedPromises: typeof responses = [];
        responses.filter((response) => {
            if (response && (response as OrganizationInviteCreate).organizationInvite) {
                successfulPromises.push(response);
            }
            failedPromises.push(response);
        });

        const updatedUser = JSON.parse(JSON.stringify(user)) as DeepPartial<User>;
        const currentOrganization = updatedUser.organizations?.edges?.find((org) => org?.node?.id === workspace?.id);

        if (currentOrganization?.node?.invites) {
            currentOrganization.node.invites.edges = [
                ...(currentOrganization.node.invites.edges || []),
                ...successfulPromises.map((res) => {
                    return {
                        node: (res as OrganizationInviteCreate).organizationInvite as OrganizationInvite,
                    };
                }),
            ];
            updateUser(updatedUser, true);
        }

        const errorMessages = failedPromises.flatMap((response) => {
            if (response instanceof Error) {
                return [response.message];
            }

            return response?.errors
                ?.filter((error) => error.code !== OrganizationErrorCode.AlreadyExists)
                .map((error) => error.message);
        });

        const flatErrorMessages = new Set(errorMessages);

        if (errorMessages.length === 0) {
            onOpenChange(!open);
            setInviteEmail("");
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
                description="Invite others to your project to collaborate together in Integraflow. An invite is specific to an email address and expires after 3 days."
            >
                {!toggleInviteType ? (
                    <form onSubmit={handleEmailInvite}>
                        <div className="flex w-full items-start gap-2 pt-3">
                            <div className="flex-1">
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
                            <div className="min-w-[20%]">
                                <Button
                                    text={loadingEmailInvite ? "" : "Submit"}
                                    textAlign="center"
                                    size="md"
                                    className="mt-7"
                                    disabled={loadingEmailInvite}
                                    icon={
                                        loadingEmailInvite ? (
                                            <RefreshCcwIcon
                                                size={24}
                                                className={loadingEmailInvite ? "spinner__circle" : ""}
                                            />
                                        ) : null
                                    }
                                />
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="mt-3">
                        <p className="mb-4 text-sm text-intg-text">
                            Invite link will provide a unique URL that allows anyone to join your organization.
                        </p>
                        <div className="flex w-full items-end gap-2">
                            <div className="flex-1">
                                <TextInput
                                    placeholder=""
                                    value={inviteLink}
                                    disabled={true}
                                    rightIcon={
                                        <Button
                                            variant="custom"
                                            size="sm"
                                            disabled={loading}
                                            onClick={handleInviteLinkRefresh}
                                            data-testid="refresh-invite-link"
                                            icon={
                                                <RefreshCcwIcon
                                                    size={16}
                                                    className={loading ? "spinner__circle" : ""}
                                                />
                                            }
                                        />
                                    }
                                    data-testid="invite-link"
                                />
                            </div>
                            <Button
                                text="Copy"
                                size="md"
                                icon={<CopyIcon />}
                                textAlign="center"
                                disabled={loading}
                                onClick={() => copyToClipboard(inviteLink, "Invite link copied to clipboard")}
                                className="min-w-max max-w-[20%]"
                            />
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
                        }}
                        data-testid="toggle-invite-type"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
