import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800); // Wait for fade out animation
        }, 3000); // Show splash for 3 seconds

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className={`splash-screen ${!isVisible ? 'fade-out' : ''}`}>
            <div className="splash-content">
                <h1 className="brand-title">Perfume Store</h1>
                <div className="glow-line"></div>
                <p className="brand-tagline">Fragrance • Luxury • Elegance</p>
            </div>
        </div>
    );
};

export default SplashScreen;
