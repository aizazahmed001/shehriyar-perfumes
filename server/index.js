const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist'); // Import Wishlist Model
const authMiddleware = require('./middleware/auth');

const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for dev simplicity
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/perfume-store';

// Database Connection
const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        console.error('Set MONGO_URI in server/.env and make sure MongoDB is running.');
        process.exit(1);
    }
};


// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Current User
app.get('/api/auth/me', authMiddleware, async (req, res) => {
    res.json(req.user);
});

// Update Profile
app.put('/api/auth/profile', authMiddleware, async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone, address },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ CART ROUTES ============

// Get User Cart
app.get('/api/cart', authMiddleware, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
            await cart.save();
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add to Cart
app.post('/api/cart', authMiddleware, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        // Re-fetch to populate product details
        const updatedCart = await Cart.findById(cart._id).populate('items.product');
        res.json(updatedCart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Cart Item Quantity
app.put('/api/cart/:productId', authMiddleware, async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === req.params.productId);

        if (itemIndex > -1) {
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();
            const updatedCart = await Cart.findById(cart._id).populate('items.product');
            res.json(updatedCart);
        } else {
            res.status(404).json({ error: 'Item not found in cart' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove Item from Cart
app.delete('/api/cart/:productId', authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate('items.product');
        res.json(updatedCart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Clear Cart
app.delete('/api/cart', authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ WISHLIST ROUTES ============

// Get Wishlist
app.get('/api/wishlist', authMiddleware, async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [] });
            await wishlist.save();
        }
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add to Wishlist
app.post('/api/wishlist/:productId', authMiddleware, async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id });
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [] });
        }

        if (!wishlist.products.includes(req.params.productId)) {
            wishlist.products.push(req.params.productId);
            await wishlist.save();
        }
        const updatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
        res.json(updatedWishlist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove from Wishlist
app.delete('/api/wishlist/:productId', authMiddleware, async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id });
        if (wishlist) {
            wishlist.products = wishlist.products.filter(id => id.toString() !== req.params.productId);
            await wishlist.save();
        }
        const updatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
        res.json(updatedWishlist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ PRODUCT ROUTES ============

// Get All Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Single Product
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Product (Seed or Admin)
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        io.emit('newProduct', savedProduct);
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Order
app.post('/api/orders', authMiddleware, async (req, res) => {
    try {
        const orderData = {
            ...req.body,
            user: req.user._id // Force user ID from auth token
        };
        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();

        // Notify admin/users via Socket.io
        io.emit('newResults', { message: 'New Order Placed!', order: savedOrder });
        io.emit('orderUpdate', savedOrder);

        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bulk Delete Orders (Admin)
app.post('/api/admin/orders/bulk-delete', async (req, res) => {
    try {
        const { orderIds } = req.body;
        if (!orderIds || !Array.isArray(orderIds)) {
            return res.status(400).json({ error: 'Invalid order request' });
        }

        await Order.deleteMany({ _id: { $in: orderIds } });
        res.json({ message: 'Orders deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Orders
app.get('/api/orders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('products.productId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Get All Orders (Admin)
app.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate('products.productId').populate('user', 'name email');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cancel Order (User)
app.put('/api/orders/:id/cancel', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) return res.status(404).json({ error: 'Order not found' });

        if (order.status !== 'Pending') {
            return res.status(400).json({ error: 'Order cannot be cancelled' });
        }

        order.status = 'Cancelled';
        await order.save();
        io.emit('orderUpdate', order);
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Order Status
app.put('/api/orders/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        io.emit('orderUpdate', updatedOrder); // Notify clients
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Order (Admin)
app.delete('/api/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Product
app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Product
app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Seed Route (Optional, for quick setup)
app.get('/api/seed', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        if (count > 0) return res.json({ message: 'Products already exist' });

        const sampleProducts = [
            {
                name: "Luxury Oud Wood",
                description: "Deep, rich oud wood with notes of cedar and sandalwood.",
                price: "4999",
                sellPrice: 4499,
                regularPrice: 4999,
                image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
                category: "Luxury Perfumes",
                stock: 20
            },
            {
                name: "Floral Mist",
                description: "Light and airy floral fragrance for women.",
                price: "1599",
                sellPrice: 1299,
                regularPrice: 1599,
                image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
                category: "Women's Perfumes",
                stock: 50
            },
            {
                name: "Golden Amber",
                description: "Warm and inviting amber fragrance with a hint of vanilla.",
                price: "3499",
                sellPrice: 2999,
                regularPrice: 3499,
                image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
                category: "Luxury Perfumes",
                stock: 15
            }
        ];

        await Product.insertMany(sampleProducts);
        res.json({ message: 'Sample products seeded!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


const PORT = process.env.PORT || 5001;

connectToDatabase().then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
