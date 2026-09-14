import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-white flex font-sans">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-black text-white p-6 flex justify-between items-center z-50">
                <h2 className="text-lg font-serif tracking-widest uppercase">Luxury <span className="italic">Admin</span></h2>
                <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="opacity-60 hover:opacity-100 transition-opacity">
                    {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {showMobileMenu && (
                <div
                    className="md:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
                    onClick={() => setShowMobileMenu(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`w-80 bg-black text-white fixed h-full z-50 transition-transform duration-500 ease-in-out ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 flex flex-col border-r border-white/5`}>
                <div className="p-10 border-b border-white/5">
                    <h2 className="text-xl font-serif tracking-[0.2em] uppercase text-white">Luxury <span className="italic opacity-60">Store</span></h2>
                    <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.5em] mt-4">Control Terminal v.1.0</p>
                </div>
                
                <nav className="flex-1 p-8 space-y-4">
                    <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.4em] mb-6 block">Navigation Hub</p>
                    <NavLink
                        to="/admin"
                        end
                        onClick={() => setShowMobileMenu(false)}
                        className={({ isActive }) =>
                            `flex items-center space-x-4 px-6 py-4 transition-all duration-300 ${isActive ? 'bg-white text-black font-black italic' : 'text-white/40 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-widest">Dashboard</span>
                    </NavLink>
                    <NavLink
                        to="/admin/products"
                        onClick={() => setShowMobileMenu(false)}
                        className={({ isActive }) =>
                            `flex items-center space-x-4 px-6 py-4 transition-all duration-300 ${isActive ? 'bg-white text-black font-black italic' : 'text-white/40 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <Package className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-widest">Inventory</span>
                    </NavLink>
                    <NavLink
                        to="/admin/orders"
                        onClick={() => setShowMobileMenu(false)}
                        className={({ isActive }) =>
                            `flex items-center space-x-4 px-6 py-4 transition-all duration-300 ${isActive ? 'bg-white text-black font-black italic' : 'text-white/40 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-widest">Transactions</span>
                    </NavLink>
                </nav>

                <div className="p-10 space-y-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center space-x-4 text-white/40 hover:text-white w-full transition-all group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] uppercase tracking-widest">Return to Boutique</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-4 text-white/20 hover:text-red-500 w-full transition-all pt-4 border-t border-white/5"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-widest">Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-80 p-6 md:p-16 pt-28 md:pt-16 bg-white min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-10 left-10 right-10 bg-black text-white flex justify-around items-center py-6 z-40 shadow-2xl">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 ${isActive ? 'text-white' : 'text-white/20'}`
                    }
                >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-[8px] font-black uppercase tracking-tighter">Status</span>
                </NavLink>
                <NavLink
                    to="/admin/products"
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 ${isActive ? 'text-white' : 'text-white/20'}`
                    }
                >
                    <Package className="w-4 h-4" />
                    <span className="text-[8px] font-black uppercase tracking-tighter">Items</span>
                </NavLink>
                <NavLink
                    to="/admin/orders"
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 ${isActive ? 'text-white' : 'text-white/20'}`
                    }
                >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-[8px] font-black uppercase tracking-tighter">Orders</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default AdminLayout;
