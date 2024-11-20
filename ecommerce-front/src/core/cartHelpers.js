export const addItem = (item = [], count = 0, next = f => f) => {
    let cart = [];
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }

        // Add new item with count
        cart.push({
            ...item,
            count: count || 1
        });

        // Remove duplicates by unique product _id
        cart = Array.from(new Set(cart.map(p => p._id))).map(id => {
            return cart.find(p => p._id === id);
        });

        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        next();
    }
};

export const itemTotal = () => {
    if (typeof window !== 'undefined') {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        return cart.length;
    }
    return 0;
};

export const getCart = () => {
    if (typeof window !== 'undefined') {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        return cart;
    }
    return [];
};

export const updateItem = (productId, count) => {
    let cart = [];
    if (typeof window !== 'undefined') {
        cart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Use forEach to modify the cart array in-place
        cart.forEach((product, i) => {
            if (product._id === productId) {
                cart[i].count = count;  // Update the count of the product
            }
        });

        // Update the cart in localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
};

export const removeItem = productId => {
    let cart = [];
    if (typeof window !== 'undefined') {
        cart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Remove product by _id
        cart = cart.filter(product => product._id !== productId);

        // Update the cart in localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    return cart;
};

export const emptyCart = next => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
        next();
    }
};
