import { create } from "zustand";
import { createJSONStorage, persist, devtools } from "zustand/middleware";
import { DeepPartial, mergeDeep } from "@apollo/client/utilities";

import { AuthOrganization, Organization, User } from "@/generated/graphql";
import { userCache } from "@/utils/cache";

export type UserState = DeepPartial<User> & {
    hydrated?: boolean;
};

export type UserActions = {
    updateUser: (user: DeepPartial<User>) => void;
    reset: () => void;
};

export const convertToAuthOrganization = (organization?:  DeepPartial<Organization>): DeepPartial<AuthOrganization> => ({
    __typename: "AuthOrganization",
    id: organization?.id,
    slug: organization?.slug,
    name: organization?.name,
    memberCount: organization?.memberCount
});

const initialState: UserState = {
    hydrated: false
};

export const useUserStore = create<UserState & UserActions>()(
    devtools(
        persist(
            set => ({
                ...initialState,
                updateUser: (user) => set({ ...user, hydrated: true }),
                reset: () => set(initialState),
            }),
            {
                name: "user-cache",
                storage: createJSONStorage(() => userCache),
                partialize: (state) => ({
                    id: state.id,
                    isOnboarded: state.isOnboarded,
                    project: state.project ? {
                        id: state.project.id,
                        slug: state.project.slug,
                        hasCompletedOnboardingFor: state.project.hasCompletedOnboardingFor
                    } : undefined,
                    organization: state.organization ? {
                        id: state.organization.id,
                        slug: state.organization.slug
                    } : undefined
                }),
                merge: (persistedState, currentState) => mergeDeep(currentState, persistedState),
            },
        )
    ),
);
