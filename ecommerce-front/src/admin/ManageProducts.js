import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "./apiAdmin";

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user, token } = isAuthenticated();

    const loadProducts = () => {
        setLoading(true);
        setError(null);
        getProducts()
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setProducts(data);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load products");
                setLoading(false);
            });
    };

    const destroy = (productId) => {
        // Optimistically update the UI by removing the deleted product
        const updatedProducts = products.filter((product) => product._id !== productId);
        setProducts(updatedProducts);

        deleteProduct(productId, user._id, token)
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                    // Revert the UI update in case of error
                    setProducts((prevProducts) => [...prevProducts]);
                } else {
                    loadProducts(); // Refresh product list
                }
            })
            .catch((err) => {
                setError("Failed to delete product");
                setProducts(updatedProducts); // Revert the UI update in case of error
            });
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const showError = () => {
        if (error) {
            return <div className="alert alert-danger">{error}</div>;
        }
    };

    const showLoading = () => {
        if (loading) {
            return <div className="alert alert-info">Loading...</div>;
        }
    };

    return (
        <Layout
            title="Manage Products"
            description="Perform CRUD on products"
            className="container-fluid"
        >
            {showLoading()}
            {showError()}
            <div className="row">
                <div className="col-12">
                    <h2 className="text-center">
                        Total {products.length} products
                    </h2>
                    <hr />
                    <ul className="list-group">
                        {products.map((p, i) => (
                            <li
                                key={i}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <strong>{p.name}</strong>
                                <Link to={`/admin/product/update/${p._id}`}>
                                    <span className="badge badge-warning badge-pill">
                                        Update
                                    </span>
                                </Link>
                                <span
                                    onClick={() => destroy(p._id)}
                                    className="badge badge-danger badge-pill"
                                >
                                    Delete
                                </span>
                            </li>
                        ))}
                    </ul>
                    <br />
                </div>
            </div>
        </Layout>
    );
};

export default ManageProducts;
