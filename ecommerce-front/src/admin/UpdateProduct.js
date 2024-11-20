import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Navigate } from 'react-router-dom';
import { getProduct, getCategories, updateProduct } from './apiAdmin';

const UpdateProduct = ({ match }) => {
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        quantity: '',
        loading: false,
        error: false,
        createdProduct: '',
        redirectToProfile: false,
        formData: new FormData(),
    });

    const [categories, setCategories] = useState([]);
    const { user, token } = isAuthenticated();

    const { 
        name, description, price, category, quantity, 
        loading, error, createdProduct, redirectToProfile, formData 
    } = values;

    // Memoized init function to fetch product data
    const init = useCallback(
        (productId) => {
            getProduct(productId).then((data) => {
                if (data.error) {
                    setValues((prevValues) => ({ ...prevValues, error: data.error }));
                } else {
                    setValues((prevValues) => ({
                        ...prevValues,
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        category: data.category._id,
                        quantity: data.quantity,
                        formData: new FormData(),
                    }));
                    initCategories();
                }
            });
        },
        [] // Removed formData as a dependency
    );

    // Load categories
    const initCategories = () => {
        getCategories().then((data) => {
            if (data.error) {
                setValues((prevValues) => ({ ...prevValues, error: data.error }));
            } else {
                setCategories(data);
            }
        });
    };

    useEffect(() => {
        init(match.params.productId);
    }, [match.params.productId, init]);

    const handleChange = (name) => (event) => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues((prevValues) => ({ ...prevValues, [name]: value, error: false }));
    };

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues((prevValues) => ({ ...prevValues, error: '', loading: true }));

        updateProduct(match.params.productId, user._id, token, formData).then((data) => {
            if (data.error) {
                setValues((prevValues) => ({ ...prevValues, error: data.error, loading: false }));
            } else {
                setValues({
                    ...values,
                    name: '',
                    description: '',
                    price: '',
                    quantity: '',
                    loading: false,
                    error: false,
                    redirectToProfile: true,
                    createdProduct: data.name,
                });
            }
        });
    };

    const newPostForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Post Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary">
                    <input onChange={handleChange('photo')} type="file" name="photo" accept="image/*" />
                </label>
            </div>

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
            </div>

            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea onChange={handleChange('description')} className="form-control" value={description} />
            </div>

            <div className="form-group">
                <label className="text-muted">Price</label>
                <input onChange={handleChange('price')} type="number" className="form-control" value={price} />
            </div>

            <div className="form-group">
                <label className="text-muted">Category</label>
                <select onChange={handleChange('category')} className="form-control" value={category}>
                    <option>Please select</option>
                    {categories.map((c, i) => (
                        <option key={i} value={c._id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Shipping</label>
                <select onChange={handleChange('shipping')} className="form-control">
                    <option>Please select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input onChange={handleChange('quantity')} type="number" className="form-control" value={quantity} />
            </div>

            <button className="btn btn-outline-primary">Update Product</button>
        </form>
    );

    const showError = () => (
        error && <div className="alert alert-danger">{error}</div>
    );

    const showSuccess = () =>
        createdProduct && (
            <div className="alert alert-info">
                <h2>{`${createdProduct}`} is updated!</h2>
            </div>
        );

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    const redirectUser = () => redirectToProfile && <Navigate to="/" />;

    return (
        <Layout title="Update Product" description={`G'day ${user.name}, ready to update a product?`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                    {redirectUser()}
                </div>
            </div>
        </Layout>
    );
};

export default UpdateProduct;
