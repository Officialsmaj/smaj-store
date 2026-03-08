// SMAJ STORE - Main Application
// Part of SMAJ Ecosystem

// ============================================
// Ecosystem Session Management (One Login All Access)
// ============================================

// Check and restore ecosystem session
function checkEcosystemSession() {
    const session = localStorage.getItem('smaj_ecosystem_session');
    if (session) {
        const sessionData = JSON.parse(session);
        if (sessionData.connected && sessionData.walletAddress) {
            updateWalletUI(sessionData);
            return true;
        }
    }
    return false;
}

// Update wallet UI based on session
function updateWalletUI(sessionData) {
    const walletStatus = document.getElementById('walletStatus');
    const walletText = document.querySelector('.wallet-text');
    const walletInfo = document.getElementById('walletInfo');
    const walletBalance = document.getElementById('walletBalance');
    const walletAddress = document.getElementById('walletAddress');
    const heroWalletIndicator = document.getElementById('heroWalletIndicator');
    const heroAddress = document.getElementById('heroAddress');
    const connectBtn = document.querySelector('.connect-btn');
    
    if (walletStatus) {
        walletStatus.classList.add('wallet-connected');
    }
    
    if (walletText) {
        walletText.innerHTML = `<i class="fas fa-wallet"></i> Connected`;
    }
    
    if (walletInfo) {
        walletInfo.style.display = 'block';
    }
    
    if (walletBalance) {
        walletBalance.textContent = sessionData.balance || '0.00 Pi';
    }
    
    if (walletAddress && sessionData.walletAddress) {
        const address = sessionData.walletAddress;
        walletAddress.textContent = address.substring(0, 8) + '...' + address.substring(address.length - 6);
    }
    
    if (heroWalletIndicator) {
        heroWalletIndicator.style.display = 'flex';
    }
    
    if (heroAddress && sessionData.walletAddress) {
        heroAddress.textContent = sessionData.walletAddress.substring(0, 8) + '...';
    }
    
    if (connectBtn) {
        connectBtn.style.display = 'none';
    }
}

// Connect wallet (simulated for demo)
function connectWallet() {
    // Simulate wallet connection
    // In production, this would integrate with Pi Network wallet
    const mockSession = {
        connected: true,
        walletAddress: 'SMAJ' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        balance: (Math.random() * 100).toFixed(2),
        userId: 'user_' + Math.random().toString(36).substring(2, 8),
        connectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('smaj_ecosystem_session', JSON.stringify(mockSession));
    updateWalletUI(mockSession);
    showNotification('Wallet connected successfully!', 'success');
}

// Disconnect wallet
function disconnectWallet() {
    localStorage.removeItem('smaj_ecosystem_session');
    
    const walletStatus = document.getElementById('walletStatus');
    const walletText = document.querySelector('.wallet-text');
    const walletInfo = document.getElementById('walletInfo');
    const heroWalletIndicator = document.getElementById('heroWalletIndicator');
    const connectBtn = document.querySelector('.connect-btn');
    
    if (walletStatus) {
        walletStatus.classList.remove('wallet-connected');
    }
    
    if (walletText) {
        walletText.innerHTML = `<i class="fas fa-wallet"></i> Connect Wallet`;
    }
    
    if (walletInfo) {
        walletInfo.style.display = 'none';
    }
    
    if (heroWalletIndicator) {
        heroWalletIndicator.style.display = 'none';
    }
    
    if (connectBtn) {
        connectBtn.style.display = 'block';
    }
    
    showNotification('Wallet disconnected', 'info');
}

// Copy wallet address
function copyAddress() {
    const session = getEcosystemSession();
    if (session && session.walletAddress) {
        navigator.clipboard.writeText(session.walletAddress);
        showNotification('Address copied to clipboard!', 'success');
    }
}

// Return to SMAJ PI HUB
function returnToHub() {
    // In production, this would redirect to the actual PI HUB
    showNotification('Redirecting to SMAJ PI HUB...', 'info');
    // window.location.href = '../hub/index.html';
}

// Toggle profile menu
function toggleProfileMenu() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Logout
function logout() {
    disconnectWallet();
    clearCart();
    showNotification('Logged out successfully', 'info');
}

// ============================================
// Product Rendering
// ============================================

// Render categories
function renderCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    container.innerHTML = categories.map(cat => `
        <div class="category-card" onclick="navigateToCategory(${cat.id}, '${cat.name}')">
            <i class="fas ${cat.icon}"></i>
            <span>${cat.name}</span>
            <span class="product-count">${cat.count} items</span>
        </div>
    `).join('');
}

