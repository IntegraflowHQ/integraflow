import { OrganizationInviteLinkDetails } from "@/generated/graphql";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { ExpiredInviteLink } from "@/modules/workspace/components/invite/ExpiredInviteLink";
import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { Button, GlobalSpinner, Screen } from "@/ui";
import { AcronynmBox } from "@/ui/NavItem/AcronynmBox";
import { getAcronym } from "@/utils";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const LinkWorkspaceInvitation = () => {
    const { inviteLink } = useParams();
    const { loading, getInviteDetails, joinWorkspace } = useWorkspace();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [inviteDetails, setInviteDetails] =
        useState<OrganizationInviteLinkDetails>();

    useEffect(() => {
        const fetchInviteDetails = async () => {
            const response = await getInviteDetails(window.location.href);
            if (response) {
                setInviteDetails(response as OrganizationInviteLinkDetails);
            }
        };

        fetchInviteDetails();
    }, [getInviteDetails, inviteLink]);

    const handleJoinOrganization = async () => {
        if (isAuthenticated) {
            await joinWorkspace(window.location.pathname);
        } else {
            navigate(`/?inviteLink=${window.location.href}`);
        }
    };

    if (loading) {
        return <GlobalSpinner />;
    }

    if (!inviteDetails) {
        return <ExpiredInviteLink />;
    }

    return (
        <Screen>
            <div className="flex h-[calc(100%-5rem)] w-full items-center justify-between">
                <div className="m-auto space-y-6 rounded-md bg-intg-bg-4 p-6 text-center text-intg-text lg:w-1/2">
                    <div className="m-auto w-fit text-center">
                        <AcronynmBox
                            size="md"
                            text={getAcronym(
                                inviteDetails?.organizationName ?? "",
                            )}
                        />
                    </div>
                    <p className="text-center text-3xl font-semibold text-white">
                        <span>You have been invited you to</span>
                        <br />
                        {inviteDetails?.organizationName}
                    </p>
                    <p>
                        Redefine customer experience with organic feedback and
                        behavioral data in real-time. Enjoy intuitive designs,
                        open source surveys, advanced analytics, seamless
                        collaboration on the go.
                    </p>
                    <div className="m-auto w-[80%]">
                        <Button
                            onClick={handleJoinOrganization}
                            text={isAuthenticated ? "Accept" : "Login"}
                        />
                    </div>
                </div>
            </div>
        </Screen>
    );
};
