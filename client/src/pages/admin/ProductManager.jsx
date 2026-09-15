import React, { useEffect, useState } from 'react';
import api, { withAuth } from '../../lib/api';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, X, Archive, Tag, Package, Layers } from 'lucide-react';

const AdminProducts = () => {
    const { formatPrice } = useCurrency();
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', description: '', category: '', images: '', specifications: '',
        variants: [{ size: '30ml', price: '', stock: 0, sku: '' }],
        notes: { top: '', middle: '', base: '' }, featured: false, active: true
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products?includeInactive=true', withAuth(token));
            const sortedProducts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setProducts(sortedProducts);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Permanent deletion of this fragment?')) {
            try {
                await api.delete(`/products/${id}`, withAuth(token));
                fetchProducts();
            } catch (err) {
                console.error("Error deleting product", err);
            }
        }
    };

    const handleToggleActive = async (product) => {
        try {
            await api.put(`/products/${product._id}`, { active: product.active === false }, withAuth(token));
            fetchProducts();
        } catch (err) {
            console.error("Error updating product visibility", err);
        }
    };

    const handleEdit = (product) => {
        let specsString = '';
        if (product.specifications) {
            const specs = product.specifications instanceof Map
                ? Object.fromEntries(product.specifications)
                : product.specifications;

            specsString = Object.entries(specs)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n');
        }

        setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            images: product.images ? product.images.join(', ') : product.image,
            specifications: specsString,
            variants: product.variants?.length ? product.variants : [{ size: '100ml', price: product.sellPrice || product.price, stock: product.stock || 0, sku: '' }],
            notes: product.notes || { top: '', middle: '', base: '' },
            featured: Boolean(product.featured),
            active: product.active !== false
        });
        setEditingId(product._id);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const imageArray = formData.images.split(',').map(url => url.trim()).filter(url => url);

            const specsObj = {};
            if (formData.specifications && typeof formData.specifications === 'string') {
                formData.specifications.split(/\r?\n/).forEach(line => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return;

                    const colonIndex = trimmedLine.indexOf(':');
                    if (colonIndex > 0) {
                        const key = trimmedLine.substring(0, colonIndex).trim();
                        const value = trimmedLine.substring(colonIndex + 1).trim();
                        if (key) {
                            specsObj[key] = value;
                        }
                    }
                });
            }

            const variants = formData.variants
                .filter((variant) => variant.price !== '' && Number(variant.stock) >= 0)
                .map((variant) => ({ ...variant, price: Number(variant.price), stock: Number(variant.stock) }));
            if (!variants.length) throw new Error('Add at least one priced size variant');

            const productData = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                price: String(variants[variants.length - 1].price),
                sellPrice: variants[0].price,
                stock: variants.reduce((total, variant) => total + variant.stock, 0),
                images: imageArray,
                image: imageArray[0] || '',
                specifications: Object.keys(specsObj).length > 0 ? specsObj : {},
                variants,
                notes: formData.notes,
                featured: formData.featured,
                active: formData.active
            };

            if (editingId) {
                await api.put(`/products/${editingId}`, productData, withAuth(token));
            } else {
                await api.post('/products', productData, withAuth(token));
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ name: '', description: '', category: '', images: '', specifications: '', variants: [{ size: '30ml', price: '', stock: 0, sku: '' }], notes: { top: '', middle: '', base: '' }, featured: false, active: true });
            fetchProducts();
        } catch (err) {
            console.error("Error saving product", err);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const payload = new FormData();
        payload.append('image', file);
        setUploading(true);
        try {
            const response = await api.post('/uploads', payload, {
                ...withAuth(token),
                headers: { ...withAuth(token).headers, 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ ...formData, images: formData.images ? `${formData.images}, ${response.data.url}` : response.data.url });
        } catch (err) {
            console.error('Image upload failed', err);
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ name: '', description: '', category: '', images: '', specifications: '', variants: [{ size: '30ml', price: '', stock: 0, sku: '' }], notes: { top: '', middle: '', base: '' }, featured: false, active: true });
        setShowModal(true);
    }

    return (
        <div className="pb-20 md:pb-0 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 border-b border-black/5 pb-8">
                <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40">Inventory</p>
                    <h1 className="text-4xl font-serif">Product <span className="italic">Archive</span></h1>
                </div>
                <button
                    onClick={openAddModal}
                    className="monochrome-btn px-8 flex items-center gap-3 w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    Archive New Fragment
                </button>
            </div>

            <div className="mb-8">
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search products..."
                    className="w-full max-w-md border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                />
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-black/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="text-black/40 text-[9px] uppercase font-black border-b border-black/5">
                        <tr>
                            <th className="px-8 py-6 tracking-widest">Fragment</th>
                            <th className="px-8 py-6 tracking-widest">Category</th>
                            <th className="px-8 py-6 tracking-widest text-right">Value</th>
                            <th className="px-8 py-6 tracking-widest text-right">Units</th>
                            <th className="px-8 py-6 tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()) || product.category.toLowerCase().includes(search.toLowerCase())).map((product) => (
                            <tr key={product._id} className="group hover:bg-black/5 transition-colors">
                                <td className="px-8 py-8">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-12 h-16 border border-black/5 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                            <img src={product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/100x150?text=Fragrance'} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-wider">{product.name}</p>
                                            <p className="text-[9px] text-black/40 font-bold uppercase tracking-widest line-clamp-1 max-w-[200px]">{product.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-8">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] border border-black/10 px-3 py-1">{product.category}</span>
                                </td>
                                <td className="px-8 py-8 text-[11px] font-black tracking-widest text-right italic">{formatPrice(product.price)}</td>
                                <td className="px-8 py-8 text-[10px] font-black text-right text-black/40 italic">{product.stock}</td>
                                <td className="px-8 py-8 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(product)} className="text-black/40 hover:text-black transition-colors p-2"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleToggleActive(product)} className="text-black/40 hover:text-black transition-colors p-2" title={product.active === false ? 'Show product' : 'Hide product'}><Archive className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(product._id)} className="text-black/10 hover:text-red-600 transition-colors p-2"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-6">
                {products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()) || product.category.toLowerCase().includes(search.toLowerCase())).map((product) => (
                    <div key={product._id} className="bg-white border border-black/5 p-6 space-y-6">
                        <div className="flex gap-6">
                            <div className="w-20 h-28 border border-black/5 overflow-hidden flex-shrink-0 grayscale">
                                <img src={product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/200x300?text=Fragrance'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-[10px] font-black uppercase tracking-widest">{product.name}</h3>
                                <p className="text-[9px] text-black/40 font-bold uppercase leading-relaxed line-clamp-3">{product.description}</p>
                                <div className="pt-2">
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] border border-black/10 px-2 py-1">{product.category}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-6 border-t border-black/5">
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-1">Value</p>
                                    <p className="text-xs font-black tracking-tighter italic">{formatPrice(product.price)}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-1">Units</p>
                                    <p className="text-xs font-black tracking-tighter italic">{product.stock}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => handleEdit(product)} className="text-black/40 p-2"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleToggleActive(product)} className="text-black/40 p-2"><Archive className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(product._id)} className="text-black/10 p-2"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/95 overflow-y-auto h-full w-full z-50 flex items-start sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl p-10 relative my-8 animate-fadeIn">
                        <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                        
                        <div className="mb-12 space-y-2">
                            <p className="text-[8px] uppercase tracking-[0.4em] font-black text-black/40">Configuration</p>
                            <h2 className="text-3xl font-serif italic">{editingId ? 'Edit Fragment' : 'Archive New Fragment'}</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Fragment Name</label>
                                    <input required type="text" className="w-full px-4 py-3 border-b border-black/5 focus:border-black bg-transparent text-black font-medium text-sm outline-none transition-all placeholder:text-black/10" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Archive Classification</label>
                                    <input required type="text" className="w-full px-4 py-3 border-b border-black/5 focus:border-black bg-transparent text-black font-medium text-sm outline-none transition-all placeholder:text-black/10" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-center justify-between border-b border-black/5 pb-3">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-black/40">Size variants</label>
                                    <button type="button" onClick={() => setFormData({ ...formData, variants: [...formData.variants, { size: '50ml', price: '', stock: 0, sku: '' }] })} className="text-[9px] font-black uppercase tracking-widest underline">Add size</button>
                                </div>
                                {formData.variants.map((variant, index) => (
                                    <div key={`${variant.size}-${index}`} className="grid grid-cols-2 sm:grid-cols-4 gap-3 border border-black/5 p-4">
                                        <select value={variant.size} onChange={(event) => setFormData({ ...formData, variants: formData.variants.map((item, itemIndex) => itemIndex === index ? { ...item, size: event.target.value } : item) })} className="border border-black/10 px-3 py-2 text-xs outline-none">
                                            {['30ml', '50ml', '75ml', '100ml'].map((size) => <option key={size}>{size}</option>)}
                                        </select>
                                        <input required type="number" min="0" placeholder="Price" value={variant.price} onChange={(event) => setFormData({ ...formData, variants: formData.variants.map((item, itemIndex) => itemIndex === index ? { ...item, price: event.target.value } : item) })} className="border-b border-black/10 px-3 py-2 text-xs outline-none" />
                                        <input required type="number" min="0" placeholder="Stock" value={variant.stock} onChange={(event) => setFormData({ ...formData, variants: formData.variants.map((item, itemIndex) => itemIndex === index ? { ...item, stock: event.target.value } : item) })} className="border-b border-black/10 px-3 py-2 text-xs outline-none" />
                                        <input type="text" placeholder="SKU" value={variant.sku || ''} onChange={(event) => setFormData({ ...formData, variants: formData.variants.map((item, itemIndex) => itemIndex === index ? { ...item, sku: event.target.value } : item) })} className="border-b border-black/10 px-3 py-2 text-xs outline-none" />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {['top', 'middle', 'base'].map((note) => (
                                    <input key={note} type="text" placeholder={`${note[0].toUpperCase()}${note.slice(1)} notes`} value={formData.notes[note]} onChange={(event) => setFormData({ ...formData, notes: { ...formData.notes, [note]: event.target.value } })} className="border-b border-black/10 px-3 py-3 text-sm outline-none focus:border-black" />
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest">
                                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.featured} onChange={(event) => setFormData({ ...formData, featured: event.target.checked })} /> Featured</label>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.active} onChange={(event) => setFormData({ ...formData, active: event.target.checked })} /> Active</label>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Visual Identifiers (URLs, Comma separated)</label>
                                <textarea required className="w-full px-4 py-3 border-b border-black/5 focus:border-black bg-transparent text-black font-medium text-sm outline-none transition-all placeholder:text-black/10" rows="2" value={formData.images} onChange={e => setFormData({ ...formData, images: e.target.value })} placeholder="https://source.com/img1.jpg, https://source.com/img2.jpg"></textarea>
                                <label className="inline-flex cursor-pointer items-center gap-3 border border-black/10 px-4 py-3 text-[9px] font-black uppercase tracking-widest hover:border-black">
                                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleImageUpload} className="hidden" />
                                    {uploading ? 'Uploading...' : 'Upload from device'}
                                </label>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Olfactory Profile (Description)</label>
                                <textarea required className="w-full px-4 py-3 border-b border-black/5 focus:border-black bg-transparent text-black font-medium text-sm outline-none transition-all placeholder:text-black/10" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Detailed Composition (Key: Value, per line)</label>
                                <textarea className="w-full px-4 py-3 border-b border-black/5 focus:border-black bg-transparent text-black font-medium text-sm outline-none transition-all placeholder:text-black/10" rows="3" value={formData.specifications} onChange={e => setFormData({ ...formData, specifications: e.target.value })} placeholder="Concentration: 20%&#10;Origin: France&#10;Volume: 100ml"></textarea>
                            </div>
                            
                            <div className="pt-6">
                                <button type="submit" className="monochrome-btn w-full">{editingId ? 'Synchronize Fragment' : 'Commit to Archive'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
