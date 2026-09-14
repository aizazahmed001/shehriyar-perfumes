import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div className="loading-container">
            <div className="spinner-wrapper">
                <div className="spinner">
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle"></div>
                </div>
                <p className="loading-text">{message}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
