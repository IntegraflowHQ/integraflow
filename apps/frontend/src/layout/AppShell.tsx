import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

import { useApolloFactory } from "@/modules/apollo/hooks/useApolloFactory";
import { AuthProvider } from "@/modules/auth/AuthProvider";
import { GlobalSpinner } from "@/ui";
import { ApolloProvider } from "@apollo/client";

export default function AppShell() {
    const apolloClient = useApolloFactory();

    if (!apolloClient) {
        return <GlobalSpinner />;
    }
    return (
        <ApolloProvider client={apolloClient.getClient()}>
            <AuthProvider apollo={apolloClient}>
                <Outlet />
                <Toaster position="bottom-right" />
            </AuthProvider>
        </ApolloProvider>
    );
}
