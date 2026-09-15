import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();

    return (
        <div className="pb-20 font-sans">
            <div className="mb-12 space-y-2 border-b border-black/5 pb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Control preferences</p>
                <h1 className="text-4xl font-serif">Store <span className="italic">Settings</span></h1>
            </div>
            <div className="grid max-w-3xl gap-6 md:grid-cols-2">
                <div className="border border-black/5 p-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Signed-in administrator</p>
                    <p className="mt-3 font-serif text-2xl">{user?.name}</p>
                    <p className="mt-2 text-sm text-black/50">{user?.email}</p>
                </div>
                <div className="border border-black/5 p-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Commerce protocol</p>
                    <p className="mt-3 font-serif text-2xl">Cash on Delivery</p>
                    <p className="mt-2 text-sm text-black/50">Orders are validated and priced server-side.</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
