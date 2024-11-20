import { API } from '../config';

export const signup = user => {
    return fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .catch(err => {
            console.log(err);
            return { error: 'Something went wrong during signup.' }; // Return a fallback error object
        });
};

export const signin = user => {
    return fetch(`${API}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .catch(err => {
            console.log(err);
            return { error: 'Something went wrong during signin.' }; // Return a fallback error object
        });
};

export const authenticate = (data, next) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(data));  // Save JWT token and user data in localStorage
        next(); // Proceed to the next function (e.g., redirecting after login)
    }
};

export const signout = next => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt'); // Remove JWT from localStorage
        next(); // Proceed to next function (e.g., redirecting to homepage)
        return fetch(`${API}/signout`, {
            method: 'GET'
        })
            .then(response => {
                console.log('signout', response);
            })
            .catch(err => {
                console.log(err);
                return { error: 'Error occurred during signout.' }; // Provide a fallback error message
            });
    }
};

export const isAuthenticated = () => {
    // Check if the window object is available (ensures this only runs in the browser)
    if (typeof window == 'undefined') {
        return false;
    }
    // Check if the 'jwt' key exists in localStorage
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        return JSON.parse(jwt); // Return the parsed JWT object (user + token)
    } else {
        return false; // Return false if JWT doesn't exist
    }
};
