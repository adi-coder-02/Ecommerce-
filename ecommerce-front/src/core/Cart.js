import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import { getCart } from './cartHelpers';
import Card from './Card';
import Checkout from './Checkout';

const Cart = () => {
    const [items, setItems] = useState([]);  // Cart items state
    const [run, setRun] = useState(false);   // Flag to trigger re-render when cart changes

    // UseEffect hook to load cart items when the component mounts or when `run` is updated
    useEffect(() => {
        const cartItems = getCart();  // Retrieve cart items
        setItems(cartItems);          // Set cart items to state
    }, [run]);  // Dependency array: re-run when `run` changes

    // Display cart items
    const showItems = items => {
        return (
            <div>
                <h2>Your cart has {`${items.length}`} items</h2>
                <hr />
                {items.map((product, i) => (
                    <Card
                        key={i}
                        product={product}
                        showAddToCartButton={false}
                        cartUpdate={true}
                        showRemoveProductButton={true}
                        setRun={setRun}  // Update cart when item is removed or quantity is changed
                        run={run}         // Trigger re-render
                    />
                ))}
            </div>
        );
    };

    // Message when the cart is empty
    const noItemsMessage = () => (
        <h2>
            Your cart is empty. <br /> <Link to="/shop">Continue shopping</Link>
        </h2>
    );

    return (
        <Layout
            title="Shopping Cart"
            description="Manage your cart items. Add, remove, checkout, or continue shopping."
            className="container-fluid"
        >
            <div className="row">
                <div className="col-6">
                    {items.length > 0 ? showItems(items) : noItemsMessage()}  {/* Show items or empty cart message */}
                </div>

                <div className="col-6">
                    <h2 className="mb-4">Your cart summary</h2>
                    <hr />
                    <Checkout products={items} setRun={setRun} run={run} />
                </div>
            </div>
        </Layout>
    );
};

export default Cart;
