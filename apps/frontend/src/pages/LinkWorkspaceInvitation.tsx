import { ExpiredInviteLink } from "@/components/ExpiredInviteLink";
import {
    Organization,
    OrganizationInviteDetails,
    Project,
    User,
    useOrganizationInviteDetailsLazyQuery,
    useOrganizationJoinMutation,
} from "@/generated/graphql";
import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import useSession from "@/modules/users/hooks/useSession";
import useUserState from "@/modules/users/hooks/useUserState";
import { Button, GlobalSpinner, Screen } from "@/ui";
import { AcronynmBox } from "@/ui/NavItem/AcronynmBox";
import { getAcronym, omitTypename } from "@/utils";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const LinkWorkspaceInvitation = () => {
    const { inviteLink } = useParams();
    const { createSession } = useSession();
    const { addWorkSpace } = useUserState();
    const { token } = useAuthToken();
    const navigate = useNavigate();

    const [joinOrganization, { loading }] = useOrganizationJoinMutation();

    const [
        fetchInviteDetails,
        { loading: inviteDetailsLoading, data: inviteDetails },
    ] = useOrganizationInviteDetailsLazyQuery({
        variables: {
            inviteLink: window.location.href,
        },
    });

    useEffect(() => {
        const getInviteDetails = async () => {
            await fetchInviteDetails();
        };
        getInviteDetails();
    }, [inviteLink]);

    const handleJoinOrganization = async () => {
        if (token) {
            const result = await joinOrganization({
                variables: {
                    input: {
                        inviteLink: window.location.pathname,
                    },
                },
            });
            if (result.data?.organizationJoin?.user) {
                const user = omitTypename(
                    result.data.organizationJoin?.user as User,
                );
                addWorkSpace(user);
                createSession({
                    organization: omitTypename(
                        result.data?.organizationJoin?.user
                            .organization as Organization,
                    ),
                    project: omitTypename(
                        result.data?.organizationJoin?.user.project as Project,
                    ),
                });
            }
        } else {
            navigate(`/?inviteLink=${window.location.href}`);
        }
    };

    if (loading || inviteDetailsLoading) {
        return <GlobalSpinner />;
    }
    if (
        (inviteDetails?.organizationInviteDetails as OrganizationInviteDetails)
            ?.expired ||
        !inviteDetails?.organizationInviteDetails
    ) {
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
                                (
                                    inviteDetails?.organizationInviteDetails as OrganizationInviteDetails
                                )?.organizationName,
                            )}
                        />
                    </div>
                    <p className="text-center text-3xl font-semibold text-white">
                        <span>You have been invited you to</span>
                        <br />
                        {
                            inviteDetails?.organizationInviteDetails
                                ?.organizationName
                        }
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
                            text={token ? "Accept" : "Login"}
                        />
                    </div>
                </div>
            </div>
        </Screen>
    );
};
