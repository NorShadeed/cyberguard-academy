import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../features/auth/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-text">VERIFYING IDENTITY...</div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
