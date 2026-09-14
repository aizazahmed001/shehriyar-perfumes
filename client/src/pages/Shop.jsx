import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Plus, Filter, SlidersHorizontal, Heart, Star } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductSkeleton from '../components/ProductSkeleton';
import { getLocalProductImage, getProductImage } from '../lib/productMedia';
import { demoProducts } from '../data/demoProducts';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [sortBy, setSortBy] = useState('default');
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterAndSort();
    }, [selectedCategory, sortBy, products]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5001/api/products');
            const productsData = res.data.length > 0 ? res.data : demoProducts;
            setProducts(productsData);
            setFilteredProducts(productsData);
        } catch (err) {
            console.error(err);
            setProducts(demoProducts);
            setFilteredProducts(demoProducts);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(products.map(p => p.category))];

    const filterAndSort = () => {
        let filtered = selectedCategory === 'All'
            ? products
            : products.filter(p => p.category === selectedCategory);

        if (sortBy === 'price-low') {
            filtered = [...filtered].sort((a, b) => {
                const priceA = a.sellPrice || Number(a.price) || 0;
                const priceB = b.sellPrice || Number(b.price) || 0;
                return priceA - priceB;
            });
        } else if (sortBy === 'price-high') {
            filtered = [...filtered].sort((a, b) => {
                const priceA = a.sellPrice || Number(a.price) || 0;
                const priceB = b.sellPrice || Number(b.price) || 0;
                return priceB - priceA;
            });
        } else if (sortBy === 'name') {
            filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredProducts(filtered);
    };

    return (
        <div className="pt-40 pb-20 bg-white min-h-screen">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center text-center mb-20 space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40">The Collection</p>
                    <h1 className="text-5xl font-serif">Curated <span className="italic">Fragments</span></h1>
                </div>

                {/* Filters */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 md:mb-16 gap-8 border-b border-black/5 pb-8">
                    <div className="w-full lg:w-auto overflow-x-auto no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
                        <div className="flex items-center gap-3 md:gap-4 min-w-max">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`text-[9px] md:text-[10px] uppercase tracking-widest px-5 md:px-6 py-2.5 font-black border transition-all ${selectedCategory === cat
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black/40 border-black/5 hover:border-black hover:text-black'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 w-full lg:w-auto justify-between lg:justify-end">
                        <span className="text-[10px] uppercase tracking-widest font-black text-black/40">Sort By</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-[10px] uppercase tracking-widest font-black px-4 py-2.5 border border-black/5 focus:border-black outline-none bg-white cursor-pointer"
                        >
                            <option value="default">Default</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Alphabetical</option>
                        </select>
                    </div>
                </div>

                {!loading && (
                    <div className="mb-12 text-[10px] uppercase tracking-[0.2em] font-black text-black/20">
                        Archive / <span className="text-black">{filteredProducts.length} items</span>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                    {loading ? (
                        <ProductSkeleton count={8} />
                    ) : (
                        filteredProducts.map((product) => {
                            const inWishlist = isInWishlist(product._id);
                            return (
                                <div key={product._id} className="group relative flex flex-col space-y-6 animate-fadeIn">
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
                                        <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest">
                                            {product.category}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                inWishlist ? removeFromWishlist(product._id) : addToWishlist(product);
                                            }}
                                            className={`absolute top-4 right-4 p-2 transition-all duration-300 bg-white/50 backdrop-blur-md opacity-0 group-hover:opacity-100 ${inWishlist ? 'text-red-600' : 'text-black hover:scale-125'}`}
                                        >
                                            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                                        </button>
                                    </Link>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <Link to={`/product/${product._id}`}>
                                                <h3 className="font-serif text-xl group-hover:italic transition-all duration-300">{product.name}</h3>
                                            </Link>
                                            <div className="flex items-center gap-2 opacity-40">
                                                <Star className="w-3 h-3 fill-black" />
                                                <span className="text-[10px] font-bold tracking-widest uppercase">4.8 / 5.0</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-black/5 pt-4">
                                            <div className="flex flex-col">
                                                {product.regularPrice && product.sellPrice && product.regularPrice > product.sellPrice ? (
                                                    <>
                                                        <span className="text-[10px] text-black/20 line-through">₹{product.regularPrice}</span>
                                                        <span className="text-lg font-bold tracking-tight">₹{product.sellPrice}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-lg font-bold tracking-tight">₹{product.sellPrice || product.price}</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="text-[10px] font-black uppercase tracking-widest hover:underline"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-32 border border-black/5 border-dashed">
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/20">The collection is currently empty for this category</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
