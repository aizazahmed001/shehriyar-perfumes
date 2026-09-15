const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerName: { type: String, required: true }, // User's name
    email: { type: String, default: '' },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    deliveryFee: { type: Number, default: 0 },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
            size: { type: String, required: true },
            price: { type: Number, required: true }
        }
    ],
    subtotal: { type: Number },
    gst: { type: Number },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
    status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
