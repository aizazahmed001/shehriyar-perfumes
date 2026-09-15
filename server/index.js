const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { Server } = require('socket.io');
require('dotenv').config();

const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist');

const authMiddleware = require('./middleware/auth');
const optionalAuth = require('./middleware/optionalAuth');
const adminMiddleware = require('./middleware/admin');

const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);

// =====================================================
// UPLOADS
// =====================================================

const uploadDir = path.join(__dirname, 'uploads');

fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
    dest: uploadDir,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        const allowedTypes = /^image\/(jpeg|png|webp|gif)$/;

        if (allowedTypes.test(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Only JPEG, PNG, WEBP and GIF images are allowed'));
        }
    }
});

// =====================================================
// ENVIRONMENT VARIABLES
// =====================================================

if (!process.env.MONGO_URI) {
    throw new Error(
        'MONGO_URI is required. Configure MongoDB Atlas in Railway Variables.'
    );
}

if (!process.env.JWT_SECRET) {
    throw new Error(
        'JWT_SECRET is required. Configure it in Railway Variables.'
    );
}

const MONGO_URI = process.env.MONGO_URI;

// =====================================================
// CORS
// =====================================================

const allowedOrigin = process.env.CLIENT_URL || true;

app.use(
    cors({
        origin: allowedOrigin,
        credentials: true
    })
);

app.use(express.json());

app.use('/uploads', express.static(uploadDir));

// =====================================================
// SOCKET.IO
// =====================================================

const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const normalizeStatus = (status) => {
    return String(status || '').toLowerCase();
};

const getVariant = (product, size) => {
    if (product.variants?.length) {
        return product.variants.find(
            (variant) => variant.size === size
        );
    }

    if (size === 'default' || size === '100ml') {
        return {
            size: size === 'default' ? '100ml' : size,
            price: Number(product.sellPrice || product.price) || 0,
            stock: Number(product.stock) || 0
        };
    }

    return null;
};

const validateCustomer = ({
    customerName,
    phone,
    email,
    city,
    address
}) => {
    if (
        !customerName?.trim() ||
        !phone?.trim() ||
        !city?.trim() ||
        !address?.trim()
    ) {
        return 'Full name, phone, city, and complete address are required';
    }

    if (!/^\+?[0-9\s()-]{7,20}$/.test(phone.trim())) {
        return 'Enter a valid phone number';
    }

    if (
        email &&
        !/^\S+@\S+\.\S+$/.test(email.trim())
    ) {
        return 'Enter a valid email address';
    }

    return null;
};

// =====================================================
// DATABASE CONNECTION
// =====================================================

const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log('MongoDB Connected');
    } catch (err) {
        console.error(
            'MongoDB Connection Error:',
            err.message
        );

        process.exit(1);
    }
};

// =====================================================
// AUTH ROUTES
// =====================================================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (
            !name?.trim() ||
            !/^\S+@\S+\.\S+$/.test(email || '') ||
            !password ||
            password.length < 8
        ) {
            return res.status(400).json({
                error:
                    'Name, valid email, and password of at least 8 characters are required'
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                error: 'Email already registered'
            });
        }

        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

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
        res.status(500).json({
            error: err.message
        });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

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
        res.status(500).json({
            error: err.message
        });
    }
});

// Current User
app.get('/api/auth/me', authMiddleware, async (req, res) => {
    res.json(req.user);
});

