import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Archive, Tag, Package, Layers } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: '', images: '', stock: 10, specifications: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/products');
            const sortedProducts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setProducts(sortedProducts);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Permanent deletion of this fragment?')) {
            try {
                await axios.delete(`http://localhost:5001/api/products/${id}`);
                fetchProducts();
            } catch (err) {
                console.error("Error deleting product", err);
            }
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
            price: product.price,
            category: product.category,
            images: product.images ? product.images.join(', ') : product.image,
            stock: product.stock,
            specifications: specsString
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

            const { name, description, price, category, stock } = formData;

            const productData = {
                name,
                description,
                price,
                category,
                stock,
                images: imageArray,
                image: imageArray[0] || '',
                specifications: Object.keys(specsObj).length > 0 ? specsObj : {}
            };

            if (editingId) {
                await axios.put(`http://localhost:5001/api/products/${editingId}`, productData);
            } else {
                await axios.post('http://localhost:5001/api/products', productData);
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ name: '', description: '', price: '', category: '', images: '', stock: 10, specifications: '' });
            fetchProducts();
        } catch (err) {
            console.error("Error saving product", err);
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ name: '', description: '', price: '', category: '', images: '', stock: 10, specifications: '' });
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
                        {products.map((product) => (
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
                                <td className="px-8 py-8 text-[11px] font-black tracking-widest text-right italic">₹{product.price}</td>
                                <td className="px-8 py-8 text-[10px] font-black text-right text-black/40 italic">{product.stock}</td>
                                <td className="px-8 py-8 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(product)} className="text-black/40 hover:text-black transition-colors p-2"><Edit2 className="w-4 h-4" /></button>
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
                {products.map((product) => (
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
                                    <p className="text-xs font-black tracking-tighter italic">₹{product.price}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-1">Units</p>
                                    <p className="text-xs font-black tracking-tighter italic">{product.stock}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => handleEdit(product)} className="text-black/40 p-2"><Edit2 className="w-4 h-4" /></button>
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
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Value (₹)</label>
                                    <input required type="text" className="w-full px-4 py-3 border-b border-black/5 focus:border-black bg-transparent text-black font-medium text-sm outline-none transition-all placeholder:text-black/10" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Available Units</label>
                                    <input type="number" className="w-full px-4 py-3 border-b border-black/5 focus:border-black bg-transparent text-black font-medium text-sm outline-none transition-all placeholder:text-black/10" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-black text-black/40 ml-1">Visual Identifiers (URLs, Comma separated)</label>
                                <textarea required className="w-full px-4 py-3 border-b border-black/5 focus:border-black bg-transparent text-black font-medium text-sm outline-none transition-all placeholder:text-black/10" rows="2" value={formData.images} onChange={e => setFormData({ ...formData, images: e.target.value })} placeholder="https://source.com/img1.jpg, https://source.com/img2.jpg"></textarea>
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
