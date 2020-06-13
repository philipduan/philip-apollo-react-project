import createAuth0Client from "@auth0/auth0-spa-js";
import React, { createContext, useContext, useEffect, useState } from "react";

import { GET_VIEWER } from "../graphql/queries";
import { createApolloClient } from "../graphql/apollo";
import history from "../routes/history";

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const initOptions = {
  audience: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  redirect_uri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
};

const AuthProvider = ({ children }) => {
  const [auth0Client, setAuth0Client] = useState();
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewerQuery, setViewerQuery] = useState(null);

  useEffect(() => {
    const initializeAuth0 = async () => {
      try {
        const client = await createAuth0Client(initOptions);
        setAuth0Client(client);

        if (
          window.location.search.includes("code=") &&
          window.location.search.includes("state=")
        ) {
          await client.handleRedirectCallback();
          history.replace("/home");
          // const { appState } = await client.handleRedirectCallback();
          // history.replace(
          //   appState && appState.targetUrl
          //     ? appState.targetUrl
          //     : window.location.pathname
          // );
        }

        const authenticated = await client.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (history.location.pathname === "/login" && authenticated) {
          history.replace("/home");
        } else if (history.location.pathname === "/login") {
          history.replace("/");
        } else if (authenticated) {
          const apolloClient = createApolloClient((...p) =>
            client.getTokenSilently(...p)
          );
          const viewer = await apolloClient.query({ query: GET_VIEWER });
          setViewerQuery(viewer);
          // if (history.location.pathname === "/login") history.replace("/home");
        }
      } catch {
        history.location.pathname !== "/" && history.replace("/");
      } finally {
        setCheckingSession(false);
      }
    };
    initializeAuth0();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        checkingSession,
        isAuthenticated,
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getToken: (...p) => auth0Client.getTokenSilently(...p),
        login: (...p) => auth0Client.loginWithRedirect(...p),
        logout: (...p) =>
          auth0Client.logout({
            ...p,
            returnTo: process.env.REACT_APP_AUTH0_LOGOUT_URL,
          }),
        updateViewer: (viewer) =>
          setViewerQuery({ ...viewerQuery, data: { viewer } }),
        viewerQuery,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
export default AuthContext;
