const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/perfume-store';

const debugProducts = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({}, 'name image images _id');
        console.log(`Found ${products.length} products total.`);

        products.forEach((p, index) => {
            console.log(`[${index + 1}] ID: ${p._id} Name: ${p.name}`);
            console.log(`    Image: ${p.image}`);
            console.log(`    Images: ${p.images && p.images.length > 0 ? p.images[0] : 'EMPTY'}`);
        });

        process.exit();
    } catch (err) {
        console.error('Debug failed:', err);
        process.exit(1);
    }
};

debugProducts();
