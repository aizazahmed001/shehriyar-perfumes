const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/perfume-store';

const moreProducts = [
    {
        name: "Midnight Jasmine",
        description: "An intoxicating blend of night-blooming jasmine, musk, and a hint of vanilla.",
        price: "2499",
        sellPrice: 1999,
        regularPrice: 2499,
        image: "https://images.unsplash.com/photo-1608528577221-40f80a91f0ad?w=800&q=80",
        category: "Women's Perfumes",
        stock: 45
    },
    {
        name: "Velvet Rose & Oud",
        description: "A decadent combination of damask rose, smoky oud wood, and sweet praline.",
        price: "5999",
        sellPrice: 5499,
        regularPrice: 5999,
        image: "https://images.unsplash.com/photo-1595428774754-348055bb3201?w=800&q=80",
        category: "Women's Perfumes",
        stock: 12
    },
    {
        name: "Smoked Tobacco & Vanilla",
        description: "A sophisticated masculine scent with notes of pipe tobacco, tonka bean, and cacao.",
        price: "4499",
        sellPrice: 3999,
        regularPrice: 4499,
        image: "https://images.unsplash.com/photo-1592303637753-ce1e6b8a0ffb?w=800&q=80",
        category: "Men's Perfumes",
        stock: 25
    },
    {
        name: "Citrus Zest & Mint",
        description: "Vibrant and energetic fragrance with Calabrian bergamot, grapefruit, and fresh mint.",
        price: "2299",
        sellPrice: 1799,
        regularPrice: 2299,
        image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=800&q=80",
        category: "Men's Perfumes",
        stock: 60
    },
    {
        name: "Sandalwood & Myrrh",
        description: "Ancient, sacred aromas of rare Mysore sandalwood and Ethiopian myrrh.",
        price: "6499",
        sellPrice: 5999,
        regularPrice: 6499,
        image: "https://images.unsplash.com/photo-1588405864443-f45849887034?w=800&q=80",
        category: "Luxury Perfumes",
        stock: 8
    },
    {
        name: "Arctic Frost",
        description: "Crisp and cooling scent with notes of frozen pine, juniper berries, and cold air.",
        price: "2999",
        sellPrice: 2499,
        regularPrice: 2999,
        image: "https://images.unsplash.com/photo-1563170339-2c97a17ff490?w=800&q=80",
        category: "Men's Perfumes",
        stock: 40
    },
    {
        name: "Mystical Patchouli",
        description: "Earthcentric and spiritual, featuring deep patchouli, moss, and ambergris.",
        price: "3499",
        sellPrice: 2999,
        regularPrice: 3499,
        image: "https://images.unsplash.com/photo-1622618991746-95f74706599b?w=800&q=80",
        category: "Luxury Perfumes",
        stock: 18
    },
    {
        name: "Lifestyle Saffron",
        description: "A rare and precious scent lead by saffron threads, leather, and black violet.",
        price: "7999",
        sellPrice: 7499,
        regularPrice: 7999,
        image: "https://images.unsplash.com/photo-1594913366159-1832fd29188e?w=800&q=80",
        category: "Luxury Perfumes",
        stock: 5
    },
    {
        name: "The Royal Collection",
        description: "A magnificent gift set featuring our five most prestigious fragrances.",
        price: "15999",
        sellPrice: 14999,
        regularPrice: 15999,
        image: "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?w=800&q=80",
        category: "Gift Sets",
        stock: 10
    },
    {
        name: "Midnight Trio",
        description: "Perfectly matched scents for the evening: Jasmine, Amber, and Oud.",
        price: "6999",
        sellPrice: 5999,
        regularPrice: 6999,
        image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=800&q=80",
        category: "Gift Sets",
        stock: 20
    }
];

const seedMore = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if these products already exist to avoid duplicates
        for (const prod of moreProducts) {
            const exists = await Product.findOne({ name: prod.name });
            if (!exists) {
                const newProduct = new Product(prod);
                await newProduct.save();
                console.log(`Successfully added ${prod.name}`);
            } else {
                console.log(`${prod.name} already exists, skipping.`);
            }
        }

        console.log('Seeding finished.');
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedMore();
