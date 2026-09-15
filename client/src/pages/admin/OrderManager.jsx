import React, { useEffect, useState } from 'react';
import api, { withAuth } from '../../lib/api';
import { Package, ChevronDown, Trash2, CheckCircle2, Clock, Truck, ShieldCheck } from 'lucide-react';
import socket from '../../lib/socket';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';

const AdminOrders = () => {
    const { formatPrice } = useCurrency();
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [detailsOrder, setDetailsOrder] = useState(null);

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

    async function fetchOrders() {
        try {
            const res = await api.get('/admin/orders', withAuth(token));
            setOrders(res.data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        }
    }

    const handleStatusUpdate = async (id, newStatus) => {
        await api.put(`/orders/${id}`, { status: newStatus }, withAuth(token));
    };

    const handleDeleteOrder = async (id) => {
        if (!window.confirm('Erase this transaction from history?')) return;
        try {
            await api.delete(`/orders/${id}`, withAuth(token));
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
            await api.post('/admin/orders/bulk-delete', { orderIds: selectedOrders }, withAuth(token));
            setOrders(prev => prev.filter(o => !selectedOrders.includes(o._id)));
            setSelectedOrders([]);
        } catch (err) {
            console.error('Failed to delete orders:', err);
        }
    };

    const getStatusIcon = (status) => {
        switch (String(status).toLowerCase()) {
            case 'pending': return <Clock className="w-3 h-3" />;
            case 'processing': return <ShieldCheck className="w-3 h-3" />;
            case 'shipped': return <Truck className="w-3 h-3" />;
            case 'delivered': return <CheckCircle2 className="w-3 h-3" />;
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

            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer, email, or order ID..." className="flex-1 border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="border border-black/15 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-black">
                    <option value="all">All statuses</option>
                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
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
                {orders.filter((order) => {
                    const query = search.toLowerCase();
                    const matchesSearch = !query || [order._id, order.customerName, order.email, order.phone].some((value) => String(value || '').toLowerCase().includes(query));
                    return matchesSearch && (statusFilter === 'all' || String(order.status).toLowerCase() === statusFilter);
                }).map((order) => (
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
                                <span className="text-xl font-black italic tracking-tighter italic">{formatPrice(order.totalAmount)}</span>
                                <div className="relative group">
                                    <select
                                        value={String(order.status).toLowerCase()}
                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                        className="appearance-none bg-black/5 border border-black/5 text-[10px] font-black uppercase tracking-widest py-2 pl-4 pr-10 outline-none focus:border-black/20 cursor-pointer"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
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
                                        <p className="text-[10px] font-black tracking-widest italic">{formatPrice(item.price * item.quantity)}</p>
                                        <p className="text-[8px] text-black/20 font-black uppercase tracking-widest">Accumulated</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 pt-0 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-black/40">
                            <p className="max-w-md truncate">Deliverance Conduit: {order.address}</p>
                            <button type="button" onClick={() => setDetailsOrder(order)} className="italic underline">View Transaction Details</button>
                        </div>
                    </div>
                ))}
            </div>

            {detailsOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={() => setDetailsOrder(null)}>
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white p-6 sm:p-10" onClick={(event) => event.stopPropagation()}>
                        <div className="mb-8 flex items-start justify-between gap-6 border-b border-black/5 pb-6">
                            <div><p className="text-[9px] font-black uppercase tracking-widest text-black/40">Order details</p><h2 className="mt-2 font-serif text-3xl">{detailsOrder.customerName}</h2></div>
                            <button type="button" onClick={() => setDetailsOrder(null)} className="text-black/30 hover:text-black">Close</button>
                        </div>
                        <div className="grid gap-4 text-sm sm:grid-cols-2"><p><strong>Phone:</strong> {detailsOrder.phone}</p><p><strong>Email:</strong> {detailsOrder.email || 'Not provided'}</p><p><strong>City:</strong> {detailsOrder.city}</p><p><strong>Status:</strong> {detailsOrder.status}</p><p className="sm:col-span-2"><strong>Address:</strong> {detailsOrder.address}</p></div>
                        <div className="mt-8 space-y-3 border-t border-black/5 pt-6">{detailsOrder.products?.map((item, index) => <div key={index} className="flex justify-between gap-4 text-sm"><span>{item.productId?.name || 'Product'} / {item.size} x {item.quantity}</span><span>{formatPrice(item.price * item.quantity)}</span></div>)}</div>
                        <div className="mt-8 border-t border-black/5 pt-6 text-right font-serif text-2xl">{formatPrice(detailsOrder.totalAmount)}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
