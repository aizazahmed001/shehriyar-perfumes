import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp, Users, DollarSign, ShoppingBag } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001');

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        recentOrders: [],
        recentProducts: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsRes, ordersRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/products'),
                    axios.get('http://localhost:5001/api/admin/orders')
                ]);

                const totalSales = ordersRes.data.reduce((acc, order) => acc + order.totalAmount, 0);

                setStats({
                    totalSales,
                    totalOrders: ordersRes.data.length,
                    totalProducts: productsRes.data.length,
                    recentOrders: ordersRes.data.slice(0, 5),
                    recentProducts: productsRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
                });
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        socket.on('newProduct', (newProduct) => {
            setStats(prev => ({
                ...prev,
                totalProducts: prev.totalProducts + 1,
                recentProducts: [newProduct, ...prev.recentProducts].slice(0, 5)
            }));
        });

        socket.on('orderUpdate', (updatedOrder) => {
            fetchData();
        });

        return () => {
            socket.off('newProduct');
            socket.off('orderUpdate');
        };
    }, []);

    const data = [
        { name: 'Jan', sales: 4000 },
        { name: 'Feb', sales: 3000 },
        { name: 'Mar', sales: 2000 },
        { name: 'Apr', sales: stats.totalSales },
        { name: 'May', sales: 1890 },
        { name: 'Jun', sales: 2390 },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-t-2 border-black rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="pb-20 md:pb-0 font-sans">
            <div className="flex flex-col mb-12 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40">Intelligence</p>
                <h1 className="text-4xl font-serif">Store <span className="italic">Overview</span></h1>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Total Revenue', value: `₹${stats.totalSales.toLocaleString()}`, icon: DollarSign },
                    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag },
                    { label: 'Total Products', value: stats.totalProducts, icon: TrendingUp },
                    { label: 'Active Users', value: '126', icon: Users }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 border border-black/5 hover:border-black transition-all">
                        <div className="flex flex-col gap-6">
                            <stat.icon className="w-5 h-5 opacity-20" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold tracking-tighter">{stat.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Sales Chart */}
                <div className="bg-white p-10 border border-black/5">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em]">Sales Analytics</h3>
                        <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Monthly Frequency</div>
                    </div>
                    <div className="h-80 w-full grayscale contrast-125">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis 
                                    dataKey="name" 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#000' }} 
                                    axisLine={{ stroke: '#000', strokeWidth: 0.5 }}
                                    tickLine={false}
                                />
                                <YAxis 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#000' }}
                                    axisLine={{ stroke: '#000', strokeWidth: 0.5 }}
                                    tickLine={false}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '0', border: '1px solid #000', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
                                    cursor={{ fill: '#000', opacity: 0.05 }}
                                />
                                <Bar dataKey="sales" fill="#000" radius={[0, 0, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Products */}
                <div className="bg-white p-10 border border-black/5">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em]">Recent Acquisitions</h3>
                        <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Lately Added</div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-black/40 text-[9px] uppercase font-black border-b border-black/5">
                                <tr>
                                    <th className="px-4 py-4 tracking-widest">Fragment</th>
                                    <th className="px-4 py-4 tracking-widest text-right">Value</th>
                                    <th className="px-4 py-4 tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {stats.recentProducts && stats.recentProducts.map((product) => (
                                    <tr key={product._id} className="group hover:bg-black/5 transition-colors">
                                        <td className="px-4 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-14 border border-black/5 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="text-[10px] font-black uppercase tracking-wider truncate max-w-[150px]">{product.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-6 text-[10px] font-black tracking-widest text-right">₹{product.price}</td>
                                        <td className="px-4 py-6 text-right">
                                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] border px-2 py-1 ${product.stock > 0 ? 'border-black text-black' : 'border-red-600 text-red-600'}`}>
                                                {product.stock > 0 ? `Stock: ${product.stock}` : 'Depleted'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!stats.recentProducts || stats.recentProducts.length === 0) && (
                                    <tr>
                                        <td colSpan="3" className="text-center py-12 text-[10px] font-black uppercase tracking-widest text-black/10">Archive is empty</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AdminDashboard;
