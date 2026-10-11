import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="elegant-404-container">
            <div className="ambient-glow"></div>

            <div className="content-wrapper">
                <div className="status-code">404</div>
                <div className="separator"></div>
                <h1 className="title">Page Not Found</h1>
                <p className="description">
                    The resource you are looking for has been moved, removed, or is temporarily unavailable.
                </p>

                <button className="elegant-button" onClick={() => navigate('/')}>
                    Return Home
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
