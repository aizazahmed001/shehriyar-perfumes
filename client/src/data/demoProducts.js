export const demoProducts = [
    {
        _id: 'demo-luxury-oud',
        name: 'Luxury Oud Wood',
        description: 'A rich, velvety composition of oud, sandalwood, and amber for evenings that call for quiet confidence.',
        price: 4999,
        regularPrice: 5999,
        sellPrice: 4299,
        image: '/perfumes/luxury_oud_wood.jpg',
        images: ['/perfumes/luxury_oud_wood.jpg'],
        category: 'Luxury Perfumes',
        stock: 12,
        specifications: { 'Volume': '100ml', 'Longevity': '10-12 hours', 'Concentration': 'Eau de Parfum' }
    },
    {
        _id: 'demo-midnight-jasmine',
        name: 'Midnight Jasmine',
        description: 'Luminous jasmine softened by white musk and a warm trace of vanilla, made for after-dark allure.',
        price: 3299,
        regularPrice: 3899,
        sellPrice: 2899,
        image: '/perfumes/midnight_jasmine.jpg',
        images: ['/perfumes/midnight_jasmine.jpg'],
        category: "Women's Perfumes",
        stock: 18,
        specifications: { 'Volume': '80ml', 'Longevity': '8-10 hours', 'Concentration': 'Eau de Parfum' }
    },
    {
        _id: 'demo-velvet-rose',
        name: 'Velvet Rose & Oud',
        description: 'A dramatic pairing of midnight rose and smoky oud with a lingering, beautifully textured dry-down.',
        price: 4599,
        sellPrice: 3999,
        image: '/perfumes/velvet_rose___oud.jpg',
        images: ['/perfumes/velvet_rose___oud.jpg'],
        category: 'Luxury Perfumes',
        stock: 9,
        specifications: { 'Volume': '100ml', 'Longevity': '10 hours', 'Concentration': 'Extrait de Parfum' }
    },
    {
        _id: 'demo-smoked-tobacco',
        name: 'Smoked Tobacco & Vanilla',
        description: 'Warm tobacco leaf, vanilla bean, and cedar create a confident signature with a modern edge.',
        price: 3799,
        regularPrice: 4299,
        sellPrice: 3499,
        image: '/perfumes/smoked_tobacco___vanilla.jpg',
        images: ['/perfumes/smoked_tobacco___vanilla.jpg'],
        category: "Men's Perfumes",
        stock: 15,
        specifications: { 'Volume': '100ml', 'Longevity': '9-11 hours', 'Concentration': 'Eau de Parfum' }
    },
    {
        _id: 'demo-citrus-mint',
        name: 'Citrus Zest & Mint',
        description: 'Bright bergamot and cool mint open into a clean, energetic fragrance for effortless daily wear.',
        price: 2499,
        sellPrice: 2199,
        image: '/perfumes/citrus_zest___mint.jpg',
        images: ['/perfumes/citrus_zest___mint.jpg'],
        category: "Men's Perfumes",
        stock: 24,
        specifications: { 'Volume': '75ml', 'Longevity': '6-8 hours', 'Concentration': 'Eau de Toilette' }
    },
    {
        _id: 'demo-sandalwood-myrrh',
        name: 'Sandalwood & Myrrh',
        description: 'Creamy sandalwood and resinous myrrh come together in a calm, meditative unisex scent.',
        price: 3599,
        sellPrice: 3199,
        image: '/perfumes/sandalwood___myrrh.jpg',
        images: ['/perfumes/sandalwood___myrrh.jpg'],
        category: 'Luxury Perfumes',
        stock: 11,
        specifications: { 'Volume': '90ml', 'Longevity': '8-10 hours', 'Concentration': 'Eau de Parfum' }
    },
    {
        _id: 'demo-arctic-frost',
        name: 'Arctic Frost',
        description: 'Crisp alpine air, juniper, and soft woods make this a refreshing signature for clear mornings.',
        price: 2799,
        regularPrice: 3199,
        sellPrice: 2499,
        image: '/perfumes/arctic_frost.jpg',
        images: ['/perfumes/arctic_frost.jpg'],
        category: "Men's Perfumes",
        stock: 20,
        specifications: { 'Volume': '100ml', 'Longevity': '7-9 hours', 'Concentration': 'Eau de Toilette' }
    },
    {
        _id: 'demo-midnight-trio',
        name: 'Midnight Trio',
        description: 'Three expressive travel-sized fragrances curated for discovery, gifting, and every change of mood.',
        price: 2999,
        sellPrice: 2699,
        image: '/perfumes/midnight_trio.jpg',
        images: ['/perfumes/midnight_trio.jpg'],
        category: 'Gift Sets',
        stock: 16,
        specifications: { 'Includes': '3 x 15ml', 'Longevity': 'Varies by fragrance', 'Concentration': 'Eau de Parfum' }
    }
];

export const getDemoProduct = (id) => demoProducts.find((product) => product._id === id);