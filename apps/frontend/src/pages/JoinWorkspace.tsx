import {
    Organization,
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
import { omitTypename } from "@/utils";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const JoinWorkspace = () => {
    const { inviteLink } = useParams();
    const { createSession } = useSession();
    const { addWorkSpace } = useUserState();
    const { token } = useAuthToken();
    const navigate = useNavigate();

    const [joinOrganization, { loading }] = useOrganizationJoinMutation();

    const [fetchInviteDetails, { data }] =
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

    if (loading) {
        return <GlobalSpinner />;
    }

    return (
        <Screen>
            <div className="flex h-[calc(100%-5rem)] w-full items-center justify-between border border-yellow-500">
                <div className="m-auto w-1/2 border  text-center text-intg-text">
                    <div className="m-auto w-fit text-center">
                        <AcronynmBox
                            size="md"
                            text={
                                data
                                    ? (data?.organizationInviteDetails
                                          ?.organizationName as string)
                                    : ""
                            }
                        />
                    </div>
                    <p className="text-center text-3xl font-semibold">
                        <span>You have been invited you to</span>
                        <br />
                        {data?.organizationInviteDetails?.organizationName}
                    </p>

                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Nulla maiores facilis, consequuntur error
                        temporibus, veritatis.
                    </p>

                    <div className="py-4">
                        <hr className="" />
                    </div>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Nulla maiores facilis
                        <br />
                    </p>
                    <div className="text-center">
                        <Button
                            className="w-[60%]"
                            onClick={handleJoinOrganization}
                            text={token ? "Accept" : "Login"}
                        />
                    </div>
                </div>
            </div>
        </Screen>
    );
};
