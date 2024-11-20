import React from "react";
import { Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "./index";

const AdminRoute = ({ component: Component, ...rest }) => {
    const auth = isAuthenticated();
    
    return (
        <Route
            {...rest}
            render={props =>
                auth && auth.user && auth.user.role === 1 ? (
                    <Component {...props} />
                ) : (
                    <Navigate
                        to={{
                            pathname: "/signin",
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
};

export default AdminRoute;
