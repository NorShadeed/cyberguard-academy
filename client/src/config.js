// API Configuration for Production and Development
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function for making authenticated API calls
export const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'x-auth-token': token })
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    const url = `${API_URL}${endpoint}`;
    return fetch(url, config);
};

export default API_URL;
