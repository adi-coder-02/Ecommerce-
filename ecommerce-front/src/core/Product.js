import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { read, listRelated } from './apiCore';
import Card from './Card';

const Product = ({ match }) => {
    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [error, setError] = useState('');

    const loadSingleProduct = productId => {
        read(productId).then(data => {
            if (data.error) {
                setError('Error loading product.');
            } else {
                setProduct(data);
                // fetch related products
                listRelated(data._id).then(data => {
                    if (data.error) {
                        setError('Error loading related products.');
                    } else {
                        setRelatedProduct(data);
                    }
                });
            }
        });
    };

    useEffect(() => {
        const { productId } = match.params; // Destructuring from match
        loadSingleProduct(productId);
    }, [match]);

    return (
        <Layout
            title={product && product.name}
            description={product && product.description && product.description.substring(0, 100)}
            className="container-fluid"
        >
            {error && <div className="alert alert-danger">{error}</div>} {/* Error message */}

            <div className="row">
                <div className="col-8">
                    {product && product.description && (
                        <Card product={product} showViewProductButton={false} />
                    )}
                </div>

                <div className="col-4">
                    <h4>Related products</h4>
                    {relatedProduct.length > 0 ? (
                        relatedProduct.map((p) => (
                            <div className="mb-3" key={p._id}>
                                <Card product={p} />
                            </div>
                        ))
                    ) : (
                        <p>No related products found.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Product;
