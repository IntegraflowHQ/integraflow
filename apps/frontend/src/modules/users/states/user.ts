import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DeepPartial, mergeDeep } from "@apollo/client/utilities";

import { User } from "@/generated/graphql";
import { userCache } from "@/utils/cache";

export type UserState = DeepPartial<User>;

export type UserActions = {
    updateUser: (user: UserState) => void;
    reset: () => void;
};

const initialState: UserState = {};

export const useUserStore = create<UserState & UserActions>()(
    persist(
        (set) => ({
            ...initialState,
            updateUser: (data) => set(data),
            reset: () => set(initialState),
        }),
        {
            name: "user-cache",
            storage: createJSONStorage(() => userCache),
            partialize: (state): UserState => ({
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
    ),
);

