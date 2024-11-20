import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getPurchaseHistory } from "./apiUser";
import moment from "moment";

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    
    const { user: { _id, name, email, role } } = isAuthenticated();
    const token = isAuthenticated().token;

    const init = (userId, token) => {
        getPurchaseHistory(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setHistory(data);
            }
        });
    };

    useEffect(() => {
        init(_id, token);
    }, [_id, token]);

    const userLinks = () => (
        <div className="card">
            <h4 className="card-header">User Links</h4>
            <ul className="list-group">
                <li className="list-group-item">
                    <Link className="nav-link" to="/cart">
                        My Cart
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link className="nav-link" to={`/profile/${_id}`}>
                        Update Profile
                    </Link>
                </li>
            </ul>
        </div>
    );

    const userInfo = () => (
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

    const purchaseHistory = history => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">Purchase History</h3>
                {history.length === 0 ? (
                    <div className="alert alert-info">No purchases yet!</div>
                ) : (
                    <ul className="list-group">
                        {history.map((h, i) => (
                            <div key={i}>
                                <hr />
                                <h5>Order {i + 1}:</h5>
                                {h.products.map((p, i) => (
                                    <li key={i} className="list-group-item">
                                        <h6>Product name: {p.name}</h6>
                                        <h6>Product price: ${p.price}</h6>
                                        <h6>
                                            Purchased on: {moment(p.createdAt).fromNow()}
                                        </h6>
                                    </li>
                                ))}
                            </div>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    return (
        <Layout
            title="Dashboard"
            description={`G'day ${name}!`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-3">{userLinks()}</div>
                <div className="col-9">
                    {userInfo()}
                    {purchaseHistory(history)}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
