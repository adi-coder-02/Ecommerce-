import React, { Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";

const isActive = (location, path) => {
    if (location.pathname === path) {
        return { color: "#ff9900" };
    } else {
        return { color: "#ffffff" };
    }
};

const Menu = () => {
    const location = useLocation();  // React Router v6 hook for location
    const navigate = useNavigate();  // React Router v6 hook for navigation

    return (
        <div>
            <ul className="nav nav-tabs bg-primary">
                <li className="nav-item">
                    <Link
                        className="nav-link"
                        style={isActive(location, "/")}
                        to="/"
                    >
                        Home
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        className="nav-link"
                        style={isActive(location, "/shop")}
                        to="/shop"
                    >
                        Shop
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        className="nav-link"
                        style={isActive(location, "/cart")}
                        to="/cart"
                    >
                        Cart{" "}
                        <sup>
                            <small className="cart-badge">{itemTotal()}</small>
                        </sup>
                    </Link>
                </li>

                {isAuthenticated() && isAuthenticated().user.role === 0 && (
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(location, "/user/dashboard")}
                            to="/user/dashboard"
                        >
                            Dashboard
                        </Link>
                    </li>
                )}

                {isAuthenticated() && isAuthenticated().user.role === 1 && (
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(location, "/admin/dashboard")}
                            to="/admin/dashboard"
                        >
                            Dashboard
                        </Link>
                    </li>
                )}

                {!isAuthenticated() && (
                    <Fragment>
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                style={isActive(location, "/signin")}
                                to="/signin"
                            >
                                Signin
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                style={isActive(location, "/signup")}
                                to="/signup"
                            >
                                Signup
                            </Link>
                        </li>
                    </Fragment>
                )}

                {isAuthenticated() && (
                    <li className="nav-item">
                        <span
                            className="nav-link"
                            style={{ cursor: "pointer", color: "#ffffff" }}
                            onClick={() =>
                                signout(() => {
                                    navigate("/");  // Use navigate() instead of history.push()
                                })
                            }
                        >
                            Signout
                        </span>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Menu;
