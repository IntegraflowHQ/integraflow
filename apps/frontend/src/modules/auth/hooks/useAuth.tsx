import { useContext } from "react";

import { AuthContext, AuthContextValue } from "../AuthProvider";

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === null) {
        throw new Error('Auth context is missing, did you forget to wrap your app in AuthProvider?')
    }

    return context as AuthContextValue;
};
