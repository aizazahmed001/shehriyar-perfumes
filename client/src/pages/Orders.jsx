import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import socket from '../lib/socket';
import { Package, Clock, XCircle, CheckCircle } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) fetchOrders();

        socket.on('orderUpdate', (updatedOrder) => {
            setOrders(prevOrders => {
                const index = prevOrders.findIndex(o => o._id === updatedOrder._id);
                if (index > -1) {
                    const newOrders = [...prevOrders];
                    newOrders[index] = updatedOrder;
                    return newOrders;
                } else {
                    return [updatedOrder, ...prevOrders];
                }
            });
        });

        return () => {
            socket.off('orderUpdate');
        };
    }, [token]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5001/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Abort this transmission?")) return;
        try {
            await axios.put(`http://localhost:5001/api/orders/${orderId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOrders();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-t-2 border-black rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="pt-40 pb-20 bg-white min-h-screen">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="flex flex-col items-center text-center mb-20 space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40">History</p>
                    <h1 className="text-5xl font-serif">Order <span className="italic">Archive</span></h1>
                </div>

                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order._id} className="group bg-white border border-black/5 p-8 flex flex-col md:flex-row justify-between md:items-center hover:border-black transition-all animate-fadeIn">
                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="opacity-20"><Package className="w-5 h-5" /></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Transaction #{order._id.slice(-6).toUpperCase()}</span>
                                    <span className={`px-4 py-1 text-[8px] font-black uppercase tracking-[0.2em] border ${order.status === 'Pending' ? 'border-black/10 text-black/40' :
                                        order.status === 'Cancelled' ? 'border-red-100 text-red-600' :
                                            'border-black text-black'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                
                                <div className="flex flex-col gap-1">
                                    <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">
                                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} • {order.products ? order.products.length : 0} Fragments
                                    </p>
                                </div>

                                {/* Product Thumbnails */}
                                <div className="flex gap-4 overflow-hidden pt-2">
                                    {order.products?.map((item, idx) => (
                                        <div key={idx} className="w-10 h-14 border border-black/5 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700" title={item.productId?.name}>
                                            <img
                                                src={item.productId?.image || item.productId?.images?.[0]}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="text-left md:text-right flex flex-col items-start md:items-end gap-6 mt-8 md:mt-0">
                                <div>
                                    <span className="block text-3xl font-bold tracking-tighter">₹{order.totalAmount}</span>
                                    <span className="text-[8px] text-black/20 font-black uppercase tracking-[0.3em] font-bold mt-1 block">Prot: {order.paymentMethod === 'cod' ? 'Deferred' : 'Digital'}</span>
                                </div>
                                {order.status === 'Pending' && (
                                    <button
                                        onClick={() => handleCancelOrder(order._id)}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600/40 hover:text-red-600 transition-colors"
                                    >
                                        Abort Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {orders.length === 0 && (
                        <div className="text-center py-32 border border-dashed border-black/10">
                            <Package className="w-16 h-16 text-black/5 mx-auto mb-8" />
                            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-black/20 mb-8">No transmissions found in archive.</p>
                            <button
                                onClick={() => navigate('/shop')}
                                className="monochrome-btn px-12"
                            >
                                Begin Collection
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
