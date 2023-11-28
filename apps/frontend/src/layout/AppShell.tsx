import { ApolloProvider } from "@/modules/apollo/components/ApolloProvider";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

export default function AppShell() {
    return (
        <ApolloProvider>
            <Outlet />
            <Toaster position="bottom-right" />
        </ApolloProvider>
    );
}
