import { OrganizationInviteDetails } from "@/generated/graphql";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { ExpiredInviteLink } from "@/modules/workspace/components/invite/ExpiredInviteLink";
import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { Button, GlobalSpinner, Screen } from "@/ui";
import { AcronynmBox } from "@/ui/NavItem/AcronynmBox";
import { getAcronym } from "@/utils";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const EmailWorkspaceInvitation = () => {
    const { inviteLink } = useParams();
    const { user } = useCurrentUser();
    const { loading, getInviteDetails, joinWorkspace } = useWorkspace();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [inviteDetails, setInviteDetails] =
        useState<OrganizationInviteDetails>();

    useEffect(() => {
        const fetchInviteDetails = async () => {
            const response = await getInviteDetails(window.location.href);
            if (response) {
                setInviteDetails(response as OrganizationInviteDetails);
            }
        };

        fetchInviteDetails();
    }, [getInviteDetails, inviteLink]);

    const handleAcceptInvitation = async () => {
        if (!user) {
            navigate(
                `/?email=${inviteDetails?.email}&inviteLink=${window.location.pathname}`,
            );
            return;
        } else if (user?.email !== inviteDetails?.email) {
            await logout();
            navigate(
                `/?email=${inviteDetails?.email}&inviteLink=${window.location.pathname}`,
            );
            return;
        } else if (user?.email === inviteDetails?.email) {
            await joinWorkspace(window.location.pathname);
        }
    };

    if (loading) {
        return <GlobalSpinner />;
    }

    if (!inviteDetails || inviteDetails?.expired) {
        return <ExpiredInviteLink />;
    }

    return (
        <Screen>
            <div className="flex h-[calc(100%-5rem)] w-full items-center justify-between">
                <div className="m-auto w-1/2 space-y-4 rounded-md bg-intg-bg-4 p-8 text-center text-intg-text lg:w-1/2">
                    <div className="m-auto w-fit">
                        <AcronynmBox
                            size="md"
                            text={getAcronym(
                                inviteDetails?.organizationName ?? "",
                            )}
                        />
                    </div>
                    <p className="text-center text-3xl font-semibold text-white">
                        <span>{inviteDetails?.inviter} invited you to</span>
                        <br />
                        <span>{inviteDetails?.organizationName}</span>
                    </p>
                    <p>
                        Redefine customer experience with organic feedback and
                        behavioral data in real-time. Enjoy intuitive designs,
                        open source surveys, advanced analytics, seamless
                        collaboration on the go.
                    </p>
                    <hr className="border border-[.3px] border-intg-text" />
                    <p>
                        To accept the invitation, please login as
                        <br />
                        <b>{inviteDetails?.email}</b>
                    </p>
                    <div className="m-auto w-[80%]">
                        <Button
                            text={
                                user?.email === inviteDetails?.email
                                    ? "Accept"
                                    : "Login"
                            }
                            onClick={handleAcceptInvitation}
                        />
                    </div>
                </div>
            </div>
        </Screen>
    );
};
