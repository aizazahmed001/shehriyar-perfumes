import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ShoppingCart, User, Search, LogOut, UserCircle, Package, X, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import UserAvatar from './UserAvatar';
import api from '../lib/api';
import { useCurrency } from '../context/CurrencyContext';

const Navbar = () => {
    const { cart } = useCart();
    const { user, logout, isAuthenticated } = useAuth();
    const { currency, currencies, changeCurrency, formatPrice } = useCurrency();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const navigate = useNavigate();

    // Safety check for cart
    const safeCart = Array.isArray(cart) ? cart : [];
    const itemCount = safeCart.reduce((acc, item) => acc + (item?.quantity || 0), 0);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            if (Array.isArray(res.data)) {
                setAllProducts(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch products for search", err);
            setAllProducts([]);
        }
    };

    useEffect(() => {
        if (searchQuery.trim() && allProducts.length > 0) {
            const filtered = allProducts.filter(product =>
                (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.category || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filtered);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, allProducts]);

    const handleSearchSelect = (productId) => {
        setSearchQuery('');
        setShowSearch(false);
        setSearchResults([]);
        navigate('/shop');
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 glass-nav bg-white/95 backdrop-blur-xl border-b border-black/5">
                <div className="container mx-auto px-4 md:px-6 py-3 md:py-5 flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <button
                            className="lg:hidden text-black"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link to="/" className="text-base sm:text-2xl font-serif font-black tracking-tighter flex items-center whitespace-nowrap">
                            SHERYAR<span className="font-light ml-1">PERFUME</span>
                        </Link>
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden md:flex items-center relative">
                        <div className="flex items-center space-x-3 bg-white px-4 py-2.5 border border-black/15 focus-within:border-black transition-all w-64 lg:w-96 shadow-sm">
                            <Search className="text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search fragrances..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setShowSearch(true)}
                                className="bg-transparent outline-none text-sm flex-1 font-medium"
                            />
                        </div>

                        {/* Search Results */}
                        {showSearch && searchResults.length > 0 && (
                            <div className="absolute top-full mt-2 w-full bg-white border border-black shadow-2xl max-h-96 overflow-y-auto z-50">
                                <div className="p-2">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 px-3 py-2 font-bold">Results</p>
                                    {searchResults.map((product) => (
                                        <button
                                            key={product._id}
                                            onClick={() => handleSearchSelect(product._id)}
                                            className="w-full flex items-center space-x-4 p-3 hover:bg-black hover:text-white transition group border-b border-gray-50 last:border-0"
                                        >
                                            <img
                                                src={product.image || 'https://via.placeholder.com/50'}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover grayscale group-hover:grayscale-0 transition-all"
                                            />
                                            <div className="flex-1">
                                                <p className="font-bold text-sm line-clamp-1">{product.name}</p>
                                                <p className="text-[10px] uppercase tracking-wider opacity-60">{product.category}</p>
                                            </div>
                                            <span className="font-black text-sm">{formatPrice(product.price)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-8">
                        {/* Mobile Search Icon Toggle */}
                        <button 
                            className="md:hidden text-black hover:scale-110 transition-transform"
                            onClick={() => setShowSearch(!showSearch)}
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        <div className="hidden lg:flex items-center space-x-8 uppercase tracking-[0.2em] text-[10px] font-bold">
                            <Link to="/" className="text-black/60 hover:text-black transition-colors">Home</Link>
                            <Link to="/shop" className="text-black/60 hover:text-black transition-colors">Shop</Link>
                            <Link to="/about" className="text-black/60 hover:text-black transition-colors">About</Link>
                            <Link to="/orders" className="text-black/60 hover:text-black transition-colors">Orders</Link>
                        </div>

                        <select
                            value={currency}
                            onChange={(event) => changeCurrency(event.target.value)}
                            aria-label="Choose currency"
                            className="bg-transparent border-b border-black/20 px-1 py-1 text-[9px] font-black tracking-widest outline-none cursor-pointer"
                        >
                            {Object.keys(currencies).map((code) => (
                                <option key={code} value={code}>{code}</option>
                            ))}
                        </select>

                        <Link to="/cart" className="relative text-black hover:scale-110 transition-transform">
                            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 text-black hover:scale-105 transition-transform"
                                >
                                    <UserAvatar name={user?.name} className="w-8 h-8 md:w-10 md:h-10 border border-black/5" />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-3 w-64 bg-white border border-black shadow-2xl py-2 z-50 animate-fadeIn">
                                        <div className="px-4 py-4 border-b border-gray-100 flex items-center space-x-3">
                                            <UserAvatar name={user?.name} className="w-10 h-10 border border-black/5 shadow-none" />
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Profile</p>
                                                <p className="font-bold truncate text-sm">{user?.name}</p>
                                            </div>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="flex items-center space-x-4 px-4 py-4 hover:bg-black hover:text-white transition group text-sm font-medium"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <UserCircle className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="flex items-center space-x-4 px-4 py-4 hover:bg-black hover:text-white transition group text-sm font-medium"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Package className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                                            <span>My Orders</span>
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center space-x-4 px-4 py-4 hover:bg-black hover:text-white transition group text-sm font-black border-t border-gray-50 mt-1"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                <span>ADMIN PANEL</span>
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => { logout(); setShowUserMenu(false); }}
                                            className="flex items-center space-x-4 px-4 py-4 hover:bg-red-600 hover:text-white transition group w-full text-sm font-medium border-t border-gray-50"
                                        >
                                            <LogOut className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="bg-black text-white px-3 sm:px-5 md:px-8 py-2 md:py-3 text-[9px] md:text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.2em] hover:bg-white hover:text-black border border-black transition-all"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Search Overlay */}
                {showSearch && (
                    <div className="md:hidden px-4 pb-4 animate-fadeIn">
                        <div className="flex items-center space-x-3 bg-gray-50 px-4 py-3 border border-black transition-all">
                            <Search className="text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search fragrances..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent outline-none text-sm flex-1 font-medium"
                                autoFocus
                            />
                            <button onClick={() => { setSearchQuery(''); setShowSearch(false); }}>
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                        
                        {/* Mobile Results */}
                        {searchResults.length > 0 && (
                            <div className="mt-2 bg-white border border-black shadow-2xl max-h-80 overflow-y-auto">
                                <div className="p-2">
                                    {searchResults.map((product) => (
                                        <button
                                            key={product._id}
                                            onClick={() => handleSearchSelect(product._id)}
                                            className="w-full flex items-center space-x-4 p-4 hover:bg-black hover:text-white transition border-b border-gray-50 last:border-0"
                                        >
                                            <img src={product.image} className="w-12 h-12 object-cover grayscale" />
                                            <div className="flex-1 text-left">
                                                <p className="font-bold text-sm tracking-tight">{product.name}</p>
                                                <p className="text-[10px] uppercase opacity-60 tracking-widest">{product.category}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="lg:hidden bg-white border-t border-black absolute w-full left-0 shadow-2xl z-40 animate-slideInDown">
                        <div className="flex flex-col p-8 space-y-6 uppercase tracking-[0.3em] text-[10px] font-black">
                            <Link to="/" onClick={() => setShowMobileMenu(false)} className="text-black/60 hover:text-black hover:translate-x-2 transition-all p-2 flex items-center justify-between group">
                                Home <span className="opacity-0 group-hover:opacity-100">→</span>
                            </Link>
                            <Link to="/shop" onClick={() => setShowMobileMenu(false)} className="text-black/60 hover:text-black hover:translate-x-2 transition-all p-2 flex items-center justify-between group">
                                Shop <span className="opacity-0 group-hover:opacity-100">→</span>
                            </Link>
                            <Link to="/about" onClick={() => setShowMobileMenu(false)} className="text-black/60 hover:text-black hover:translate-x-2 transition-all p-2 flex items-center justify-between group">
                                About <span className="opacity-0 group-hover:opacity-100">→</span>
                            </Link>
                            <Link to="/orders" onClick={() => setShowMobileMenu(false)} className="text-black/60 hover:text-black hover:translate-x-2 transition-all p-2 flex items-center justify-between group">
                                Orders <span className="opacity-0 group-hover:opacity-100">→</span>
                            </Link>
                            {isAuthenticated ? (
                                <>
                                    <div className="h-px bg-black/5 my-4"></div>
                                    <Link to="/profile" onClick={() => setShowMobileMenu(false)} className="text-black/60 hover:text-black hover:translate-x-2 transition-all p-2 flex items-center justify-between group">
                                        My Profile <span className="opacity-0 group-hover:opacity-100">→</span>
                                    </Link>
                                    {user?.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setShowMobileMenu(false)} className="bg-black text-white p-5 flex items-center justify-between tracking-[0.4em]">
                                            ADMIN PANEL <LayoutDashboard className="w-5 h-5" />
                                        </Link>
                                    )}
                                    <button onClick={() => { logout(); setShowMobileMenu(false); }} className="text-red-600 font-black p-2 text-left mt-8 border-t border-gray-100 pt-6">Logout from System</button>
                                </>
                            ) : (
                                <button
                                    onClick={() => { setShowAuthModal(true); setShowMobileMenu(false); }}
                                    className="bg-black text-white p-5 flex items-center justify-center tracking-[0.4em] mt-4"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </>
    );
};

export default Navbar;
