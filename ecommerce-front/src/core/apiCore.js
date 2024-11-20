import { API } from "../config";
import queryString from "query-string";

// Fetch products based on sort order (by 'sold' or 'createdAt')
export const getProducts = sortBy => {
    return fetch(`${API}/products?sortBy=${sortBy}&order=desc&limit=6`, {
        method: "GET"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error:", err);
            throw err; // re-throw to allow error handling in the calling code
        });
};

// Fetch all categories
export const getCategories = () => {
    return fetch(`${API}/categories`, {
        method: "GET"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error:", err);
            throw err;
        });
};

// Fetch filtered products based on given filters (e.g., category, price)
export const getFilteredProducts = (skip, limit, filters = {}) => {
    const data = { limit, skip, filters };
    return fetch(`${API}/products/by/search`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch filtered products");
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error:", err);
            throw err;
        });
};

// List products based on query parameters (e.g., search by keyword)
export const list = params => {
    const query = queryString.stringify(params);
    return fetch(`${API}/products/search?${query}`, {
        method: "GET"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch product list");
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error:", err);
            throw err;
        });
};

// Read a single product by productId
export const read = productId => {
    return fetch(`${API}/product/${productId}`, {
        method: "GET"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch product details");
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error:", err);
            throw err;
        });
};

// List related products based on a given productId
export const listRelated = productId => {
    return fetch(`${API}/products/related/${productId}`, {
        method: "GET"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch related products");
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error:", err);
            throw err;
        });
};

// Get Braintree client token for payment gateway
export const getBraintreeClientToken = (userId, token) => {
    return fetch(`${API}/braintree/getToken/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch Braintree client token");
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error:", err);
            throw err;
        });
};

// Process payment using Braintree payment gateway
export const processPayment = (userId, token, paymentData) => {
    return fetch(`${API}/braintree/payment/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to process payment");
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error:", err);
            throw err;
        });
};

// Create an order for the user
export const createOrder = (userId, token, createOrderData) => {
    return fetch(`${API}/order/create/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ order: createOrderData })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to create order");
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error:", err);
            throw err;
        });
};