// Update Profile
app.put('/api/auth/profile', authMiddleware, async (req, res) => {
    try {
        const { name, phone, address } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                name,
                phone,
                address
            },
            {
                new: true
            }
        ).select('-password');

        res.json(user);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// =====================================================
// CART ROUTES
// =====================================================

// Get Cart
app.get('/api/cart', authMiddleware, async (req, res) => {
    try {
        let cart = await Cart.findOne({
            user: req.user._id
        }).populate('items.product');

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: []
            });

            await cart.save();
        }

        res.json(cart);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// Add to Cart
app.post('/api/cart', authMiddleware, async (req, res) => {
    try {
        const {
            productId,
            quantity = 1,
            size = 'default'
        } = req.body;

        if (
            !mongoose.isValidObjectId(productId) ||
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            return res.status(400).json({
                error: 'Invalid product, size, or quantity'
            });
        }

        const product = await Product.findById(productId);

        if (!product || !product.active) {
            return res.status(404).json({
                error: 'Product not found'
            });
        }

        if (!getVariant(product, size)) {
            return res.status(400).json({
                error: 'Selected size is unavailable'
            });
        }

        let cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: []
            });
        }

        const itemIndex = cart.items.findIndex(
            (item) =>
                item.product.toString() === productId &&
                item.size === size
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                size
            });
        }

        await cart.save();

        const updatedCart = await Cart.findById(
            cart._id
        ).populate('items.product');

        res.json(updatedCart);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// Update Cart Item
