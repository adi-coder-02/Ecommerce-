import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link, Navigate } from 'react-router-dom';
import { getCategory, updateCategory } from './apiAdmin';

const UpdateCategory = ({ match }) => {
    const [values, setValues] = useState({
        name: '',
        error: '',
        redirectToProfile: false,
    });

    // Destructure user and token from isAuthenticated
    const { user, token } = isAuthenticated();
    const { name, error, redirectToProfile } = values;

    // Memoized init function to fetch category details
    const init = useCallback(
        (categoryId) => {
            getCategory(categoryId, token).then((data) => {
                if (data.error) {
                    setValues((prevValues) => ({ ...prevValues, error: data.error }));
                } else {
                    // Populate the state with the category name
                    setValues((prevValues) => ({
                        ...prevValues,
                        name: data.name,
                    }));
                }
            });
        },
        [token]
    );

    useEffect(() => {
        if (match.params.categoryId) {
            init(match.params.categoryId);
        }
    }, [match.params.categoryId, init]);

    const handleChange = (name) => (event) => {
        setValues((prevValues) => ({
            ...prevValues,
            error: false,
            [name]: event.target.value,
        }));
    };

    const submitCategoryForm = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setValues((prevValues) => ({
                ...prevValues,
                error: 'Category name is required',
            }));
            return;
        }

        const category = { name };

        updateCategory(match.params.categoryId, user._id, token, category).then((data) => {
            if (data.error) {
                setValues((prevValues) => ({ ...prevValues, error: data.error }));
            } else {
                setValues((prevValues) => ({
                    ...prevValues,
                    name: data.name,
                    error: false,
                    redirectToProfile: true,
                }));
            }
        });
    };

    const updateCategoryForm = () => (
        <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55">
            <form className="mb-5" onSubmit={submitCategoryForm}>
                <span className="login100-form-title p-b-32 m-b-7">Update Category Form</span>
                <span className="txt1 p-b-11">Category Name</span>
                <br />
                <br />
                <div className="wrap-input100 validate-input m-b-36">
                    <input
                        onChange={handleChange('name')}
                        value={name}
                        className="input100"
                        type="text"
                        required
                        name="name"
                    />
                </div>
                <div className="w-size25">
                    <button type="submit" className="flex-c-m size2 bg1 bo-rad-23 hov1 m-text3 trans-0-4">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );

    const showError = () =>
        error && (
            <div className="alert alert-danger" role="alert">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                {error}
            </div>
        );

    const redirectUser = () =>
        redirectToProfile && !error && <Navigate to="/admin/categories" />;

    const goBackBTN = () => (
        <div className="mt-5">
            <Link to="/admin/categories" className="text-info">
                Back To Admin Home
            </Link>
        </div>
    );

    return (
        <Layout
            title={`Hi ${user.name}`}
            description={`This is Update Category Action Page`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-md-8 offset-md-2 m-b-250 mb-5">
                    {showError()}
                    {updateCategoryForm()}
                    {goBackBTN()}
                    {redirectUser()}
                </div>
            </div>
        </Layout>
    );
};

export default UpdateCategory;
