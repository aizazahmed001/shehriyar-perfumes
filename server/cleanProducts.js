const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/perfume-store';

const keepNames = [
    "Luxury Oud Wood",
    "Floral Mist",
    "Golden Amber"
];

const cleanDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const result = await Product.deleteMany({ name: { $nin: keepNames } });
        
        console.log(`Deleted ${result.deletedCount} products.`);
        console.log(`Kept only: ${keepNames.join(', ')}`);
        
        process.exit();
    } catch (err) {
        console.error('Failed to clean DB:', err);
        process.exit(1);
    }
};

cleanDB();