app.put(
    '/api/cart/:productId/:size',
    authMiddleware,
    async (req, res) => {
        try {
            const { quantity } = req.body;

            const cart = await Cart.findOne({
                user: req.user._id
            });

            if (!cart) {
                return res.status(404).json({
                    error: 'Cart not found'
                });
            }

            const itemIndex = cart.items.findIndex(
                (item) =>
                    item.product.toString() ===
                        req.params.productId &&
                    item.size === req.params.size
            );

            if (itemIndex > -1) {
                if (quantity > 0) {
                    cart.items[itemIndex].quantity = quantity;
                } else {
                    cart.items.splice(itemIndex, 1);
                }

                await cart.save();

                const updatedCart = await Cart.findById(
                    cart._id
                ).populate('items.product');

                res.json(updatedCart);
            } else {
                res.status(404).json({
                    error: 'Item not found in cart'
                });
            }
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// Remove Cart Item
app.delete(
    '/api/cart/:productId/:size',
    authMiddleware,
    async (req, res) => {
        try {
            const cart = await Cart.findOne({
                user: req.user._id
            });

            if (!cart) {
                return res.status(404).json({
                    error: 'Cart not found'
                });
            }

            cart.items = cart.items.filter(
                (item) =>
                    !(
                        item.product.toString() ===
                            req.params.productId &&
                        item.size === req.params.size
                    )
            );

            await cart.save();

            const updatedCart = await Cart.findById(
                cart._id
            ).populate('items.product');

            res.json(updatedCart);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// Clear Cart
app.delete('/api/cart', authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.json({
            message: 'Cart cleared'
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// =====================================================
// WISHLIST ROUTES
// =====================================================

// Get Wishlist
app.get('/api/wishlist', authMiddleware, async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({
            user: req.user._id
        }).populate('products');

        if (!wishlist) {
            wishlist = new Wishlist({
                user: req.user._id,
                products: []
            });

            await wishlist.save();
        }

        res.json(wishlist);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// Add Wishlist Item
app.post(
    '/api/wishlist/:productId',
    authMiddleware,
    async (req, res) => {
        try {
            let wishlist = await Wishlist.findOne({
                user: req.user._id
            });

            if (!wishlist) {
                wishlist = new Wishlist({
                    user: req.user._id,
                    products: []
                });
            }

            if (
                !wishlist.products.some(
                    (id) =>
                        id.toString() ===
                        req.params.productId
                )
            ) {
                wishlist.products.push(
                    req.params.productId
                );

                await wishlist.save();
            }

            const updatedWishlist =
                await Wishlist.findById(
                    wishlist._id
                ).populate('products');

            res.json(updatedWishlist);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// Remove Wishlist Item
app.delete(
    '/api/wishlist/:productId',
    authMiddleware,
    async (req, res) => {
        try {
            let wishlist = await Wishlist.findOne({
                user: req.user._id
            });

            if (!wishlist) {
                return res.status(404).json({
                    error: 'Wishlist not found'
                });
            }

            wishlist.products =
                wishlist.products.filter(
                    (id) =>
                        id.toString() !==
                        req.params.productId
                );

            await wishlist.save();

            const updatedWishlist =
                await Wishlist.findById(
                    wishlist._id
                ).populate('products');

            res.json(updatedWishlist);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// =====================================================
// PRODUCT ROUTES
// =====================================================

// Get Products
app.get(
    '/api/products',
    optionalAuth,
    async (req, res) => {
        try {
            const includeInactive =
                req.query.includeInactive === 'true' &&
                req.user?.role === 'admin';

            const filter = includeInactive
                ? {}
                : {
                      active: {
                          $ne: false
                      }
                  };

            const products = await Product.find(filter)
                .sort({
                    featured: -1,
                    createdAt: -1
                });

            res.json(products);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// Get Single Product
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        );

        if (
            !product ||
            product.active === false
        ) {
            return res.status(404).json({
                error: 'Product not found'
            });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// Upload Product Image
app.post(
    '/api/uploads',
    adminMiddleware,
    upload.single('image'),
    (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                error: 'A valid image file is required'
            });
        }

        const imageUrl =
            `${req.protocol}://${req.get('host')}` +
            `/uploads/${req.file.filename}`;

        res.status(201).json({
            url: imageUrl
        });
    }
);

// Add Product
app.post(
    '/api/products',
    adminMiddleware,
    async (req, res) => {
        try {
            const newProduct = new Product(req.body);

            const savedProduct =
                await newProduct.save();

            io.emit(
                'newProduct',
                savedProduct
            );

            res.status(201).json(
                savedProduct
            );
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// Update Product
app.put(
    '/api/products/:id',
    adminMiddleware,
    async (req, res) => {
        try {
            const updatedProduct =
                await Product.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    {
                        new: true
                    }
                );

            if (!updatedProduct) {
                return res.status(404).json({
                    error: 'Product not found'
                });
            }

            io.emit(
                'productUpdate',
                updatedProduct
            );

            res.json(updatedProduct);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// Delete Product
app.delete(
    '/api/products/:id',
    adminMiddleware,
    async (req, res) => {
        try {
            const deletedProduct =
                await Product.findByIdAndDelete(
                    req.params.id
                );

            if (!deletedProduct) {
                return res.status(404).json({
                    error: 'Product not found'
                });
            }

            io.emit(
                'productDelete',
                req.params.id
            );

            res.json({
                message: 'Product deleted'
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// =====================================================
// ORDER ROUTES
// =====================================================

// Create Order
app.post(
    '/api/orders',
    optionalAuth,
    async (req, res) => {
        try {
            const {
                customerName,
                phone,
                email = '',
                city,
                address,
                products = [],
                paymentMethod = 'cod'
            } = req.body;

            const customerError =
                validateCustomer({
                    customerName,
                    phone,
                    email,
                    city,
                    address
                });

            if (customerError) {
                return res.status(400).json({
                    error: customerError
                });
            }

            if (paymentMethod !== 'cod') {
                return res.status(400).json({
                    error:
                        'Only Cash on Delivery is available'
                });
            }

            if (
                !Array.isArray(products) ||
                products.length === 0
            ) {
                return res.status(400).json({
                    error: 'Your cart is empty'
                });
            }

            const orderProducts = [];
            let subtotal = 0;

            for (const item of products) {
                if (
                    !mongoose.isValidObjectId(
                        item.productId
                    ) ||
                    !Number.isInteger(
                        item.quantity
                    ) ||
                    item.quantity < 1
                ) {
                    return res.status(400).json({
                        error:
                            'Invalid product or quantity'
                    });
                }

                const product =
                    await Product.findById(
                        item.productId
                    );

                const variant =
                    product &&
                    getVariant(
                        product,
                        item.size
                    );

                if (
                    !product ||
                    product.active === false ||
                    !variant
                ) {
                    return res.status(400).json({
                        error:
                            'A selected product or size is unavailable'
                    });
                }

                if (
                    variant.stock <
                    item.quantity
                ) {
                    return res.status(400).json({
                        error:
                            `${product.name} (${variant.size}) is out of stock`
                    });
                }

                subtotal +=
                    variant.price *
                    item.quantity;

                orderProducts.push({
                    productId: product._id,
                    size: variant.size,
                    quantity: item.quantity,
                    price: variant.price
                });
            }

            const deliveryFee = 0;
            const gst = Math.round(
                subtotal * 0.18
            );

            const totalAmount =
                subtotal +
                gst +
                deliveryFee;

            const orderData = {
                customerName:
                    customerName.trim(),
                phone: phone.trim(),
                email: email.trim(),
                city: city.trim(),
                address: address.trim(),
                products: orderProducts,
                subtotal,
                gst,
                deliveryFee,
                totalAmount,
                paymentMethod,
                status: 'pending',
                user:
                    req.user?._id || null
            };

            const newOrder =
                new Order(orderData);

            const savedOrder =
                await newOrder.save();

            // Reduce stock
            for (const item of orderProducts) {
                const product =
                    await Product.findById(
                        item.productId
                    );

                if (!product) continue;

                if (product.variants?.length) {
                    const variant =
                        getVariant(
                            product,
                            item.size
                        );

                    if (variant) {
                        variant.stock -=
                            item.quantity;

                        await product.save();
                    }
                } else {
                    product.stock -=
                        item.quantity;

                    await product.save();
                }
            }

            io.emit(
                'newResults',
                {
                    message:
                        'New Order Placed!',
                    order: savedOrder
                }
            );

            io.emit(
                'orderUpdate',
                savedOrder
            );

            res.status(201).json(
                savedOrder
            );
        } catch (err) {
            console.error(
                'Create order error:',
                err
            );

            res.status(500).json({
                error: err.message
            });
        }
    }
);

// Get User Orders
app.get(
    '/api/orders',
    authMiddleware,
    async (req, res) => {
        try {
            const orders =
                await Order.find({
                    user: req.user._id
                })
                    .sort({
                        createdAt: -1
                    })
                    .populate(
                        'products.productId'
                    );

            res.json(orders);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// Cancel Order
app.put(
    '/api/orders/:id/cancel',
    authMiddleware,
    async (req, res) => {
        try {
            const order =
                await Order.findOne({
                    _id: req.params.id,
                    user: req.user._id
                });

            if (!order) {
                return res.status(404).json({
                    error: 'Order not found'
                });
            }

            if (
                normalizeStatus(
                    order.status
                ) !== 'pending'
            ) {
                return res.status(400).json({
                    error:
                        'Order cannot be cancelled'
                });
            }

            order.status = 'cancelled';

            await order.save();

            io.emit(
                'orderUpdate',
                order
            );

            res.json(order);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// =====================================================
// ADMIN ORDER ROUTES
// =====================================================

// Get All Orders
app.get(
    '/api/admin/orders',
    adminMiddleware,
    async (req, res) => {
        try {
            const orders =
                await Order.find()
                    .sort({
                        createdAt: -1
                    })
                    .populate(
                        'products.productId'
                    )
                    .populate(
                        'user',
                        'name email'
                    );

            res.json(orders);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// Bulk Delete Orders
app.post(
    '/api/admin/orders/bulk-delete',
    adminMiddleware,
    async (req, res) => {
        try {
            const { orderIds } =
                req.body;

            if (
                !Array.isArray(
                    orderIds
                )
            ) {
                return res.status(400).json({
                    error:
                        'Invalid order request'
                });
            }

            await Order.deleteMany({
                _id: {
                    $in: orderIds
                }
            });

            res.json({
                message:
                    'Orders deleted successfully'
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// Admin Statistics
app.get(
    '/api/admin/stats',
    adminMiddleware,
    async (req, res) => {
        try {
            const [
                totalProducts,
                orders
            ] = await Promise.all([
                Product.countDocuments(),
                Order.find()
                    .select(
                        'status totalAmount customerName createdAt'
                    )
                    .sort({
                        createdAt: -1
                    })
            ]);

            res.json({
                totalProducts,
                totalOrders:
                    orders.length,

                pendingOrders:
                    orders.filter(
                        (order) =>
                            normalizeStatus(
                                order.status
                            ) ===
                            'pending'
                    ).length,

                deliveredOrders:
                    orders.filter(
                        (order) =>
                            normalizeStatus(
                                order.status
                            ) ===
                            'delivered'
                    ).length,

                totalRevenue:
                    orders
                        .filter(
                            (order) =>
                                normalizeStatus(
                                    order.status
                                ) !==
                                'cancelled'
                        )
                        .reduce(
                            (
                                sum,
                                order
                            ) =>
                                sum +
                                (order.totalAmount ||
                                    0),
                            0
                        ),

                recentOrders:
                    orders.slice(0, 8)
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// Admin Customers
app.get(
    '/api/admin/customers',
    adminMiddleware,
    async (req, res) => {
        try {
            const customers =
                await User.find({
                    role: 'customer'
                })
                    .select(
                        '-password'
                    )
                    .sort({
                        createdAt: -1
                    });

            res.json(customers);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// Update Order Status
app.put(
    '/api/orders/:id',
    adminMiddleware,
    async (req, res) => {
        try {
            const allowedStatuses = [
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled'
            ];

            const status =
                normalizeStatus(
                    req.body.status
                );

            if (
                !allowedStatuses.includes(
                    status
                )
            ) {
                return res.status(400).json({
                    error:
                        'Invalid order status'
                });
            }

            const updatedOrder =
                await Order.findByIdAndUpdate(
                    req.params.id,
                    {
                        status
                    },
                    {
                        new: true
                    }
                );

            if (!updatedOrder) {
                return res.status(404).json({
                    error:
                        'Order not found'
                });
            }

            io.emit(
                'orderUpdate',
                updatedOrder
            );

            res.json(updatedOrder);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// Delete Order
app.delete(
    '/api/orders/:id',
    adminMiddleware,
    async (req, res) => {
        try {
            const deletedOrder =
                await Order.findByIdAndDelete(
                    req.params.id
                );

            if (!deletedOrder) {
                return res.status(404).json({
                    error:
                        'Order not found'
                });
            }

            res.json({
                message:
                    'Order deleted successfully'
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// =====================================================
// SEED ROUTE
// =====================================================

app.get(
    '/api/seed',
    adminMiddleware,
    async (req, res) => {
        try {
            const count =
                await Product.countDocuments();

            if (count > 0) {
                return res.json({
                    message:
                        'Products already exist'
                });
            }

            const sampleProducts = [
                {
                    name: 'Luxury Oud Wood',
                    description:
                        'Deep, rich oud wood with notes of cedar and sandalwood.',
                    price: 4999,
                    sellPrice: 4499,
                    regularPrice: 4999,
                    image:
                        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
                    category:
                        'Luxury Perfumes',
                    stock: 20
                },
                {
                    name: 'Floral Mist',
                    description:
                        'Light and airy floral fragrance for women.',
                    price: 1599,
                    sellPrice: 1299,
                    regularPrice: 1599,
                    image:
                        'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80',
                    category:
                        "Women's Perfumes",
                    stock: 50
                },
                {
                    name: 'Golden Amber',
                    description:
                        'Warm and inviting amber fragrance with a hint of vanilla.',
                    price: 3499,
                    sellPrice: 2999,
                    regularPrice: 3499,
                    image:
                        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
                    category:
                        'Luxury Perfumes',
                    stock: 15
                }
            ];

            await Product.insertMany(
                sampleProducts
            );

            res.json({
                message:
                    'Sample products seeded!'
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message:
            'Sheryar Perfume API is running'
    });
});

// =====================================================
// ROOT
// =====================================================

app.get('/', (req, res) => {
    res.json({
        message:
            'Sheryar Perfume API is running',
        status: 'online'
    });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error:
            err.message ||
            'Internal server error'
    });
});

// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    await connectToDatabase();

    server.listen(
        PORT,
        '0.0.0.0',
        () => {
            console.log(
                `Server running on port ${PORT}`
            );
        }
    );
};

startServer();