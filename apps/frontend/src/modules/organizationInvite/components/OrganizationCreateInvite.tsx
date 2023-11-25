import { CirclePlusIcon, CopyIcon } from "@/assets/images";
import { Dialog, DialogContent, DialogTrigger } from "@/components";
import { useOrganizationInviteCreateMutation } from "@/generated/graphql";
import { Button, TextInput } from "@/ui";
import { useState } from "react";

export const OrganizationCreateInvite = () => {
    const [createInvite] = useOrganizationInviteCreateMutation();

    const [toggleInviteType, setToggleInviteType] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");

    const handleCreateInvite = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inviteEmail) return;

        const emailRegex =
            /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}(?:, ?[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7})*$/;
        if (!emailRegex.test(inviteEmail)) return;

        console.log(inviteEmail);

        await createInvite({
            variables: {
                input: {
                    email: inviteEmail,
                },
            },
        });
    };

    return (
        <Dialog>
            <DialogTrigger>
                <li className="flex items-center space-x-2 px-3 py-2">
                    <span>
                        <CirclePlusIcon />
                    </span>
                    <span>Invite team</span>
                </li>
            </DialogTrigger>
            <DialogContent
                alignHeader="left"
                title="Invite others to 'organization name'"
                description="Invite others to your project to collaborate together in intergraflow. An invite is specific to an email address and expires after 3 days."
            >
                {!toggleInviteType ? (
                    <form onSubmit={handleCreateInvite}>
                        <div className="mt-3 flex w-full items-end space-x-2">
                            <div className="w-[65%]">
                                <TextInput
                                    label="Email address"
                                    placeholder="example1@gmail.com, example2@gmail.com, "
                                    value={inviteEmail}
                                    onChange={(e) =>
                                        setInviteEmail(e.target.value)
                                    }
                                />
                            </div>
                            <div className="w-[35%]">
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
                                    placeholder="example1@gmail.com, example2@gmail.com,"
                                    disabled={true}
                                />
                            </div>
                            <div className="w-[25%]">
                                <Button
                                    text="Copy"
                                    size="md"
                                    icon={<CopyIcon />}
                                    textAlign="center"
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
                        text="Invite with link"
                        className="hover:transparent bg-intg-bg-6 text-intg-text hover:bg-intg-text hover:text-white"
                        size="md"
                        onClick={() => setToggleInviteType(!toggleInviteType)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
