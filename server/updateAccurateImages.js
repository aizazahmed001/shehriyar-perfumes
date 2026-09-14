const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/perfume-store';

const v = {
    oud: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=800",
    jasmine: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&q=80&w=800",
    rose: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800",
    tobacco: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800",
    citrus: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&q=80&w=800",
    sandalwood: "https://images.unsplash.com/photo-1547881335-93722e11e0e8?auto=format&fit=crop&q=80&w=800",
    frost: "https://images.unsplash.com/photo-1616611588523-ddc4202970cc?auto=format&fit=crop&q=80&w=800",
    patchouli: "https://images.unsplash.com/photo-1614742491100-366a70eafdec?auto=format&fit=crop&q=80&w=800",
    saffron: "https://images.unsplash.com/photo-1595428707305-fbbc1c76f827?auto=format&fit=crop&q=80&w=800",
    royal: "https://images.unsplash.com/photo-1590736704728-f472d5118576?auto=format&fit=crop&q=80&w=800",
    trio: "https://images.unsplash.com/photo-1590736910051-546db959648a?auto=format&fit=crop&q=80&w=800",
    amber: "https://images.unsplash.com/photo-1616111116231-1f953535948f?auto=format&fit=crop&q=80&w=800",
    ocean: "https://images.unsplash.com/photo-1616462444534-118e7e729007?auto=format&fit=crop&q=80&w=800",
    floral: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800"
};

const updates = [
    { name: "Luxury Oud Wood", img: v.oud },
    { name: "Midnight Jasmine", img: v.jasmine },
    { name: "Velvet Rose & Oud", img: v.rose },
    { name: "Smoked Tobacco & Vanilla", img: v.tobacco },
    { name: "Citrus Zest & Mint", img: v.citrus },
    { name: "Sandalwood & Myrrh", img: v.sandalwood },
    { name: "Arctic Frost", img: v.frost },
    { name: "Mystical Patchouli", img: v.patchouli },
    { name: "Lifestyle Saffron", img: v.saffron },
    { name: "The Royal Collection", img: v.royal },
    { name: "Midnight Trio", img: v.trio },
    { name: "Golden Amber", img: v.amber },
    { name: "Oceanic Breeze", img: v.ocean },
    { name: "Floral Mist", img: v.floral }
];

const updateAccurateImages = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        for (const up of updates) {
            const product = await Product.findOne({ name: up.name });
            if (product) {
                product.image = up.img;
                product.images = [up.img];
                await product.save();
                console.log(`Updated accurate image for ${up.name}`);
            }
        }

        console.log('Finished updating accurate images.');
        process.exit();
    } catch (err) {
        console.error('Update failed:', err);
        process.exit(1);
    }
};

updateAccurateImages();
