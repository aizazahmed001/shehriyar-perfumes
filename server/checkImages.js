const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/perfume-store';

const checkImages = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({}, 'name image images category');
        console.log(`Found ${products.length} products total.`);

        for (const prod of products) {
            console.log(`Product: ${prod.name}`);
            console.log(`- image: ${prod.image || 'MISSING'}`);
            console.log(`- images: ${prod.images && prod.images.length > 0 ? prod.images.join(', ') : 'EMPTY'}`);
            console.log('---');
        }

        process.exit();
    } catch (err) {
        console.error('Check failed:', err);
        process.exit(1);
    }
};

checkImages();
