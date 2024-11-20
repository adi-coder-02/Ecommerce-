import React, { useState, useEffect, useCallback } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";
import moment from "moment";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [statusValues, setStatusValues] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { user, token } = isAuthenticated();

    // Memoize loadOrders with useCallback
    const loadOrders = useCallback(() => {
        setLoading(true);
        setError(null);
        listOrders(user._id, token).then((data) => {
            if (data.error) {
                setError("Error loading orders.");
            } else {
                setOrders(data);
            }
            setLoading(false);
        });
    }, [user._id, token]); // Add user._id and token as dependencies

    // Memoize loadStatusValues with useCallback
    const loadStatusValues = useCallback(() => {
        getStatusValues(user._id, token).then((data) => {
            if (data.error) {
                setError("Error loading status values.");
            } else {
                setStatusValues(data);
            }
        });
    }, [user._id, token]); // Add user._id and token as dependencies

    useEffect(() => {
        loadOrders();
        loadStatusValues();
    }, [loadOrders, loadStatusValues]); // Use memoized functions as dependencies

    const showOrdersLength = () => {
        if (orders.length > 0) {
            return (
                <h1 className="text-danger display-2">
                    Total orders: {orders.length}
                </h1>
            );
        } else {
            return <h1 className="text-danger">No orders</h1>;
        }
    };

    const showInput = (key, value) => (
        <div className="input-group mb-2 mr-sm-2">
            <div className="input-group-prepend">
                <div className="input-group-text">{key}</div>
            </div>
            <input
                type="text"
                value={value}
                className="form-control"
                readOnly
            />
        </div>
    );

    const handleStatusChange = (e, orderId) => {
        const updatedOrders = orders.map(order =>
            order._id === orderId
                ? { ...order, status: e.target.value }
                : order
        );
        setOrders(updatedOrders);

        updateOrderStatus(user._id, token, orderId, e.target.value).then(
            (data) => {
                if (data.error) {
                    console.log("Status update failed");
                }
            }
        );
    };

    const showStatus = (o) => (
        <div className="form-group">
            <h3 className="mark mb-4">Status: {o.status}</h3>
            <select
                className="form-control"
                value={o.status}
                onChange={(e) => handleStatusChange(e, o._id)}
            >
                <option>Update Status</option>
                {statusValues.map((status, index) => (
                    <option key={index} value={status}>
                        {status}
                    </option>
                ))}
            </select>
        </div>
    );

    const showLoading = () => {
        if (loading) {
            return <div className="alert alert-info">Loading...</div>;
        }
    };

    const showError = () => {
        if (error) {
            return <div className="alert alert-danger">{error}</div>;
        }
    };

    return (
        <Layout
            title="Orders"
            description={`G'day ${user.name}, you can manage all the orders here`}
            className="container-fluid"
        >
            {showLoading()}
            {showError()}
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showOrdersLength()}

                    {orders.map((o, oIndex) => {
                        return (
                            <div
                                className="mt-5"
                                key={oIndex}
                                style={{ borderBottom: "5px solid indigo" }}
                            >
                                <h2 className="mb-5">
                                    <span className="bg-primary">
                                        Order ID: {o._id}
                                    </span>
                                </h2>

                                <ul className="list-group mb-2">
                                    <li className="list-group-item">
                                        {showStatus(o)}
                                    </li>
                                    <li className="list-group-item">
                                        Transaction ID: {o.transaction_id}
                                    </li>
                                    <li className="list-group-item">
                                        Amount: ${o.amount}
                                    </li>
                                    <li className="list-group-item">
                                        Ordered by: {o.user.name}
                                    </li>
                                    <li className="list-group-item">
                                        Ordered on:{" "}
                                        {moment(o.createdAt).fromNow()}
                                    </li>
                                    <li className="list-group-item">
                                        Delivery address: {o.address}
                                    </li>
                                </ul>

                                <h3 className="mt-4 mb-4 font-italic">
                                    Total products in the order:{" "}
                                    {o.products.length}
                                </h3>

                                {o.products.map((p, pIndex) => (
                                    <div
                                        className="mb-4"
                                        key={pIndex}
                                        style={{
                                            padding: "20px",
                                            border: "1px solid indigo",
                                        }}
                                    >
                                        {showInput("Product name", p.name)}
                                        {showInput("Product price", p.price)}
                                        {showInput("Product total", p.count)}
                                        {showInput("Product Id", p._id)}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
};

export default Orders;
