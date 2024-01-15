import { DeepOmit, DeepPartial } from "@apollo/client/utilities";
import { useCallback, useEffect, useMemo } from "react";

import { Organization, User, useUserUpdateMutation, useViewerLazyQuery } from "@/generated/graphql";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { omitTypename } from "@/utils";

import { useUserStore } from "../states/user";

export const useCurrentUser = () => {
    const { isAuthenticated } = useAuth();
    const { updateUser: updateUserCache, reset, ...user } = useUserStore();

    const [getUser, { loading }] = useViewerLazyQuery({
        onCompleted: ({ viewer }) => {
            if (viewer) {

                updateUserCache(omitTypename({
                    ...viewer,
                    project: {
                        ...viewer.project,
                        ...(user.project ?? {})
                    },
                    organization: {
                        ...viewer.organization,
                        ...(user.organization ?? {})
                    }
                }));
            }
        }
    });
    const [updateUser] = useUserUpdateMutation();

    useEffect(() => {
        if (isAuthenticated) {
            getUser();
        }
    }, [getUser, isAuthenticated]);

    const organizations = useMemo(() => {
        if (!user || !user.organizations?.edges) {
            return [];
        }

        return user.organizations.edges.map(
            edge => omitTypename(edge!.node)
        ) as DeepOmit<Organization, "__typename">[];
    }, [user]);

    const handleUserUpdate = useCallback(async (user: DeepPartial<User>, cacheOnly = false) => {
        updateUserCache(omitTypename(user));

        if (!cacheOnly) {
            await updateUser({
                variables: {
                    input: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        isOnboarded: user.isOnboarded
                    }
                }
            });
        }
    }, [updateUser, updateUserCache]);

    return {
        loading: loading && !user,
        user,
        organizations,
        getUser,
        updateUser: handleUserUpdate,
        reset
    };
};
