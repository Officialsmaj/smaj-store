// SMAJ STORE - Mock Product Data
// Part of SMAJ Ecosystem

// Categories Data
const categories = [
    { id: 1, name: 'Electronics', icon: 'fa-mobile-alt', count: 1250 },
    { id: 2, name: 'Fashion', icon: 'fa-tshirt', count: 2300 },
    { id: 3, name: 'Home & Garden', icon: 'fa-couch', count: 890 },
    { id: 4, name: 'Sports', icon: 'fa-running', count: 560 },
    { id: 5, name: 'Beauty', icon: 'fa-spa', count: 720 },
    { id: 6, name: 'Books', icon: 'fa-book', count: 1100 },
    { id: 7, name: 'Toys', icon: 'fa-gamepad', count: 450 },
    { id: 8, name: 'Food', icon: 'fa-utensils', count: 380 },
    { id: 9, name: 'Health', icon: 'fa-heartbeat', count: 290 },
    { id: 10, name: 'Automotive', icon: 'fa-car', count: 670 },
    { id: 11, name: 'Jewelry', icon: 'fa-gem', count: 340 },
    { id: 12, name: 'Services', icon: 'fa-concierge-bell', count: 180 }
];

// Products Data
const products = [
    {
        id: 1,
        name: 'Wireless Bluetooth Earbuds Pro',
        description: 'Premium wireless earbuds with active noise cancellation, 24-hour battery life, and crystal clear sound quality.',
        price: 49.99,
        originalPrice: 79.99,
        category: 'Electronics',
        categoryId: 1,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
        seller: {
            name: 'TechZone Store',
            verified: true,
            rating: 4.8,
            totalSales: 2340
        },
        rating: 4.5,
        reviews: 892,
        stock: 150,
        isNew: false,
        isSale: true,
        featured: true,
        trending: true
    },
    {
        id: 2,
        name: 'Smart Watch Series X',
        description: 'Advanced fitness tracker with heart rate monitor, GPS, sleep tracking, and 7-day battery.',
        price: 199.99,
        originalPrice: 249.99,
        category: 'Electronics',
        categoryId: 1,
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
        seller: {
            name: 'Gadget Hub',
            verified: true,
            rating: 4.9,
            totalSales: 1850
        },
        rating: 4.7,
        reviews: 1250,
        stock: 85,
        isNew: true,
        isSale: false,
        featured: true,
        trending: true
    },
    {
        id: 3,
        name: 'Designer Leather Handbag',
        description: 'Genuine leather handbag with multiple compartments, adjustable strap, and elegant design.',
        price: 89.99,
        originalPrice: 129.99,
        category: 'Fashion',
        categoryId: 2,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
        seller: {
            name: 'Fashion Forward',
            verified: true,
            rating: 4.6,
            totalSales: 980
        },
        rating: 4.4,
        reviews: 456,
        stock: 45,
        isNew: false,
        isSale: true,
        featured: true,
        trending: false
    },
    {
        id: 4,
        name: 'Premium Coffee Maker',
        description: 'Professional-grade coffee maker with built-in grinder, thermal carafe, and programmable settings.',
        price: 159.99,
        originalPrice: null,
        category: 'Home & Garden',
        categoryId: 3,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
        seller: {
            name: 'Home Essentials',
            verified: true,
            rating: 4.7,
            totalSales: 670
        },
        rating: 4.6,
        reviews: 234,
        stock: 30,
        isNew: true,
        isSale: false,
        featured: false,
        trending: true
    },
    {
        id: 5,
        name: 'Yoga Mat Premium',
        description: 'Extra thick eco-friendly yoga mat with alignment lines and non-slip surface.',
        price: 34.99,
        originalPrice: 49.99,
        category: 'Sports',
        categoryId: 4,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
        seller: {
            name: 'FitLife Store',
            verified: true,
            rating: 4.5,
            totalSales: 1520
        },
        rating: 4.3,
        reviews: 890,
        stock: 200,
        isNew: false,
        isSale: true,
        featured: false,
        trending: true
    },
    {
        id: 6,
        name: 'Organic Skincare Set',
        description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer. All-natural ingredients.',
        price: 75.99,
        originalPrice: 99.99,
        category: 'Beauty',
        categoryId: 5,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
        seller: {
            name: 'Beauty Bliss',
            verified: true,
            rating: 4.8,
            totalSales: 890
        },
        rating: 4.7,
        reviews: 567,
        stock: 75,
        isNew: false,
        isSale: true,
        featured: true,
        trending: false
    },
    {
        id: 7,
        name: 'Bestseller Novel Collection',
        description: 'Collection of top 5 bestselling novels of 2025. Perfect for book lovers.',
        price: 45.99,
        originalPrice: null,
        category: 'Books',
        categoryId: 6,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        seller: {
            name: 'Book Haven',
            verified: true,
            rating: 4.9,
            totalSales: 3200
        },
        rating: 4.8,
        reviews: 1230,
        stock: 120,
        isNew: true,
        isSale: false,
        featured: false,
        trending: true
    },
    {
        id: 8,
        name: 'Gaming Console Pro',
        description: 'Next-gen gaming console with 1TB storage, 4K graphics, and exclusive game titles.',
        price: 449.99,
        originalPrice: 499.99,
        category: 'Electronics',
        categoryId: 1,
        image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400',
        seller: {
            name: 'GameZone Pro',
            verified: true,
            rating: 4.9,
            totalSales: 560
        },
        rating: 4.9,
        reviews: 780,
        stock: 25,
        isNew: false,
        isSale: true,
        featured: true,
        trending: true
    },
    {
        id: 9,
        name: 'Wireless Mechanical Keyboard',
        description: 'RGB mechanical keyboard with hot-swappable switches and customizable macros.',
        price: 129.99,
        originalPrice: null,
        category: 'Electronics',
        categoryId: 1,
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400',
        seller: {
            name: 'TechZone Store',
            verified: true,
            rating: 4.8,
            totalSales: 2340
        },
        rating: 4.6,
        reviews: 445,
        stock: 60,
        isNew: true,
        isSale: false,
        featured: false,
        trending: true
    },
    {
        id: 10,
        name: 'Running Shoes Ultra',
        description: 'Lightweight running shoes with advanced cushioning and breathable mesh upper.',
        price: 119.99,
        originalPrice: 159.99,
        category: 'Sports',
        categoryId: 4,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        seller: {
            name: 'SportZone',
            verified: true,
            rating: 4.7,
            totalSales: 1890
        },
        rating: 4.5,
        reviews: 678,
        stock: 95,
        isNew: false,
        isSale: true,
        featured: true,
        trending: false
    },
    {
        id: 11,
        name: 'Minimalist Wallet',
        description: 'Slim RFID-blocking wallet with premium leather finish.',
        price: 39.99,
        originalPrice: null,
        category: 'Fashion',
        categoryId: 2,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
        seller: {
            name: 'Accessories Plus',
            verified: true,
            rating: 4.4,
            totalSales: 2100
        },
        rating: 4.3,
        reviews: 890,
        stock: 180,
        isNew: false,
        isSale: false,
        featured: false,
        trending: false
    },
    {
        id: 12,
        name: 'Smart Home Hub',
        description: 'Central control for all smart home devices with voice control and automation.',
        price: 89.99,
        originalPrice: 119.99,
        category: 'Electronics',
        categoryId: 1,
        image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400',
        seller: {
            name: 'Smart Living',
            verified: true,
            rating: 4.6,
            totalSales: 1450
        },
        rating: 4.4,
        reviews: 567,
        stock: 70,
        isNew: false,
        isSale: true,
        featured: true,
        trending: true
    }
];

