const localImageNames = {
    'Luxury Oud Wood': 'luxury_oud_wood.jpg',
    'Midnight Jasmine': 'midnight_jasmine.jpg',
    'Velvet Rose & Oud': 'velvet_rose___oud.jpg',
    'Smoked Tobacco & Vanilla': 'smoked_tobacco___vanilla.jpg',
    'Citrus Zest & Mint': 'citrus_zest___mint.jpg',
    'Sandalwood & Myrrh': 'sandalwood___myrrh.jpg',
    'Arctic Frost': 'arctic_frost.jpg',
    'Mystical Patchouli': 'mystical_patchouli.jpg',
    'Lifestyle Saffron': 'lifestyle_saffron.jpg',
    'The Royal Collection': 'the_royal_collection.jpg',
    'Midnight Trio': 'midnight_trio.jpg',
    'Golden Amber': 'golden_amber.jpg',
    'Floral Mist': 'floral_mist.jpg'
};

export const getProductImage = (product) => {
    if (!product) return '/perfumes/luxury_oud_wood.jpg';
    return product.image || product.images?.[0] || `/perfumes/${localImageNames[product.name] || 'luxury_oud_wood.jpg'}`;
};

export const getLocalProductImage = (product) => `/perfumes/${localImageNames[product?.name] || 'luxury_oud_wood.jpg'}`;