import React from "react";
import Menu from "./Menu";
import "../styles.css";

const Layout = ({
    title = "Title",
    description = "Description",
    className = "", // Default to an empty string if no className is passed
    children
}) => (
    <div>
        <Menu />
        <div className="jumbotron">
            <h2>{title}</h2>
            <p className="lead">{description}</p>
        </div>
        {/* Apply className dynamically, ensuring it's never undefined */}
        <div className={className ? className : ""}>{children}</div>
    </div>
);

export default Layout;
