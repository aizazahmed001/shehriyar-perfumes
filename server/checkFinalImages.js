const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/perfume-store';

const checkFinalImages = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const products = await Product.find({}, 'name image');
        let allGood = true;
        
        products.forEach(p => {
            console.log(`- ${p.name}: ${p.image}`);
            if (!p.image.startsWith('/perfumes/')) {
                allGood = false;
                console.log(`  [WARNING] External or missing image for ${p.name}`);
            }
        });
        
        console.log(`\nLocal Image Check: ${allGood ? 'PASSED' : 'FAILED'}`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkFinalImages();