// Render featured products
function renderFeaturedProducts() {
    const container = document.getElementById('featuredGrid');
    if (!container) return;
    
    const featured = getFeaturedProducts();
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// Render trending products
function renderTrendingProducts() {
    const container = document.getElementById('trendingGrid');
    if (!container) return;
    
    const trending = getTrendingProducts();
    container.innerHTML = trending.map(product => createProductCard(product)).join('');
}

// Render recently added products
function renderRecentProducts() {
    const container = document.getElementById('recentGrid');
    if (!container) return;
    
    const recent = getNewProducts();
    container.innerHTML = recent.map(product => createProductCard(product)).join('');
}

// Render vendors
function renderVendors() {
    const container = document.getElementById('vendorsGrid');
    if (!container) return;
    
    container.innerHTML = vendors.map(vendor => `
        <div class="vendor-card">
            <div class="vendor-header">
                <div class="vendor-avatar">${vendor.initials}</div>
                <div class="vendor-info">
                    <h3>${vendor.name} ${vendor.verified ? '<i class="fas fa-check-circle text-success"></i>' : ''}</h3>
                    <div class="vendor-rating">
                        <i class="fas fa-star"></i>
                        <span>${vendor.rating}</span>
                        <span>(${vendor.totalSales} sales)</span>
                    </div>
                </div>
            </div>
            <div class="vendor-stats">
                <div class="vendor-stat">
                    <span>${vendor.products}</span>
                    <small>Products</small>
                </div>
                <div class="vendor-stat">
                    <span>${vendor.responseTime}</span>
                    <small>Response</small>
                </div>
                <div class="vendor-stat">
                    <span>${vendor.totalSales}</span>
                    <small>Sales</small>
                </div>
            </div>
            <div class="vendor-actions">
                <a href="vendor.html?id=${vendor.id}" class="visit-store-btn">Visit Store</a>
            </div>
        </div>
    `).join('');
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=Product+Image'">
                <div class="product-badges">
                    ${product.isNew ? '<span class="badge-new">NEW</span>' : ''}
                    ${product.isSale ? '<span class="badge-sale">SALE</span>' : ''}
                </div>
                <div class="product-actions">
                    <button class="product-action-btn" onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="product-action-btn" onclick="quickView(${product.id})" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">
                    <a href="product-detail.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="product-seller">
                    ${product.seller.verified ? '<span class="verified-badge"><i class="fas fa-check"></i> Verified</span>' : ''}
                    <span class="seller-name">${product.seller.name}</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${product.price.toFixed(2)} Pi</span>
                    ${product.originalPrice ? `<span class="original-price">${product.originalPrice.toFixed(2)} Pi</span>` : ''}
                </div>
                <div class="product-rating">
                    <span class="rating-stars">${getStarRating(product.rating)}</span>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-footer">
                    <button class="add-to-cart-btn" onclick="addToCartFromCard(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Get star rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Add to cart from product card
function addToCartFromCard(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        addToCart(product);
    }
}

// Toggle wishlist
function toggleWishlist(productId) {
    showNotification('Added to wishlist!', 'success');
}

// Quick view
function quickView(productId) {
    showNotification('Quick view coming soon!', 'info');
}

// Navigate to category
function navigateToCategory(categoryId, categoryName) {
    window.location.href = `listing.html?category=${categoryId}&name=${encodeURIComponent(categoryName)}`;
}

// Search functionality
function handleSearch(event) {
    if (event.key === 'Enter') {
        const query = document.getElementById('searchInput').value;
        if (query.trim()) {
            window.location.href = `listing.html?search=${encodeURIComponent(query)}`;
        }
    }
}

// ============================================
// Notification System
// ============================================

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.smaj-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `smaj-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============================================
// Initialize Application
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check for existing ecosystem session
    checkEcosystemSession();
    
    // Render homepage components
    renderCategories();
    renderFeaturedProducts();
    renderTrendingProducts();
    renderRecentProducts();
    renderVendors();
    
    // Setup search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', handleSearch);
    }
    
    // Close profile dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const profile = document.getElementById('userProfile');
        const dropdown = document.getElementById('profileDropdown');
        if (profile && !profile.contains(e.target) && dropdown) {
            dropdown.classList.remove('show');
        }
    });
});

// Make functions available globally
window.connectWallet = connectWallet;
window.disconnectWallet = disconnectWallet;
window.copyAddress = copyAddress;
window.returnToHub = returnToHub;
window.toggleProfileMenu = toggleProfileMenu;
window.logout = logout;
window.navigateToCategory = navigateToCategory;
window.addToCartFromCard = addToCartFromCard;
window.toggleWishlist = toggleWishlist;
window.quickView = quickView;
window.showNotification = showNotification;

