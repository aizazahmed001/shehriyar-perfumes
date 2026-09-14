const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/perfume-store';

const originalImages = [
    { name: "Luxury Oud Wood", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80" },
    { name: "Floral Mist", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80" },
    { name: "Golden Amber", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80" }
];

const restoreOldImages = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        for (const item of originalImages) {
            const product = await Product.findOne({ name: item.name });
            if (product) {
                product.image = item.img;
                product.images = [item.img];
                await product.save();
                console.log(`Restored old image for: ${item.name}`);
            } else {
                console.log(`Could not find ${item.name} in DB.`);
            }
        }

        console.log('Finished restoring images.');
        process.exit();
    } catch (err) {
        console.error('Failed to restore images:', err);
        process.exit(1);
    }
};

restoreOldImages();
