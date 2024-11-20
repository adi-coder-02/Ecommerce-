import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Navigate } from 'react-router-dom'; // Import Navigate
import { read, update, updateUser } from './apiUser';

const Profile = ({ match }) => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false,
    });

    const { token } = isAuthenticated();

    // Initialize user data
    const init = useCallback(
        (userId) => {
            read(userId, token)
                .then((data) => {
                    if (data.error) {
                        setValues((prevValues) => ({
                            ...prevValues,
                            error: data.error,
                        }));
                    } else {
                        setValues((prevValues) => ({
                            ...prevValues,
                            name: data.name,
                            email: data.email,
                        }));
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setValues((prevValues) => ({
                        ...prevValues,
                        error: 'Error loading user data',
                    }));
                });
        },
        [token] // Only recompute `init` when `token` changes
    );

    useEffect(() => {
        if (match.params.userId) {
            init(match.params.userId);
        }
    }, [match.params.userId, init]);

    // Handle input changes
    const handleChange = (field) => (e) => {
        setValues((prevValues) => ({
            ...prevValues,
            [field]: e.target.value,
            error: '',
        }));
    };

    // Handle form submission
    const clickSubmit = (e) => {
        e.preventDefault();
        const { name, email, password } = values;

        update(match.params.userId, token, { name, email, password })
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    updateUser(data, () => {
                        setValues({
                            ...values,
                            name: data.name,
                            email: data.email,
                            success: true,
                        });
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                setValues((prevValues) => ({
                    ...prevValues,
                    error: 'Error updating profile',
                }));
            });
    };

    // Redirect user on successful profile update
    const redirectUser = () => {
        if (values.success) {
            return <Navigate to="/cart" />;
        }
    };

    // Profile update form
    const profileUpdate = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    type="text"
                    onChange={handleChange('name')}
                    className="form-control"
                    value={values.name}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    type="email"
                    onChange={handleChange('email')}
                    className="form-control"
                    value={values.email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    type="password"
                    onChange={handleChange('password')}
                    className="form-control"
                    value={values.password}
                />
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    return (
        <Layout
            title="Profile"
            description="Update your profile"
            className="container-fluid"
        >
            <h2 className="mb-4">Profile update</h2>
            {profileUpdate()}
            {redirectUser()}
        </Layout>
    );
};

export default Profile;
