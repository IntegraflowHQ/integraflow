import { OrganizationInviteLinkDetails } from "@/generated/graphql";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { ExpiredInviteLink } from "@/modules/workspace/components/invite/ExpiredInviteLink";
import { useWorkspaceInvite } from "@/modules/workspace/hooks/useWorkspaceInvite";
import { AcronymBox, Button, GlobalSpinner, Screen } from "@/ui";
import { getAcronym, parseInviteLink } from "@/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const LinkWorkspaceInvitation = () => {
    const inviteLink = parseInviteLink(window.location.pathname);
    const { loading, getInviteDetails, joinWorkspace } = useWorkspaceInvite();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [inviteDetails, setInviteDetails] = useState<OrganizationInviteLinkDetails>();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const fetchInviteDetails = async () => {
            const response = await getInviteDetails(inviteLink);
            if (response) {
                setInviteDetails(response as OrganizationInviteLinkDetails);
            }
            setReady(true);
        };

        fetchInviteDetails();
    }, []);

    const handleJoinOrganization = async () => {
        if (isAuthenticated) {
            await joinWorkspace(inviteLink);
        } else {
            navigate(`/?inviteLink=${inviteLink}`);
        }
    };

    if (loading || !ready) {
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
                        <AcronymBox size="md" text={getAcronym(inviteDetails?.organizationName ?? "")} />
                    </div>
                    <p className="text-center text-3xl font-semibold text-white">
                        <span>You have been invited you to</span>
                        <br />
                        {inviteDetails?.organizationName}
                    </p>
                    <p>
                        Redefine customer experience with organic feedback and behavioral data in real-time. Enjoy
                        intuitive designs, open source surveys, advanced analytics, seamless collaboration on the go.
                    </p>
                    <div className="m-auto w-[80%]">
                        <Button onClick={handleJoinOrganization} text={isAuthenticated ? "Accept" : "Login"} />
                    </div>
                </div>
            </div>
        </Screen>
    );
};