// Vendors Data
const vendors = [
    {
        id: 1,
        name: 'TechZone Store',
        initials: 'TZ',
        verified: true,
        rating: 4.8,
        totalSales: 2340,
        products: 156,
        responseTime: '< 1 hour'
    },
    {
        id: 2,
        name: 'Gadget Hub',
        initials: 'GH',
        verified: true,
        rating: 4.9,
        totalSales: 1850,
        products: 98,
        responseTime: '< 2 hours'
    },
    {
        id: 3,
        name: 'Fashion Forward',
        initials: 'FF',
        verified: true,
        rating: 4.6,
        totalSales: 980,
        products: 245,
        responseTime: '< 3 hours'
    },
    {
        id: 4,
        name: 'Home Essentials',
        initials: 'HE',
        verified: true,
        rating: 4.7,
        totalSales: 670,
        products: 89,
        responseTime: '< 1 hour'
    },
    {
        id: 5,
        name: 'Beauty Bliss',
        initials: 'BB',
        verified: true,
        rating: 4.8,
        totalSales: 890,
        products: 134,
        responseTime: '< 2 hours'
    },
    {
        id: 6,
        name: 'Book Haven',
        initials: 'BH',
        verified: true,
        rating: 4.9,
        totalSales: 3200,
        products: 567,
        responseTime: '< 30 min'
    }
];

// Helper Functions
function getFeaturedProducts() {
    return products.filter(p => p.featured);
}

function getTrendingProducts() {
    return products.filter(p => p.trending);
}

function getNewProducts() {
    return products.filter(p => p.isNew);
}

function getProductsByCategory(categoryId) {
    return products.filter(p => p.categoryId === categoryId);
}

function getProductsBySeller(sellerName) {
    return products.filter(p => p.seller.name === sellerName);
}

function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
}

function sortProducts(productList, sortBy) {
    const sorted = [...productList];
    switch(sortBy) {
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'newest':
            return sorted.sort((a, b) => b.isNew - a.isNew);
        case 'popularity':
            return sorted.sort((a, b) => b.reviews - a.reviews);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        default:
            return sorted;
    }
}

function filterProducts(productList, filters) {
    let filtered = [...productList];
    
    if (filters.category) {
        filtered = filtered.filter(p => p.categoryId === filters.category);
    }
    
    if (filters.minPrice !== undefined) {
        filtered = filtered.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.verifiedOnly) {
        filtered = filtered.filter(p => p.seller.verified);
    }
    
    if (filters.inStock) {
        filtered = filtered.filter(p => p.stock > 0);
    }
    
    return filtered;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        categories,
        products,
        vendors,
        getFeaturedProducts,
        getTrendingProducts,
        getNewProducts,
        getProductsByCategory,
        getProductsBySeller,
        searchProducts,
        sortProducts,
        filterProducts
    };
}

