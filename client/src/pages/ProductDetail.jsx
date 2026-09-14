import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ShoppingBag, Truck, Shield, ArrowLeft, Star, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getLocalProductImage, getProductImage } from '../lib/productMedia';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/products/${id}`);
                setProduct(res.data);
                if (res.data.images && res.data.images.length > 0) {
                    setSelectedImage(res.data.images[0]);
                } else {
                    setSelectedImage(res.data.image);
                }
            } catch (err) {
                console.error("Failed to fetch product", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleWishlistClick = () => {
        if (!product) return;
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-t-2 border-black rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return <div className="min-h-screen flex items-center justify-center font-serif italic text-2xl">Fragment not found</div>;

    const inWishlist = isInWishlist(product._id);
    const images = product.images && product.images.length > 0 ? product.images : [product.image];

    return (
        <div className="bg-white min-h-screen pt-40 pb-20">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Back Link */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-12 flex items-center text-[10px] uppercase tracking-[0.4em] font-black text-black/40 hover:text-black transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-4" />
                    Back to Collection
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 lg:gap-32">
                    {/* Left Column: Image Gallery */}
                    <div className="space-y-8 md:space-y-12">
                        <div className="bg-white aspect-square border border-black/5 flex items-center justify-center relative overflow-hidden group">
                            <img
                                src={selectedImage || getProductImage(product)}
                                onError={(event) => {
                                    event.currentTarget.onerror = null;
                                    event.currentTarget.src = getLocalProductImage(product);
                                }}
                                alt={product.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105"
                            />
                            <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-3 bg-white/80 backdrop-blur-md rounded-full text-black hover:bg-black hover:text-white transition-all">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4 md:gap-6">
                                {images.map((img, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedImage(img)}
                                        className={`bg-white aspect-square border cursor-pointer transition-all overflow-hidden ${selectedImage === img ? 'border-black' : 'border-black/5 hover:border-black/20'}`}
                                    >
                                        <img
                                            src={img || getLocalProductImage(product)}
                                            onError={(event) => {
                                                event.currentTarget.onerror = null;
                                                event.currentTarget.src = getLocalProductImage(product);
                                            }}
                                            alt={`Thumbnail ${i + 1}`}
                                            className="w-full h-full object-cover grayscale"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6 md:mb-8 flex items-center space-x-4">
                            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40 border-b border-black/40 pb-1">
                                {product.category}
                            </span>
                            <div className="flex items-center gap-2 opacity-40">
                                <Star className="w-3 h-3 fill-black text-black" />
                                <span className="text-[10px] font-black tracking-widest uppercase">4.8 / 5.0</span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-serif mb-6 md:mb-8 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-4 mb-10 md:mb-12">
                            <span className="text-2xl md:text-3xl font-bold tracking-tight">₹{product.sellPrice || product.price}</span>
                            {product.regularPrice && product.sellPrice && product.regularPrice > product.sellPrice && (
                                <span className="text-base md:text-lg text-black/20 line-through">₹{product.regularPrice}</span>
                            )}
                        </div>

                        <p className="text-xs md:text-sm font-medium text-black/60 leading-loose mb-10 md:mb-12 max-w-lg">
                            {product.description}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12 sm:mb-16">
                            <button
                                onClick={() => {
                                    addToCart(product);
                                    toast.success(`${product.name} added to cart!`);
                                }}
                                disabled={product.stock === 0}
                                className="monochrome-btn flex-1 py-4"
                            >
                                {product.stock === 0 ? 'Out of Archive' : 'Add to Selection'}
                            </button>
                            <button
                                onClick={handleWishlistClick}
                                className={`p-4 sm:p-5 sm:px-8 border transition-all duration-500 flex items-center justify-center ${inWishlist
                                    ? 'bg-black text-white border-black'
                                    : 'border-black/5 hover:border-black text-black/20 hover:text-black'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-10 md:py-12 border-y border-black/5">
                            <div className="flex items-start gap-4">
                                <Truck className="w-5 h-5 opacity-20 mt-1" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Global Shipping</p>
                                    <p className="text-[9px] text-black/40 font-bold tracking-wider mt-1 uppercase">Complimentary on all orders</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Shield className="w-5 h-5 opacity-20 mt-1" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Quality Assurance</p>
                                    <p className="text-[9px] text-black/40 font-bold tracking-wider mt-1 uppercase">100% Authentic Guaranteed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Tabs */}
                <div className="mt-24 md:mt-32">
                    <div className="flex border-b border-black/5 mb-12 md:mb-16 overflow-x-auto no-scrollbar">
                        {['description', 'specifications', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 md:pb-6 px-6 md:px-10 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black transition-all relative ${activeTab === tab
                                    ? 'text-black'
                                    : 'text-black/20 hover:text-black/40'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 w-full h-px bg-black"></span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-3xl animate-fadeIn">
                        {activeTab === 'description' && (
                            <div className="prose prose-sm max-w-none text-black/60 leading-loose">
                                <p className="text-lg font-serif italic text-black mb-8">Concept & Story</p>
                                <p>{product.description}</p>
                            </div>
                        )}
                        {activeTab === 'specifications' && (
                            <div className="space-y-4">
                                <p className="text-lg font-serif italic text-black mb-8">Technical Attributes</p>
                                {product.specifications && (typeof product.specifications === 'object') ? (
                                    Object.keys(product.specifications).length > 0 ? (
                                        Object.entries(product.specifications).map(([key, value], i) => (
                                            <div key={i} className="flex justify-between py-4 border-b border-black/5">
                                                <span className="text-[10px] uppercase tracking-widest font-black text-black/40">{key}</span>
                                                <span className="text-xs font-bold uppercase tracking-wider">{String(value)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-black/40 uppercase tracking-widest italic py-8">No specific attributes listed.</p>
                                    )
                                ) : (
                                    <p className="text-xs text-black/40 uppercase tracking-widest italic py-8">Attributes pending update.</p>
                                )}
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="space-y-12">
                                <p className="text-lg font-serif italic text-black mb-8">Shared Experiences</p>
                                {[1, 2].map((review) => (
                                    <div key={review} className="border-b border-black/5 pb-12 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-black text-black" />)}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Exquisite selection</span>
                                        </div>
                                        <p className="text-xs text-black/60 leading-relaxed max-w-xl">"A truly unique balance of notes. The longevity is impressive, staying with me throughout the day in a subtle, sophisticated way."</p>
                                        <p className="text-[8px] text-black/20 font-black uppercase tracking-[0.3em] mt-6">Verified Collector / 03.2024</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
