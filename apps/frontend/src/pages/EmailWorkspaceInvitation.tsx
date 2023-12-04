import {
    Organization,
    OrganizationInviteDetails,
    Project,
    User,
    useOrganizationInviteDetailsLazyQuery,
    useOrganizationJoinMutation,
} from "@/generated/graphql";
import useLogout from "@/modules/auth/hooks/useLogout";
import { ExpiredInviteLink } from "@/modules/organizationInvite/components/ExpiredInviteLink";
import useSession from "@/modules/users/hooks/useSession";
import useUserState from "@/modules/users/hooks/useUserState";
import { Button, GlobalSpinner, Screen } from "@/ui";
import { AcronynmBox } from "@/ui/NavItem/AcronynmBox";
import { getAcronym, omitTypename } from "@/utils";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const EmailWorkspaceInvitation = () => {
    const { inviteLink } = useParams();
    const { user, addWorkSpace } = useUserState();
    const { createSession } = useSession();

    const { handleLogout } = useLogout();

    const [joinOrganization, { loading }] = useOrganizationJoinMutation();

    const [
        fetchInviteDetails,
        { data: inviteDetails, loading: inviteDetailsLoading },
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
    const navigate = useNavigate();

    const handleAcceptInvitation = async () => {
        if (!user) {
            navigate(
                `/?email=${
                    (
                        inviteDetails?.organizationInviteDetails as OrganizationInviteDetails
                    ).email
                }&inviteLink=${window.location.pathname}`,
            );
            return;
        } else if (
            user?.email !==
            (
                inviteDetails?.organizationInviteDetails as OrganizationInviteDetails
            )?.email
        ) {
            handleLogout();
            navigate(
                `/?email=${
                    (
                        inviteDetails?.organizationInviteDetails as OrganizationInviteDetails
                    ).email
                }&inviteLink=${window.location.pathname}`,
            );
            return;
        } else if (
            user?.email ===
            (
                inviteDetails?.organizationInviteDetails as OrganizationInviteDetails
            )?.email
        ) {
            const result = await joinOrganization({
                variables: {
                    input: {
                        inviteLink: window.location.pathname,
                    },
                },
            });

            const userWorkspace = omitTypename(
                result.data?.organizationJoin?.user as User,
            );

            createSession({
                organization: omitTypename(
                    result.data?.organizationJoin?.user
                        .organization as Organization,
                ),
                project: omitTypename(
                    result.data?.organizationJoin?.user.project as Project,
                ),
            });
            addWorkSpace(userWorkspace);
            return;
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
                <div className="m-auto w-1/2 space-y-4 rounded-md bg-intg-bg-4 p-8 text-center text-intg-text lg:w-1/2">
                    <div className="m-auto w-fit">
                        <AcronynmBox
                            size="md"
                            text={getAcronym(
                                inviteDetails?.organizationInviteDetails
                                    ?.organizationName
                                    ? inviteDetails?.organizationInviteDetails
                                          .organizationName
                                    : "",
                            )}
                        />
                    </div>
                    <p className="text-center text-3xl font-semibold text-white">
                        <span>
                            {
                                (
                                    inviteDetails?.organizationInviteDetails as OrganizationInviteDetails
                                )?.inviter
                            }{" "}
                            invited you to
                        </span>
                        <br />
                        <span>
                            {
                                (
                                    inviteDetails?.organizationInviteDetails as OrganizationInviteDetails
                                )?.organizationName
                            }
                        </span>
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
                        <b>
                            {
                                (
                                    inviteDetails?.organizationInviteDetails as OrganizationInviteDetails
                                )?.email
                            }
                        </b>
                    </p>
                    <div className="m-auto w-[80%]">
                        <Button
                            text={
                                user?.email ===
                                (
                                    inviteDetails?.organizationInviteDetails as OrganizationInviteDetails
                                )?.email
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
