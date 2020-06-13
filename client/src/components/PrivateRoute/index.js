import { Redirect, Route } from "react-router-dom";
import React, { useEffect } from "react";

import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

const PrivateRoute = ({ component: Component, path, render, ...rest }) => {
  const {
    checkingSession,
    isAuthenticated,
    loginWithRedirect,
    viewerQuery,
  } = useAuth();

  useEffect(() => {
    if (checkingSession || isAuthenticated) {
      return;
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: path },
      });
    };
    fn();
  }, [checkingSession, isAuthenticated, loginWithRedirect, path]);

  const renderRoute = (props) => {
    let content = null;
    let viewer;

    if (viewerQuery && viewerQuery.data) {
      viewer = viewerQuery.data.viewer;
    }

    if (checkingSession) {
      content = <Loader centered />;
    } else if (
      isAuthenticated &&
      props.location.pathname !== "/settings/profile" &&
      viewer &&
      !viewer.profile
    ) {
      content = <Redirect to="/settings/profile" />;
    } else if (isAuthenticated && render && viewer) {
      content = render(props);
    } else if (isAuthenticated && viewer) {
      content = <Component {...props} />;
    } else if (!viewerQuery || !viewer) {
      content = <Redirect to="/" />;
    }

    return content;
  };

  return <Route {...rest} render={renderRoute} />;
};

export default PrivateRoute;
