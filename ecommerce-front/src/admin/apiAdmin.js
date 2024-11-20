import { API } from '../config';

// Create a category
export const createCategory = async (userId, token, category) => {
    try {
        const response = await fetch(`${API}/category/create/${userId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(category)
        });

        return response.json();
    } catch (err) {
        console.log(err);
        throw new Error('Failed to create category');
    }
};

// Update a category
export const updateCategory = async (categoryId, userId, token, category) => {
    try {
        const response = await fetch(`${API}/category/${categoryId}/${userId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(category)
        });

        return response.json();
    } catch (err) {
        console.log(err);
        throw new Error('Failed to update category');
    }
};

// Create a product
export const createProduct = async (userId, token, product) => {
    try {
        const response = await fetch(`${API}/product/create/${userId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: product // formData should be used here
        });

        return response.json();
    } catch (err) {
        console.log(err);
        throw new Error('Failed to create product');
    }
};

// Get a single category
export const getCategory = async (categoryId) => {
    try {
        const response = await fetch(`${API}/category/${categoryId}`, {
            method: 'GET'
        });

        return response.json();
    } catch (err) {
        console.log(err);
        throw new Error('Failed to get category');
    }
};

// Get all categories
export const getCategories = async () => {
    try {
        const response = await fetch(`${API}/categories`, {
            method: 'GET'
        });

        return response.json();
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch categories');
    }
};

// List orders for a user
export const listOrders = async (userId, token) => {
    try {
        const response = await fetch(`${API}/order/list/${userId}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        return response.json();
    } catch (err) {
        console.log(err);
        throw new Error('Failed to list orders');
    }
};

// Get status values for orders
export const getStatusValues = async (userId, token) => {
    try {
        const response = await fetch(`${API}/order/status-values/${userId}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        return response.json();
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch order status values');
    }
};

// Update the status of an order
export const updateOrderStatus = async (userId, token, orderId, status) => {
    try {
        const response = await fetch(`${API}/order/${orderId}/status/${userId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status, orderId })
        });

        return response.json();
    } catch (err) {
        console.log(err);
        throw new Error('Failed to update order status');
    }
};

// Get all products
export const getProducts = async () => {
    try {
        const response = await fetch(`${API}/products`, {
            method: 'GET'
        });

        return response.json();
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch products');
    }
};

// Delete a product
export const deleteProduct = async (productId, userId, token) => {
    try {
        const response = await fetch(`${API}/product/${productId}/${userId}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        return response.json();
    } catch (err) {
        console.log(err);
        throw new Error('Failed to delete product');
    }
};

// Get a single product
export const getProduct = async (productId) => {
    try {
        const response = await fetch(`${API}/product/${productId}`, {
            method: 'GET'
        });

        return response.json();
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch product');
    }
};

// Update a product
export const updateProduct = async (productId, userId, token, product) => {
    try {
        const response = await fetch(`${API}/product/${productId}/${userId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: product // formData for product update
        });

        return response.json();
    } catch (err) {
        console.log(err);
        throw new Error('Failed to update product');
    }
};
