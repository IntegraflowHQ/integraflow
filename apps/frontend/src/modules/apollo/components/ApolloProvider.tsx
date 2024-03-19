import { ApolloProvider as ApolloProviderBase } from "@apollo/client";

import { useApolloFactory } from "@/modules/apollo/hooks/useApolloFactory";
import { GlobalSpinner } from "@/ui";

export const ApolloProvider = ({ children }: React.PropsWithChildren) => {
    const apolloClient = useApolloFactory();

    if (!apolloClient) {
        return <GlobalSpinner />;
    }

    return <ApolloProviderBase client={apolloClient}>{children}</ApolloProviderBase>;
};
