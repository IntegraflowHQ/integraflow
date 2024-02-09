import { DeepPartial } from "@apollo/client/utilities";
import { useCallback, useEffect, useMemo } from "react";

import { User, useUserUpdateMutation, useViewerLazyQuery } from "@/generated/graphql";
import { useAuth } from "@/modules/auth/hooks/useAuth";

import { convertToAuthOrganization, useUserStore } from "../states/user";

export const useCurrentUser = () => {
    const { isAuthenticated } = useAuth();
    const { updateUser: updateUserCache, reset, hydrated, ...user } = useUserStore();

    const [getUser, { loading }] = useViewerLazyQuery({
        onCompleted: ({ viewer }) => {
            if (viewer) {
                const organization = viewer.organizations?.edges.find(({ node }) => node.id === user.organization?.id)?.node;
                const project = organization?.projects?.edges.find(({ node }) => node.id === user.project?.id)?.node;

                updateUserCache({
                    ...viewer,
                    organization: convertToAuthOrganization(organization),
                    project
                });
            }
        }
    });
    const [updateUser] = useUserUpdateMutation();

    useEffect(() => {
        if (isAuthenticated && !hydrated) {
            getUser();
        }
    }, [getUser, hydrated, isAuthenticated]);

    const organizations = useMemo(() => {
        if (!user || !user.organizations?.edges) {
            return [];
        }

        return user.organizations.edges.map(edge => edge?.node);
    }, [user]);

    const handleUserUpdate = useCallback(async (updatedUser: DeepPartial<User>, cacheOnly = false) => {
        updateUserCache(updatedUser);

        if (!cacheOnly) {
            await updateUser({
                variables: {
                    input: {
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        isOnboarded: updatedUser.isOnboarded
                    }
                }
            });
        }
    }, [updateUser, updateUserCache]);

    return {
        loading,
        user,
        organizations,
        getUser,
        updateUser: handleUserUpdate,
        reset
    };
};
