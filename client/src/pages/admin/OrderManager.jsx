import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, ChevronDown, Trash2, CheckCircle2, Clock, Truck, ShieldCheck } from 'lucide-react';
import socket from '../../lib/socket';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
        socket.on('newResults', fetchOrders);
        socket.on('orderUpdate', (updated) => {
            setOrders(prev => prev.map(o => o._id === updated._id ? updated : o));
        });

        return () => {
            socket.off('newResults');
            socket.off('orderUpdate');
        };
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/admin/orders');
            setOrders(res.data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        await axios.put(`http://localhost:5001/api/orders/${id}`, { status: newStatus });
    };

    const handleDeleteOrder = async (id) => {
        if (!window.confirm('Erase this transaction from history?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/orders/${id}`);
            setOrders(prev => prev.filter(order => order._id !== id));
        } catch (err) {
            console.error('Failed to delete order:', err);
        }
    };

    const toggleSelectOrder = (id) => {
        setSelectedOrders(prev =>
            prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedOrders(orders.map(o => o._id));
        } else {
            setSelectedOrders([]);
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Erase ${selectedOrders.length} records from archive?`)) return;
        try {
            await axios.post('http://localhost:5001/api/admin/orders/bulk-delete', { orderIds: selectedOrders });
            setOrders(prev => prev.filter(o => !selectedOrders.includes(o._id)));
            setSelectedOrders([]);
        } catch (err) {
            console.error('Failed to delete orders:', err);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="w-3 h-3" />;
            case 'Processing': return <ShieldCheck className="w-3 h-3" />;
            case 'Shipped': return <Truck className="w-3 h-3" />;
            case 'Delivered': return <CheckCircle2 className="w-3 h-3" />;
            default: return <Package className="w-3 h-3" />;
        }
    };

    return (
        <div className="pb-20 md:pb-0 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 border-b border-black/5 pb-8">
                <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40">Transactions</p>
                    <h1 className="text-4xl font-serif">Order <span className="italic">Manifest</span></h1>
                </div>
                {selectedOrders.length > 0 && (
                    <button
                        onClick={handleBulkDelete}
                        className="text-[10px] uppercase tracking-widest font-black text-white bg-black px-6 py-3 flex items-center gap-2 hover:bg-black/80 transition-all shadow-xl"
                    >
                        <Trash2 className="w-4 h-4" />
                        Purge {selectedOrders.length} Selected
                    </button>
                )}
            </div>

            {orders.length > 0 && (
                <div className="bg-white p-6 border border-black/5 mb-8 flex items-center gap-4">
                    <input
                        type="checkbox"
                        checked={selectedOrders.length === orders.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 border-black/10 text-black focus:ring-black rounded-none"
                    />
                    <span className="text-[10px] uppercase font-black tracking-widest text-black/40">Fragment Selection All</span>
                </div>
            )}

            <div className="space-y-8">
                {orders.map((order) => (
                    <div key={order._id} className={`bg-white border transition-all duration-500 overflow-hidden ${selectedOrders.includes(order._id) ? 'border-black shadow-2xl scale-[1.01]' : 'border-black/5 shadow-sm'}`}>
                        <div className="flex flex-col md:flex-row justify-between md:items-center p-8 border-b border-black/5">
                            <div className="flex items-start gap-6">
                                <input
                                    type="checkbox"
                                    checked={selectedOrders.includes(order._id)}
                                    onChange={() => toggleSelectOrder(order._id)}
                                    className="mt-1 w-4 h-4 border-black/10 text-black focus:ring-black rounded-none"
                                />
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest">Manifest N°{order._id.slice(-6).toUpperCase()}</h3>
                                        <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 border border-black/5">
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleString()} • {order.customerName}</p>
                                </div>
                            </div>
                            <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-6 pl-10 md:pl-0">
                                <span className="text-xl font-black italic tracking-tighter italic">₹{order.totalAmount}</span>
                                <div className="relative group">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                        className="appearance-none bg-black/5 border border-black/5 text-[10px] font-black uppercase tracking-widest py-2 pl-4 pr-10 outline-none focus:border-black/20 cursor-pointer"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                    <ChevronDown className="w-3 h-3 text-black absolute right-3 top-3 pointer-events-none opacity-40" />
                                </div>
                                <button
                                    onClick={() => handleDeleteOrder(order._id)}
                                    className="p-2 text-black/10 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 pb-4 space-y-4">
                            {order.products?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-6 p-4 border border-black/5 hover:border-black/10 transition-colors">
                                    <div className="w-14 h-20 border border-black/5 overflow-hidden grayscale contrast-125">
                                        <img
                                            src={item.productId?.image || item.productId?.images?.[0]}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-wider">{item.productId?.name || 'Undefined Fragment'}</p>
                                        <p className="text-[9px] text-black/40 font-bold uppercase tracking-widest italic">{item.quantity} units per manifesto</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black tracking-widest italic">₹{item.price * item.quantity}</p>
                                        <p className="text-[8px] text-black/20 font-black uppercase tracking-widest">Accumulated</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 pt-0 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-black/40">
                            <p className="max-w-md truncate">Deliverance Conduit: {order.address}</p>
                            <p className="italic underline">View Transaction Receipt</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrders;
