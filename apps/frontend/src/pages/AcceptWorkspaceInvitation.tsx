import {
    Organization,
    OrganizationInviteDetails,
    Project,
    User,
    useOrganizationInviteDetailsLazyQuery,
    useOrganizationJoinMutation,
} from "@/generated/graphql";
import useLogout from "@/modules/auth/hooks/useLogout";
import useSession from "@/modules/users/hooks/useSession";
import useUserState from "@/modules/users/hooks/useUserState";
import { Button, GlobalSpinner, Screen } from "@/ui";
import { AcronynmBox } from "@/ui/NavItem/AcronynmBox";
import { omitTypename } from "@/utils";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const AcceptWorkspaceInvitation = () => {
    const { inviteLink } = useParams();
    const { user, addWorkSpace } = useUserState();
    const { createSession } = useSession();

    const { handleLogout } = useLogout();

    const [joinOrganization, { loading }] = useOrganizationJoinMutation();

    const [fetchInviteDetails, { data: inviteDetails }] =
        useOrganizationInviteDetailsLazyQuery({
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
            // addWorkSpace(userWorkspace);
            // createSession({
            //     organization: omitTypename(
            //         result.data?.organizationJoin?.user
            //             .organization as Organization,
            //     ),
            //     project: omitTypename(
            //         result.data?.organizationJoin?.user.project as Project,
            //     ),
            // });
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

    if (loading) {
        return <GlobalSpinner />;
    }

    return (
        <Screen>
            <div className="flex h-[calc(100%-5rem)] w-full items-center justify-between border border-yellow-500">
                <div className="m-auto w-1/2 border  text-center text-intg-text">
                    {(
                        inviteDetails?.organizationInviteDetails as OrganizationInviteDetails
                    )?.expired ? (
                        <p>Invite expired</p>
                    ) : (
                        <>
                            <div className="m-auto w-fit border text-center">
                                <AcronynmBox text="" />
                            </div>
                            <p className="text-center text-3xl font-semibold">
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
                                Lorem ipsum dolor sit amet consectetur,
                                adipisicing elit. Nulla maiores facilis,
                                consequuntur error temporibus, veritatis.
                            </p>

                            <div className="py-4">
                                <hr className="" />
                            </div>
                            <p>
                                To accept the invitation, please login as
                                <br />
                                {
                                    (
                                        inviteDetails?.organizationInviteDetails as OrganizationInviteDetails
                                    )?.email
                                }
                            </p>

                            <div className="text-center">
                                <Button
                                    text={
                                        user?.email ===
                                        (
                                            inviteDetails?.organizationInviteDetails as OrganizationInviteDetails
                                        )?.email
                                            ? "Accept"
                                            : "Login"
                                    }
                                    className="w-[60%]"
                                    onClick={handleAcceptInvitation}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Screen>
    );
};
