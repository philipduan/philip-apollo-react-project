import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/link-context";
import React from "react";

import { useAuth } from "../context/AuthContext";
import typePolicies from "./typePolicies";

const cache = new InMemoryCache({ typePolicies });

const createApolloClient = (getToken) => {
  const httpLink = new createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });
  const authLink = setContext(async (request, { headers }) => {
    const accessToken = await getToken();
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };
  });
  return new ApolloClient({
    cache,
    link: authLink.concat(httpLink),
  });
};

const ApolloProviderWithAuth = ({ children }) => {
  const { getToken } = useAuth();
  const client = createApolloClient(getToken);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export { createApolloClient };
export default ApolloProviderWithAuth;
