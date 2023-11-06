import { createSelectors } from '@/utils/selectors';
import { useAuthTokenStore } from '../states/authToken';

export const useLogin = () => {
    const authToken = createSelectors(useAuthTokenStore);
    const login = authToken.use.login();
    return login;
};
