import { createSelectors } from "@/utils/selectors";
import { useAuthTokenStore } from "../states/authToken";

export const useAuthToken = () => {
    const authToken = createSelectors(useAuthTokenStore);
    const token = authToken.use.token();
    const refreshToken = authToken.use.refreshToken();
    const csrfToken = authToken.use.csrfToken();
    const login = authToken.use.login();
    const refresh = authToken.use.refresh();
    const logout = authToken.use.logout();

    return { token, refreshToken, csrfToken, login, refresh, logout };
};
