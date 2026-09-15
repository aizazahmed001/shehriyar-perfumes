import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose, mode: initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'login') {
                const data = await login(formData.email, formData.password);
                if (data.user?.role === 'admin') {
                    navigate('/admin');
                }
            } else {
                await register(formData.name, formData.email, formData.password);
            }
            onClose();
            setFormData({ name: '', email: '', password: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-black/10 shadow-2xl w-full max-w-md p-7 sm:p-10 relative animate-fadeIn">
                <button onClick={onClose} aria-label="Close login panel" className="absolute top-5 right-5 text-black/25 hover:text-black transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-10">
                    <p className="text-[9px] uppercase tracking-[0.45em] font-black text-black/35 mb-4">Sheriyar Perfume</p>
                    <h2 className="text-4xl font-serif text-black mb-3">
                        {mode === 'login' ? 'Welcome back.' : 'Create an account.'}
                    </h2>
                    <p className="text-[10px] text-black/40 uppercase tracking-[0.18em] font-bold">
                        {mode === 'login' ? 'Sign in to continue your selection' : 'Begin your fragrance journey'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 mb-5 text-[10px] uppercase tracking-wider font-bold border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {mode === 'register' && (
                        <div className="space-y-1">
                            <label className="block text-[10px] uppercase tracking-widest font-black text-black/45 ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 border-b border-black/15 bg-transparent focus:border-black outline-none transition font-medium text-sm"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Mitul Aghara"
                            />
                        </div>
                    )}

                        <div className="space-y-1">
                            <label className="block text-[10px] uppercase tracking-widest font-black text-black/45 ml-1">Email Address</label>
                        <input
                            type="email"
                            required
                                className="w-full px-4 py-3 border-b border-black/15 bg-transparent focus:border-black outline-none transition font-medium text-sm"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="you@example.com"
                        />
                    </div>

                        <div className="space-y-1">
                            <label className="block text-[10px] uppercase tracking-widest font-black text-black/45 ml-1">Password</label>
                        <input
                            type="password"
                            required
                                className="w-full px-4 py-3 border-b border-black/15 bg-transparent focus:border-black outline-none transition font-medium text-sm"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="monochrome-btn w-full py-4 disabled:opacity-50"
                    >
                        {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-black/45 text-[10px] uppercase tracking-widest font-bold">
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            onClick={() => {
                                setMode(mode === 'login' ? 'register' : 'login');
                                setError('');
                            }}
                            className="text-black font-black hover:italic transition-all"
                        >
                            {mode === 'login' ? 'Sign up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
