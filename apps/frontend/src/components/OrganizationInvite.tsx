import {
    useOrganizationInviteCreateMutation,
    useOrganizationInviteLinkCreateLazyQuery,
    useOrganizationInviteLinkResetMutation,
} from "@/generated/graphql";
import useSession from "@/modules/users/hooks/useSession";
import { Button, Dialog, DialogContent, TextInput } from "@/ui";
import { CopyIcon } from "@/ui/icons";
import { addEllipsis, copyToClipboard } from "@/utils";
import { toast } from "@/utils/toast";
import { RefreshCcwIcon } from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
};

export const OrganizationInvite = ({ open, onOpenChange }: Props) => {
    const [fetchInviteLink, { data: inviteLink, loading: loadingInviteLink }] =
        useOrganizationInviteLinkCreateLazyQuery();
    const [emailInvite] = useOrganizationInviteCreateMutation();
    const { session } = useSession();
    const [resetInviteLink, { loading: loadingLinkReset, data }] =
        useOrganizationInviteLinkResetMutation();

    const [toggleInviteType, setToggleInviteType] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inputError, setInputError] = useState<string | undefined>("");

    const handleLinkInvite = async () => {
        await fetchInviteLink();
    };

    const handleEmailInvite = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inviteEmail) {
            setInputError("Field cannot be empty");
            return;
        }

        const emailRegex =
            /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}(?:, ?[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7})*$/;
        if (!emailRegex.test(inviteEmail)) {
            setInputError("Format: (example@gmail.com, example2@gmail.com)");
            return;
        }

        const emailArray = inviteEmail.trim().split(",");

        const promises = emailArray.map(async (email) => {
            return emailInvite({
                variables: {
                    input: {
                        email: email.trim(),
                    },
                },
            });
        });

        const results = await Promise.all(promises);
        const failedPromise = results.filter((item) => {
            return item.data?.organizationInviteCreate?.errors?.length > 0;
        });

        const errorMessages = failedPromise.flatMap(
            (response) =>
                response?.data?.organizationInviteCreate?.organizationErrors.map(
                    (error) => error.message,
                ),
        );

        const flatErrorMessages = new Set(errorMessages);

        if (failedPromise.length === 0) {
            onOpenChange(!open);
            toast.success(
                "Success! Your email to join the workspace has been sent",
            );
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
        await resetInviteLink();
    };
    const inviteLinkValue = useMemo(() => {
        if (data?.organizationInviteLinkReset?.inviteLink) {
            return `${window.location.host}${data?.organizationInviteLinkReset?.inviteLink}`;
        }
        if (inviteLink?.organizationInviteLink?.inviteLink) {
            return `${window.location.host}${inviteLink?.organizationInviteLink?.inviteLink}`;
        }
        return "";
    }, [
        data?.organizationInviteLinkReset?.inviteLink,
        inviteLink?.organizationInviteLink?.inviteLink,
    ]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                alignHeader="left"
                title={`Invite others to '${session?.organization?.name}'`}
                description="Invite others to your project to collaborate together in intergraflow. An invite is specific to an email address and expires after 3 days."
            >
                {!toggleInviteType ? (
                    <form onSubmit={handleEmailInvite}>
                        <div className="flex w-full items-start gap-2 pt-3">
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
                            <div className={`mt-7 w-[25%]`}>
                                <Button text="Send Invite" size="md" />
                            </div>
                        </div>
                    </form>
                ) : (
                    <div onSubmit={handleLinkInvite} className="mt-3">
                        <p className="mb-4 text-sm text-intg-text">
                            Invite link will provide a unique URL that allow
                            anyone to join your organization
                        </p>

                        <div className="flex w-full items-end gap-2">
                            <div className="w-[75%]">
                                <TextInput
                                    placeholder=""
                                    value={addEllipsis(inviteLinkValue, 50)}
                                    disabled={true}
                                    rightIcon={
                                        <button
                                            disabled={
                                                loadingLinkReset ||
                                                loadingInviteLink
                                            }
                                            onClick={handleInviteLinkRefresh}
                                        >
                                            <RefreshCcwIcon
                                                size={20}
                                                className={
                                                    loadingLinkReset
                                                        ? "spinner__circle"
                                                        : ""
                                                }
                                            />
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
                                    disabled={loadingInviteLink}
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
