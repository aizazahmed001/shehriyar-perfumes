import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { isAuthenticated, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [isAuthenticated, token]);

    const fetchCart = async () => {
        try {
            const storedToken = token || localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/cart', {
                headers: { Authorization: `Bearer ${storedToken}` }
            });
            // Backend returns { _id, items: [{ product: {...}, quantity: 1 }] }
            // We need to map it to match the structure the frontend expects: { ...product, quantity }
            if (res.data && res.data.items) {
                const formattedCart = res.data.items.map(item => ({
                    ...item.product,
                    quantity: item.quantity
                }));
                setCart(formattedCart);
            }
        } catch (err) {
            console.error("Failed to fetch cart", err);
        }
    };

    const addToCart = async (product) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            const storedToken = token || localStorage.getItem('token');
            // Optimistic update or wait for response? Let's wait for response to be safe.
            await axios.post('http://localhost:5001/api/cart',
                { productId: product._id, quantity: 1 },
                { headers: { Authorization: `Bearer ${storedToken}` } }
            );
            await fetchCart();
            // alert("Item added to cart!"); // Optional: Feedback
        } catch (err) {
            console.error("Error adding to cart", err);
            alert("Failed to add item to cart");
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const storedToken = token || localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/cart/${productId}`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });
            await fetchCart();
        } catch (err) {
            console.error("Error removing from cart", err);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const storedToken = token || localStorage.getItem('token');
            await axios.put(`http://localhost:5001/api/cart/${productId}`,
                { quantity },
                { headers: { Authorization: `Bearer ${storedToken}` } }
            );
            await fetchCart();
        } catch (err) {
            console.error("Error updating quantity", err);
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete('http://localhost:5001/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart([]);
        } catch (err) {
            console.error("Error clearing cart", err);
        }
    };

    const cartTotal = cart.reduce((total, item) => {
        const price = typeof item.price === 'string'
            ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
            : Number(item.price);
        return total + (price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
