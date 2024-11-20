import { API } from "../config";

// Function to read user details by userId
export const read = (userId, token) => {
    return fetch(`${API}/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                // Check if the response is okay (status 2xx)
                throw new Error("Failed to fetch user data");
            }
            return response.json();
        })
        .catch(err => {
            console.log("Error in read:", err);
            throw err; // Re-throw the error for further handling if needed
        });
};

// Function to update user details
export const update = (userId, token, user) => {
    return fetch(`${API}/user/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
    })
        .then(response => {
            if (!response.ok) {
                // Check if the response is okay (status 2xx)
                throw new Error("Failed to update user data");
            }
            return response.json();
        })
        .catch(err => {
            console.log("Error in update:", err);
            throw err; // Re-throw the error for further handling if needed
        });
};

// Function to update user data in localStorage after successful update
export const updateUser = (user, next) => {
    if (typeof window !== "undefined") {
        const jwt = localStorage.getItem("jwt");

        if (jwt) {
            let auth = JSON.parse(jwt);
            auth.user = user;
            localStorage.setItem("jwt", JSON.stringify(auth));
            next(); // Callback to proceed after updating user
        } else {
            console.log("No JWT token found in localStorage");
        }
    }
};

// Function to get purchase history by userId
export const getPurchaseHistory = (userId, token) => {
    return fetch(`${API}/orders/by/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                // Check if the response is okay (status 2xx)
                throw new Error("Failed to fetch purchase history");
            }
            return response.json();
        })
        .catch(err => {
            console.log("Error in getPurchaseHistory:", err);
            throw err; // Re-throw the error for further handling if needed
        });
};
