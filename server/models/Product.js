const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true }, // Keeping as string for "₹999" format ease or number (for backward compatibility)
  regularPrice: { type: Number }, // MRP / Regular Price
  sellPrice: { type: Number }, // Actual Selling Price
  image: { type: String }, // Backwards compatibility / Main Image
  images: [{ type: String }], // Array of additional images
  category: { type: String, required: true },
  stock: { type: Number, default: 10 },
  specifications: { type: mongoose.Schema.Types.Mixed, default: {} }, // Product specifications as key-value pairs
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
