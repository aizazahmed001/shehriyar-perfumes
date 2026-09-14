const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/perfume-store';

// Verified high-quality unsplash IDs for fragrance
const v = {
    oud: "photo-1541643600914-78b084683601",
    jasmine: "photo-1608528577221-40f80a91f0ad",
    rose: "photo-1595428774754-348055bb3201",
    tobacco: "photo-1592303637753-ce1e6b8a0ffb",
    citrus: "photo-1590736704728-f4730bb30770",
    sandalwood: "photo-1588405864443-f45849887034",
    frost: "photo-1563170339-2c97a17ff490",
    patchouli: "photo-1622618991746-95f74706599b",
    saffron: "photo-1594913366159-1832fd29188e",
    royal: "photo-1544465544-1b71aee9dfa3",
    trio: "photo-1615484477778-ca3b77940c25",
    amber: "photo-1592945403244-b3fbafd7f539",
    ocean: "photo-1616950244458-963c0d836371",
    floral: "photo-1594035910387-fea47794261f"
};

const getUrl = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const updates = [
    { name: "Luxury Oud Wood", img: getUrl(v.oud) },
    { name: "Midnight Jasmine", img: getUrl(v.jasmine) },
    { name: "Velvet Rose & Oud", img: getUrl(v.rose) },
    { name: "Smoked Tobacco & Vanilla", img: getUrl(v.tobacco) },
    { name: "Citrus Zest & Mint", img: getUrl(v.citrus) },
    { name: "Sandalwood & Myrrh", img: getUrl(v.sandalwood) },
    { name: "Arctic Frost", img: getUrl(v.frost) },
    { name: "Mystical Patchouli", img: getUrl(v.patchouli) },
    { name: "Lifestyle Saffron", img: getUrl(v.saffron) },
    { name: "The Royal Collection", img: getUrl(v.royal) },
    { name: "Midnight Trio", img: getUrl(v.trio) },
    { name: "Golden Amber", img: getUrl(v.amber) },
    { name: "Oceanic Breeze", img: getUrl(v.ocean) },
    { name: "Floral Mist", img: getUrl(v.floral) }
];

const fixImages = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        for (const up of updates) {
            const product = await Product.findOne({ name: up.name });
            if (product) {
                product.image = up.img;
                product.images = [up.img];
                await product.save();
                console.log(`Updated images for ${up.name}`);
            }
        }

        console.log('Finished updating images.');
        process.exit();
    } catch (err) {
        console.error('Fix failed:', err);
        process.exit(1);
    }
};

fixImages();
