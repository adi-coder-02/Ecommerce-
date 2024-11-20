import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getProducts } from './apiCore';
import Card from './Card';
import Search from './Search';

const Home = () => {
    const [productsBySell, setProductsBySell] = useState([]);
    const [productsByArrival, setProductsByArrival] = useState([]);
    const [error, setError] = useState('');

    // Load products by best sellers
    const loadProductsBySell = () => {
        getProducts('sold').then(data => {
            if (data.error) {
                setError('Error loading best-selling products');
            } else {
                setProductsBySell(data);
            }
        });
    };

    // Load products by new arrivals
    const loadProductsByArrival = () => {
        getProducts('createdAt').then(data => {
            if (data.error) {
                setError('Error loading new arrivals');
            } else {
                setProductsByArrival(data);
            }
        });
    };

    useEffect(() => {
        loadProductsByArrival();
        loadProductsBySell();
    }, []);

    return (
        <Layout
            title="FullStack React Node MongoDB Ecommerce App"
            description="Node React E-commerce App"
            className="container-fluid"
        >
            <Search />
            
            {error && <div className="alert alert-danger">{error}</div>}

            <h2 className="mb-4">New Arrivals</h2>
            <div className="row">
                {productsByArrival.map((product) => (
                    <div key={product._id} className="col-md-4 mb-3">
                        <Card product={product} />
                    </div>
                ))}
            </div>

            <h2 className="mb-4">Best Sellers</h2>
            <div className="row">
                {productsBySell.map((product) => (
                    <div key={product._id} className="col-md-4 mb-3">
                        <Card product={product} />
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default Home;
