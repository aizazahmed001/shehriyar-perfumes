import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, Plus, Minus, CreditCard, MapPin, User as UserIcon, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutData, setCheckoutData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });
    const navigate = useNavigate();

    const handleQuantityChange = (productId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity > 0) {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="pt-40 pb-20 flex flex-col items-center justify-center min-h-screen text-center px-6">
                <div className="mb-12 opacity-10">
                    <ShoppingBag className="w-32 h-32 text-black" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40 mb-4">The Collection is Empty</p>
                <h2 className="text-4xl font-serif italic mb-12">Your selection awaits its first fragment.</h2>
                <Link to="/shop" className="monochrome-btn px-12">
                    Browse Collection
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-40 pb-20 bg-white min-h-screen">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col items-center text-center mb-20 space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40">Your Selection</p>
                    <h1 className="text-5xl font-serif">Curated <span className="italic">Cart</span></h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-8 md:space-y-12">
                        {cart.map((item) => (
                            <div key={item._id} className="group relative flex flex-col sm:flex-row items-center gap-6 md:gap-8 pb-8 md:pb-12 border-b border-black/5 last:border-0 animate-fadeIn">
                                <div className="w-32 sm:w-40 aspect-[3/4] overflow-hidden border border-black/5 group-hover:border-black transition-all flex-shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                                <div className="flex-1 space-y-4 w-full text-center sm:text-left">
                                    <div className="space-y-1">
                                        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-black/40">{item.category}</p>
                                        <h3 className="text-xl md:text-2xl font-serif group-hover:italic transition-all">{item.name}</h3>
                                    </div>
                                    <p className="text-lg md:text-xl font-bold tracking-tight">₹{item.price.toLocaleString('en-IN')}</p>

                                    <div className="flex items-center justify-center sm:justify-start gap-6 md:gap-8 pt-2 md:pt-4">
                                        <div className="flex items-center border border-black px-3 py-1.5 md:px-4 md:py-2">
                                            <button
                                                onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                                                className="p-1 hover:scale-125 transition"
                                            >
                                                <Minus className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                            </button>
                                            <span className="px-4 md:px-6 text-xs md:text-sm font-black">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                                                className="p-1 hover:scale-125 transition"
                                            >
                                                <Plus className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-black/20 hover:text-red-600 transition-colors"
                                            title="Remove Fragment"
                                        >
                                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-black/5 p-10 sticky top-40 space-y-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Statement Summary</h3>

                            <div className="space-y-6">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-black/60">
                                    <span>Subtotal</span>
                                    <span className="text-black">₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-black/60">
                                    <span>Shipping</span>
                                    <span className="text-black">Complimentary</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-black/60">
                                    <span>Tax (18%)</span>
                                    <span className="text-black">₹{Math.round(cartTotal * 0.18).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="h-px bg-black/5 my-4"></div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Total</span>
                                    <span className="text-3xl font-bold tracking-tighter">₹{(cartTotal + Math.round(cartTotal * 0.18)).toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <button
                                    onClick={handleCheckout}
                                    className="monochrome-btn w-full flex items-center justify-center gap-4"
                                >
                                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => navigate('/shop')}
                                    className="monochrome-btn-outline w-full"
                                >
                                    Refine Selection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
