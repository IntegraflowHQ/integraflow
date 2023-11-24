import { User } from "@/generated/graphql";
import { DeepOmit } from "@apollo/client/utilities";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserState = {
    user: DeepOmit<User, "__typename"> | null;
    lastUpdate: number;
};

export type UserActions = {
    deleteUser: () => void;
    updateUser: (data: DeepOmit<User, "__typename">) => void;
};

const initialState: UserState = {
    user: null,
    lastUpdate: Date.now(),
};

export const useUserStore = create<UserState & UserActions>()(
    persist(
        (set) => ({
            ...initialState,
            deleteUser: () => set(initialState),
            updateUser: (data) =>
                set({
                    user: {
                        ...data,
                    },
                    lastUpdate: Date.now(),
                }),
        }),
        {
            name: "authUser",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
