import React, { useState, useEffect } from 'react';
import { getBraintreeClientToken, processPayment, createOrder } from './apiCore';
import { emptyCart } from './cartHelpers';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react';

const Checkout = ({ products, setRun = f => f, run = undefined }) => {
    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: ''
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    // Fetching client token
    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token).then(response => {
            if (response.error) {
                console.log(response.error);
                setData(prevData => ({ ...prevData, error: response.error }));
            } else {
                setData(prevData => ({ ...prevData, clientToken: response.clientToken }));
            }
        });
    };

    useEffect(() => {
        if (userId && token) {
            getToken(userId, token);
        }
    }, [userId, token]);

    const handleAddress = event => {
        setData(prevData => ({ ...prevData, address: event.target.value }));
    };

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };

    const showCheckout = () => {
        return isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
            <Link to="/signin">
                <button className="btn btn-primary">Sign in to checkout</button>
            </Link>
        );
    };

    let deliveryAddress = data.address;

    const buy = () => {
        setData(prevData => ({ ...prevData, loading: true }));
        
        let nonce;
        data.instance
            .requestPaymentMethod()
            .then(response => {
                nonce = response.nonce;
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal()
                };

                processPayment(userId, token, paymentData)
                    .then(response => {
                        const createOrderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: deliveryAddress
                        };

                        createOrder(userId, token, createOrderData)
                            .then(response => {
                                emptyCart(() => {
                                    setRun(!run); // Run useEffect in parent Cart
                                    setData({
                                        loading: false,
                                        success: true
                                    });
                                });
                            })
                            .catch(error => {
                                console.log(error);
                                setData(prevData => ({ ...prevData, loading: false }));
                            });
                    })
                    .catch(error => {
                        console.log(error);
                        setData(prevData => ({ ...prevData, loading: false }));
                    });
            })
            .catch(error => {
                setData(prevData => ({ ...prevData, error: error.message, loading: false }));
            });
    };

    const showDropIn = () => (
        <div onBlur={() => setData(prevData => ({ ...prevData, error: '' }))}>
            {data.clientToken !== null && products.length > 0 ? (
                <div>
                    <div className="form-group mb-3">
                        <label className="text-muted">Delivery address:</label>
                        <textarea
                            onChange={handleAddress}
                            className="form-control"
                            value={data.address}
                            placeholder="Type your delivery address here..."
                        />
                    </div>

                    <DropIn
                        options={{
                            authorization: data.clientToken,
                            paypal: {
                                flow: 'vault'
                            }
                        }}
                        onInstance={instance => setData(prevData => ({ ...prevData, instance }))}
                    />
                    <button onClick={buy} className="btn btn-success btn-block">
                        Pay
                    </button>
                </div>
            ) : null}
        </div>
    );

    const showError = error => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = success => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            Thanks! Your payment was successful!
        </div>
    );

    const showLoading = loading => loading && <h2 className="text-danger">Loading...</h2>;

    return (
        <div>
            <h2>Total: ${getTotal()}</h2>
            {showLoading(data.loading)}
            {showSuccess(data.success)}
            {showError(data.error)}
            {showCheckout()}
        </div>
    );
};

export default Checkout;
