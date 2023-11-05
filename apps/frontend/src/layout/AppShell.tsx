import { ApolloProvider } from "@/modules/apollo/components/ApolloProvider";
import { Outlet } from "react-router-dom";

export default function AppShell() {
  return (
    <ApolloProvider>
      <Outlet />
    </ApolloProvider>
  );
}
