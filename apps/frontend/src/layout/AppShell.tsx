import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

import { ApolloProvider } from "@/modules/apollo/components/ApolloProvider";
import { AuthProvider } from "@/modules/auth/AuthProvider";

export default function AppShell() {
    return (
        <AuthProvider>
            <ApolloProvider>
                <Outlet />
                <Toaster position="bottom-right" />
            </ApolloProvider>
        </AuthProvider>
    );
}
