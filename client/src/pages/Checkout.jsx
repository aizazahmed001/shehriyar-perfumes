import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, ShoppingBag, Truck, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [address, setAddress] = useState(user?.address || '');
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const parseCurrency = (value) => {
        if (typeof value === 'string') {
            return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
        }
        return Number(value) || 0;
    };

    const GST_RATE = 0.18;
    const subtotal = cart.reduce((total, item) => total + (parseCurrency(item.price) * item.quantity), 0);
    const gstAmount = Math.round(subtotal * GST_RATE);
    const grandTotal = subtotal + gstAmount;

    const handlePlaceOrder = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const orderData = {
                user: user.id || user._id,
                customerName: user.name,
                email: user.email,
                address: address,
                products: cart.map(item => ({
                    productId: item._id,
                    quantity: item.quantity,
                    price: parseCurrency(item.price)
                })),
                subtotal: subtotal,
                gst: gstAmount,
                totalAmount: grandTotal,
                paymentMethod: paymentMethod,
                status: 'Pending'
            };

            await axios.post('http://localhost:5001/api/orders', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await clearCart();
            toast.success("Reception Confirmed. Your order is placed.", {
                style: {
                    borderRadius: '0px',
                    background: '#000',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em'
                }
            });
            navigate('/orders');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Transmission failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="pt-40 pb-20 flex flex-col items-center justify-center min-h-screen text-center px-6">
                <div className="mb-12 opacity-10">
                    <ShoppingBag className="w-32 h-32 text-black" />
                </div>
                <h2 className="text-4xl font-serif italic mb-12">Checkout point is empty.</h2>
                <button
                    onClick={() => navigate('/shop')}
                    className="monochrome-btn px-12"
                >
                    Return to Collection
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-40 pb-20">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col items-center text-center mb-20 space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40">Finalize</p>
                    <h1 className="text-5xl font-serif">Checkout <span className="italic">Process</span></h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
                    {/* Left: Shipping & Payment */}
                    <div className="lg:col-span-2 space-y-20">
                        {/* Shipping Information */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">01</p>
                                <h2 className="text-xl font-serif italic border-b border-black/5 pb-2 flex-1">
                                    Shipping Destination
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Recipient</label>
                                    <input
                                        type="text"
                                        value={user?.name}
                                        disabled
                                        className="w-full px-4 py-3 border-b border-black/5 bg-transparent text-black/40 font-medium text-sm outline-none cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Contact Email</label>
                                    <input
                                        type="email"
                                        value={user?.email}
                                        disabled
                                        className="w-full px-4 py-3 border-b border-black/5 bg-transparent text-black/40 font-medium text-sm outline-none cursor-not-allowed"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Archive Location (Shipping Address)</label>
                                    <textarea
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-4 py-3 border-b border-black/5 focus:border-black bg-transparent text-black font-medium text-sm outline-none transition-all placeholder:text-black/10"
                                        rows="3"
                                        placeholder="Full address, City, State, Zip"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">02</p>
                                <h2 className="text-xl font-serif italic border-b border-black/5 pb-2 flex-1">
                                    Protocol of Payment
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`group p-8 border transition-all cursor-pointer ${paymentMethod === 'cod'
                                        ? 'border-black bg-black text-white'
                                        : 'border-black/5 hover:border-black/20 text-black'
                                        }`}
                                >
                                    <div className="flex flex-col h-full justify-between gap-8">
                                        <div className="flex justify-between items-start">
                                            <Banknote className="w-8 h-8 opacity-20" />
                                            <div className={`w-3 h-3 border rounded-full ${paymentMethod === 'cod' ? 'bg-white border-white' : 'border-black/20'}`}></div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-widest mb-2">Deferred Payment</h3>
                                            <p className={`text-[10px] uppercase tracking-wider font-bold ${paymentMethod === 'cod' ? 'text-white/40' : 'text-black/40'}`}>
                                                Cash on Arrival
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => {
                                        toast("E-Payment Portal Initializing (Coming Soon)", {
                                            style: { borderRadius: '0', background: '#000', color: '#fff', fontSize: '10px' }
                                        });
                                    }}
                                    className="group p-8 border border-black/5 opacity-40 grayscale cursor-not-allowed space-y-8"
                                >
                                    <div className="flex flex-col h-full justify-between gap-8">
                                        <div className="flex justify-between items-start">
                                            <CreditCard className="w-8 h-8 opacity-20" />
                                            <div className="text-[9px] font-black uppercase tracking-widest text-black border border-black/10 px-2 py-1">SOON</div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-widest mb-2">Instant Transfer</h3>
                                            <p className="text-[10px] uppercase tracking-wider font-bold text-black/40">
                                                Digital Transaction
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-black/5 p-10 sticky top-40 space-y-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Collector Statement</h3>

                            {/* Cart Items */}
                            <div className="space-y-6 max-h-48 overflow-y-auto pr-4 scrollbar-thin">
                                {cart.map(item => (
                                    <div key={item._id} className="flex gap-4 pb-4 border-b border-black/5 last:border-0 last:pb-0">
                                        <div className="w-12 h-16 border border-black/5 aspect-[3/4] flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h3 className="text-[10px] font-black uppercase tracking-wider text-black line-clamp-1">{item.name}</h3>
                                            <p className="text-[9px] text-black/40 font-bold tracking-widest uppercase">Qty: {item.quantity}</p>
                                            <p className="text-xs font-bold tracking-tighter mt-1">₹{parseCurrency(item.price) * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-6 pt-6 border-t border-black/5">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-black/40">
                                    <span>Base Value</span>
                                    <span className="text-black">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-black/40">
                                    <span>Tax Attribution</span>
                                    <span className="text-black">₹{gstAmount}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-black/40">
                                    <span>Logistics</span>
                                    <span className="text-black">Included</span>
                                </div>
                                <div className="h-px bg-black/5 my-4"></div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Total</span>
                                    <span className="text-3xl font-bold tracking-tighter text-black">₹{grandTotal}</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading || !address.trim()}
                                    className="monochrome-btn w-full"
                                >
                                    {loading ? 'Transmitting...' : `Place Order`}
                                </button>
                                <p className="text-[8px] text-black/20 font-black text-center mt-6 uppercase tracking-[0.2em] leading-relaxed">
                                    By proceeding, you agree to the <span className="text-black">Curated Terms or Sale</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
