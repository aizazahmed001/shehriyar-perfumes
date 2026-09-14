import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Heart, ShoppingBag, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserAvatar from '../components/UserAvatar';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const { wishlist } = useWishlist();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(formData);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            phone: user?.phone || '',
            address: user?.address || ''
        });
        setIsEditing(false);
    };

    return (
        <div className="pt-40 pb-20 bg-white min-h-screen">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col items-center text-center mb-20 space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40">Custodian</p>
                    <h1 className="text-5xl font-serif">Member <span className="italic">Profile</span></h1>
                </div>

                <div className="grid md:grid-cols-3 gap-16 lg:gap-24">
                    {/* Profile Card */}
                    <div className="md:col-span-1 space-y-12">
                        <div className="bg-white border border-black/5 p-12 text-center space-y-8 animate-fadeIn">
                            <div className="relative inline-block">
                                <div className="p-1 border border-black/10 rounded-full scale-110">
                                    <UserAvatar 
                                        name={user?.name} 
                                        className="w-32 h-32 border border-black/5" 
                                    />
                                </div>
                                <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white shadow-sm"></div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif mb-1">{user?.name}</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">{user?.email}</p>
                            </div>
                            <div className="inline-block px-4 py-1 border border-black text-[9px] font-black uppercase tracking-[0.3em]">
                                {user?.role === 'admin' ? 'Curator' : 'Collector'}
                            </div>
                        </div>

                        <div className="border border-black/5 p-8 flex items-center gap-6">
                            <Calendar className="w-5 h-5 opacity-20" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Member Since</p>
                                <p className="text-xs font-bold uppercase tracking-wider mt-1">
                                    {new Date(user?.createdAt).toLocaleDateString('en-GB', {
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details & Wishlist */}
                    <div className="md:col-span-2 space-y-20">
                        {/* Personal Information */}
                        <div className="space-y-12">
                            <div className="flex justify-between items-end border-b border-black/5 pb-4">
                                <h3 className="text-xl font-serif italic text-black">Personal Attributes</h3>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors flex items-center gap-2"
                                    >
                                        <Edit2 className="w-3 h-3" />
                                        Edit Details
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCancel}
                                        className="text-[10px] font-black uppercase tracking-widest text-red-600/40 hover:text-red-600 transition-colors flex items-center gap-2"
                                    >
                                        <X className="w-3 h-3" />
                                        Discard Changes
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Full Identity</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border-b border-black/5 focus:border-black bg-transparent text-black font-medium text-sm outline-none transition-all disabled:text-black/40"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Correspondence</label>
                                    <input
                                        type="email"
                                        disabled
                                        value={user?.email}
                                        className="w-full px-4 py-3 border-b border-black/5 bg-transparent text-black/40 font-medium text-sm outline-none"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Contact String</label>
                                    <input
                                        type="tel"
                                        disabled={!isEditing}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Add contact number"
                                        className="w-full px-4 py-3 border-b border-black/5 focus:border-black bg-transparent text-black font-medium text-sm outline-none transition-all disabled:text-black/40 placeholder:text-black/10"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Primary Archive Location</label>
                                    <textarea
                                        disabled={!isEditing}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Add shipping destination"
                                        rows="2"
                                        className="w-full px-4 py-3 border-b border-black/5 focus:border-black bg-transparent text-black font-medium text-sm outline-none transition-all disabled:text-black/40 placeholder:text-black/10"
                                    ></textarea>
                                </div>

                                {isEditing && (
                                    <div className="md:col-span-2 pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="monochrome-btn px-12"
                                        >
                                            {loading ? 'Synchronizing...' : 'Save Attributes'}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Wishlist Section */}
                        <div className="space-y-12">
                            <div className="flex items-center justify-between border-b border-black/5 pb-4">
                                <h3 className="text-xl font-serif italic text-black flex items-center gap-4">
                                    Monitored Collection
                                </h3>
                                <div className="text-[10px] font-black uppercase tracking-widest text-black/20">
                                    {wishlist.length} Fragments
                                </div>
                            </div>

                            {wishlist.length === 0 ? (
                                <div className="text-center py-20 border border-dashed border-black/10">
                                    <ShoppingBag className="w-12 h-12 mx-auto text-black/5 mb-6" />
                                    <p className="text-[10px] uppercase tracking-widest font-black text-black/20 mb-8">No fragments monitored.</p>
                                    <Link to="/shop" className="text-[10px] font-black uppercase tracking-widest text-black hover:tracking-[0.2em] transition-all">
                                        Browse Archive →
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {wishlist.map((item) => (
                                        <Link
                                            key={item._id}
                                            to={`/product/${item._id}`}
                                            className="group flex gap-6 p-6 border border-black/5 hover:border-black transition-all animate-fadeIn"
                                        >
                                            <div className="w-16 h-20 border border-black/5 overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.image || item.images?.[0]}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-black group-hover:italic transition-all line-clamp-1">
                                                    {item.name}
                                                </h4>
                                                <p className="text-[8px] text-black/40 font-black uppercase tracking-widest mt-1">{item.category}</p>
                                                <p className="text-sm font-bold tracking-tighter mt-4 text-black">₹{item.price}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
