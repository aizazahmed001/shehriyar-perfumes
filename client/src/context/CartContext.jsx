import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api, { withAuth } from '../lib/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('guestCart') || '[]'));
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchCart();
        } else {
            setCart(JSON.parse(localStorage.getItem('guestCart') || '[]'));
        }
    }, [isAuthenticated, token]);

    useEffect(() => {
        if (!isAuthenticated) localStorage.setItem('guestCart', JSON.stringify(cart));
    }, [cart, isAuthenticated]);

    const fetchCart = async () => {
        try {
            const storedToken = token || localStorage.getItem('token');
            const res = await api.get('/cart', withAuth(storedToken));
            // Backend returns { _id, items: [{ product: {...}, quantity: 1 }] }
            // We need to map it to match the structure the frontend expects: { ...product, quantity }
            if (res.data && res.data.items) {
                const formattedCart = res.data.items.map(item => ({
                    ...item.product,
                    quantity: item.quantity,
                    size: item.size || 'default',
                    price: item.product?.variants?.find(variant => variant.size === item.size)?.price || item.product?.sellPrice || item.product?.price
                }));
                setCart(formattedCart);
            }
        } catch (err) {
            console.error("Failed to fetch cart", err);
        }
    };

    const addToCart = async (product, size = product.variants?.[0]?.size || '100ml', quantity = 1) => {
        const variant = product.variants?.find(item => item.size === size);
        const cartItem = { ...product, size, quantity, price: variant?.price || product.sellPrice || product.price };
        if (!isAuthenticated) {
            setCart((current) => {
                const index = current.findIndex(item => item._id === product._id && item.size === size);
                if (index === -1) return [...current, cartItem];
                return current.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: item.quantity + quantity } : item);
            });
            return;
        }

        try {
            const storedToken = token || localStorage.getItem('token');
            // Optimistic update or wait for response? Let's wait for response to be safe.
            await api.post('/cart', { productId: product._id, size, quantity }, withAuth(storedToken));
            await fetchCart();
            // alert("Item added to cart!"); // Optional: Feedback
        } catch (err) {
            console.error("Error adding to cart", err);
            alert("Failed to add item to cart");
        }
    };

    const removeFromCart = async (productId, size = 'default') => {
        if (!isAuthenticated) {
            setCart((current) => current.filter(item => !(item._id === productId && item.size === size)));
            return;
        }
        try {
            const storedToken = token || localStorage.getItem('token');
            await api.delete(`/cart/${productId}/${size}`, withAuth(storedToken));
            await fetchCart();
        } catch (err) {
            console.error("Error removing from cart", err);
        }
    };

    const updateQuantity = async (productId, size = 'default', quantity) => {
        if (!isAuthenticated) {
            setCart((current) => quantity > 0
                ? current.map(item => item._id === productId && item.size === size ? { ...item, quantity } : item)
                : current.filter(item => !(item._id === productId && item.size === size)));
            return;
        }
        try {
            const storedToken = token || localStorage.getItem('token');
            await api.put(`/cart/${productId}/${size}`, { quantity }, withAuth(storedToken));
            await fetchCart();
        } catch (err) {
            console.error("Error updating quantity", err);
        }
    };

    const clearCart = async () => {
        if (!isAuthenticated) {
            setCart([]);
            localStorage.removeItem('guestCart');
            return;
        }
        try {
            await api.delete('/cart', withAuth(token));
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
