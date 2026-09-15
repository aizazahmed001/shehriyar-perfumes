const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true }, // Legacy base price retained for existing records
  regularPrice: { type: Number }, // MRP / Regular Price
  sellPrice: { type: Number }, // Actual Selling Price
  image: { type: String }, // Backwards compatibility / Main Image
  images: [{ type: String }], // Array of additional images
  category: { type: String, required: true },
  stock: { type: Number, default: 10 },
  variants: [{
    size: { type: String, enum: ['30ml', '50ml', '75ml', '100ml'], required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    sku: { type: String, trim: true }
  }],
  notes: {
    top: { type: String, default: '' },
    middle: { type: String, default: '' },
    base: { type: String, default: '' }
  },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  specifications: { type: mongoose.Schema.Types.Mixed, default: {} }, // Product specifications as key-value pairs
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
