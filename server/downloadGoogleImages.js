const google = require('googlethis');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/perfume-store';
const PUBLIC_DIR = path.join(__dirname, '../client/public/perfumes');

const downloadImage = async (url, filename) => {
    try {
        const response = await axios({ 
            url, 
            responseType: 'stream', 
            timeout: 5000, 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const filePath = path.join(PUBLIC_DIR, filename);
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (err) {
        throw new Error(`Failed to download ${url}: ${err.message}`);
    }
};

const run = async () => {
    await mongoose.connect(MONGO_URI);
    const products = await Product.find({});
    console.log(`Processing ${products.length} products...`);

    for (const p of products) {
        console.log(`\nSearching Google for: ${p.name}`);
        try {
            const query = `${p.name} luxury perfume bottle clear background`;
            const options = { page: 0, safe: false, additional_params: { hl: 'en', tbm: 'isch' } };
            const images = await google.image(query, options);
            
            if (!images || images.length === 0) {
                console.log('No images found on Google.');
                continue;
            }

            let downloaded = false;
            // Try top 10 results until one successfully downloads
            for (let i = 0; i < Math.min(images.length, 10); i++) {
                const img = images[i];
                // Accept obvious image links
                if (img.url.match(/\.(jpeg|jpg|png|webp)$/i) || img.url.includes('images.unsplash.com') || img.url.includes('media')) {
                    const ext = '.jpg'; // enforce extension for simplicity
                    const filename = `${p.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}${ext}`;
                    
                    try {
                        console.log(`Trying [${i}]: ${img.url.substring(0, 80)}...`);
                        await downloadImage(img.url, filename);
                        console.log(`✔️ Successfully saved ${filename}`);
                        
                        p.image = `/perfumes/${filename}`;
                        p.images = [`/perfumes/${filename}`];
                        await p.save();
                        downloaded = true;
                        break;
                    } catch (e) {
                        console.log(`❌ Failed this url, trying next...`);
                    }
                }
            }
            if(!downloaded) console.log(`Could not download any image for ${p.name}`);

        } catch (e) {
            console.error(`Google search failed for ${p.name}`, e.message);
        }
    }
    
    console.log('\nAll done! Databases updated with local images.');
    process.exit();
};

run();
