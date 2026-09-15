import React, { useEffect, useState } from 'react';
import api, { withAuth } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const Customers = () => {
    const { token } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const response = await api.get('/admin/customers', withAuth(token));
                setCustomers(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Unable to load customers');
            } finally {
                setLoading(false);
            }
        };
        loadCustomers();
    }, [token]);

    return (
        <div className="pb-20 font-sans">
            <div className="mb-12 space-y-2 border-b border-black/5 pb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Customer archive</p>
                <h1 className="text-4xl font-serif">Registered <span className="italic">Collectors</span></h1>
            </div>
            {loading && <p className="text-[10px] font-black uppercase tracking-widest text-black/30">Loading customers...</p>}
            {error && <p className="border border-red-100 bg-red-50 p-4 text-xs font-bold text-red-600">{error}</p>}
            {!loading && !error && (
                <div className="overflow-x-auto border border-black/5">
                    <table className="w-full min-w-[640px] text-left">
                        <thead className="border-b border-black/5 text-[9px] font-black uppercase tracking-widest text-black/40">
                            <tr><th className="px-6 py-5">Name</th><th className="px-6 py-5">Email</th><th className="px-6 py-5">Phone</th><th className="px-6 py-5">Joined</th></tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {customers.map((customer) => (
                                <tr key={customer._id} className="text-sm">
                                    <td className="px-6 py-5 font-semibold">{customer.name}</td>
                                    <td className="px-6 py-5 text-black/60">{customer.email}</td>
                                    <td className="px-6 py-5 text-black/60">{customer.phone || 'Not provided'}</td>
                                    <td className="px-6 py-5 text-black/60">{new Date(customer.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {customers.length === 0 && <p className="p-12 text-center text-[10px] font-black uppercase tracking-widest text-black/25">No customers yet</p>}
                </div>
            )}
        </div>
    );
};

export default Customers;
