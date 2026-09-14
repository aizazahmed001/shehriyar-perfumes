import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const { isAuthenticated, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [isAuthenticated, token]);

    const fetchWishlist = async () => {
        try {
            const storedToken = token || localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/wishlist', {
                headers: { Authorization: `Bearer ${storedToken}` }
            });
            if (res.data && res.data.products) {
                setWishlist(res.data.products);
            }
        } catch (err) {
            console.error("Failed to fetch wishlist", err);
        }
    };

    const addToWishlist = async (product) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            const storedToken = token || localStorage.getItem('token');
            await axios.post(`http://localhost:5001/api/wishlist/${product._id}`,
                {},
                { headers: { Authorization: `Bearer ${storedToken}` } }
            );
            await fetchWishlist();
            alert("Added to Wishlist!");
        } catch (err) {
            console.error("Error adding to wishlist", err);
            alert("Failed to add item to wishlist");
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const storedToken = token || localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/wishlist/${productId}`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });
            await fetchWishlist();
        } catch (err) {
            console.error("Error removing from wishlist", err);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item._id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
