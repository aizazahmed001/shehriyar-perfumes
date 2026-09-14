import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import {
    Plus, Sparkles, TrendingUp, Star, ShoppingBag, Zap, Award, Truck,
    ArrowRight, Heart, Smartphone, Watch, Headphones, Monitor, CheckCircle
} from 'lucide-react';
import socket from '../lib/socket';
import ProductSkeleton from '../components/ProductSkeleton';
import { getLocalProductImage, getProductImage } from '../lib/productMedia';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();

        socket.on('newProduct', (product) => {
            setProducts(prev => [...prev, product]);
        });

        return () => socket.off('newProduct');
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5001/api/products');
            if (res.data && res.data.length === 0) {
                // If no products, try to seed or handle empty state
                await axios.get('http://localhost:5001/api/seed');
                const retry = await axios.get('http://localhost:5001/api/products');
                setProducts(retry.data);
                setFeaturedProducts(retry.data.length > 4 ? retry.data.slice(0, 4) : retry.data);
            } else {
                setProducts(res.data);
                setFeaturedProducts(res.data.length > 4 ? res.data.slice(0, 4) : res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { name: 'Luxury Perfumes', icon: Sparkles },
        { name: "Men's Perfumes", icon: Zap },
        { name: "Women's Perfumes", icon: Heart },
        { name: 'Gift Sets', icon: ShoppingBag },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 border-b border-black/5">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-12 animate-fadeIn">
                        <div className="space-y-4">
                            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40">Exclusive Collection 2026</p>
                            <h1 className="luxury-title">
                                THE ART OF <br />
                                <span className="italic font-light">Fragrance</span>
                            </h1>
                        </div>

                        <p className="text-sm md:text-base text-black/60 max-w-xl leading-loose font-medium px-4">
                            Step into a world of sensory elegance. Discover our curated collection of artisanal perfumes, crafted for those who define luxury by the depth of their character.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 pt-4">
                            <a href="#products" className="monochrome-btn">
                                Explore Collection
                            </a>
                            <a href="/shop" className="monochrome-btn-outline">
                                View Selection
                            </a>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-10 -translate-y-1/2 opacity-[0.03] pointer-events-none hidden xl:block">
                    <span className="text-[200px] font-serif font-black italic">ESSENCE</span>
                </div>
            </section>

            {/* Features Strip */}
            <section className="py-16 bg-black text-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {[
                            { icon: Truck, title: "COMPLIMENTARY DELIVERY", desc: "On all premium orders" },
                            { icon: Zap, title: "PRIORITY SHIPPING", desc: "Arrives in 48 hours" },
                            { icon: Award, title: "AUTHENTICITY", desc: "100% Original Selection" },
                            { icon: ShoppingBag, title: "LUXURY WRAPPING", desc: "Elegant gift options" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center space-y-4">
                                <item.icon className="w-5 h-5 opacity-40" />
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-black tracking-widest">{item.title}</h3>
                                    <p className="text-[9px] text-white/40 font-bold tracking-wider">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section id="categories" className="py-32">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40">Categories</p>
                            <h2 className="text-4xl font-serif">Signature <span className="italic">Selections</span></h2>
                        </div>
                        <p className="text-sm text-black/40 max-w-sm">From deep, woody notes to ethereal floral mists, find the scent that speaks your story.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/5 border border-black/5">
                        {categories.map((cat, idx) => (
                            <Link key={idx} to={`/shop?category=${cat.name}`} className="group relative bg-white p-8 md:p-12 hover:bg-black transition-colors duration-700 text-center">
                                <div className="space-y-4 md:space-y-6">
                                    <cat.icon className="w-5 h-5 md:w-6 md:h-6 mx-auto group-hover:text-white transition-colors duration-700 opacity-40 group-hover:opacity-100" />
                                    <h3 className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-serif group-hover:text-white transition-colors duration-700">{cat.name}</h3>
                                </div>
                                <div className="mt-6 md:mt-8 md:opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
                                    <span className="text-[10px] text-black group-hover:text-white/60 font-black tracking-widest uppercase">Explore</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section id="products" className="py-20 md:py-32 bg-gray-50/50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center text-center mb-16 md:mb-24 space-y-4">
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40">The Gallery</p>
                        <h2 className="text-3xl md:text-5xl font-serif">Featured <span className="italic">Fragrances</span></h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {loading ? (
                            <ProductSkeleton count={4} />
                        ) : (
                            products.slice(0, 8).map((product) => (
                                <div key={product._id} className="group relative flex flex-col space-y-5 md:space-y-6 animate-fadeIn">
                                    <Link to={`/product/${product._id}`} className="block relative aspect-[4/5] bg-white overflow-hidden border border-black/5 group-hover:border-black transition-colors duration-500">
                                        <img
                                            src={getProductImage(product)}
                                            onError={(event) => {
                                                event.currentTarget.onerror = null;
                                                event.currentTarget.src = getLocalProductImage(product);
                                            }}
                                            alt={product.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-90 group-hover:opacity-100"
                                        />
                                        <div className="absolute top-4 left-4 bg-black text-white px-2 py-1 text-[7px] font-black uppercase tracking-widest">
                                            {product.category}
                                        </div>
                                    </Link>

                                    <div className="space-y-3 md:space-y-4">
                                        <div className="space-y-1">
                                            <Link to={`/product/${product._id}`}>
                                                <h3 className="font-serif text-lg md:text-xl group-hover:italic transition-all duration-300">{product.name}</h3>
                                            </Link>
                                            <div className="flex items-center gap-2 opacity-40">
                                                <Star className="w-3 h-3 fill-black text-black" />
                                                <span className="text-[10px] font-bold tracking-widest uppercase">4.8 / 5.0</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-black/5 pt-3 md:pt-4">
                                            <p className="text-base md:text-lg font-bold tracking-tight">₹{product.sellPrice || product.price}</p>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="text-[10px] font-black uppercase tracking-widest hover:underline"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-24 text-center">
                        <Link to="/shop" className="monochrome-btn-outline inline-flex items-center gap-4">
                            View All Masterpieces <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
