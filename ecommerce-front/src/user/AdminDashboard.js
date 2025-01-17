import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const { user } = isAuthenticated();

    // Check if the user is authenticated
    if (!user) {
        return (
            <Layout
                title="Dashboard"
                description="Please log in to access the dashboard."
                className="container-fluid"
            >
                <h2>Please log in to access the dashboard.</h2>
            </Layout>
        );
    }

    const { name, email, role } = user;

    const adminLinks = () => (
        <div className="card">
            <h4 className="card-header">Admin Links</h4>
            <ul className="list-group">
                <li className="list-group-item">
                    <Link className="nav-link" to="/create/category">
                        Create Category
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link className="nav-link" to="/create/product">
                        Create Product
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link className="nav-link" to="/admin/orders">
                        View Orders
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link className="nav-link" to="/admin/products">
                        Manage Products
                    </Link>
                </li>
            </ul>
        </div>
    );

    const adminInfo = () => (
        <div className="card mb-5">
            <h3 className="card-header">User Information</h3>
            <ul className="list-group">
                <li className="list-group-item">{name}</li>
                <li className="list-group-item">{email}</li>
                <li className="list-group-item">
                    {role === 1 ? "Admin" : "Registered User"}
                </li>
            </ul>
        </div>
    );

    return (
        <Layout
            title="Dashboard"
            description={`Hello ${name}, welcome to your dashboard!`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-3">{adminLinks()}</div>
                <div className="col-9">{adminInfo()}</div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
