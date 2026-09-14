import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const data = await login(formData.email, formData.password);
                if (data.user?.role === 'admin') {
                    navigate('/admin', { replace: true });
                } else {
                    navigate(from, { replace: true });
                }
            } else {
                await register(formData.name, formData.email, formData.password);
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white py-24 px-6 md:px-12">
            <div className="max-w-md w-full space-y-12 animate-fadeIn">
                <div className="text-center space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40">Perfume Store</p>
                    <h2 className="text-4xl font-serif">
                        {isLogin ? 'Welcome back.' : 'Join the elite.'}
                    </h2>
                    <p className="text-xs text-black/40 uppercase tracking-widest font-bold">
                        {isLogin ? 'Sign in to access your curated selection' : 'Create an account to begin your journey'}
                    </p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 border-b border-black/5 focus:border-black outline-none transition-all font-medium text-sm"
                                    placeholder="Jane Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 border-b border-black/5 focus:border-black outline-none transition-all font-medium text-sm"
                                placeholder="name@domain.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 border-b border-black/5 focus:border-black outline-none transition-all font-medium text-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-600 text-[10px] border border-red-100 bg-red-50 p-3 font-bold uppercase tracking-wider text-center">{error}</div>}

                    <button
                        type="submit"
                        className="monochrome-btn w-full"
                    >
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Create Account' : 'Back to Login'}
                    </button>
                    <div className="mt-8">
                        <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-black/20 hover:text-black transition-colors">
                            Return to Store
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
