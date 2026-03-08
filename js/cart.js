// SMAJ STORE - Cart Management
// Part of SMAJ Ecosystem

// Cart State
let cart = [];

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('smaj_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('smaj_cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Add item to cart
function addToCart(product, quantity = 1) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            seller: product.seller,
            quantity: quantity,
            stock: product.stock
        });
    }
    
    saveCart();
    showNotification(`${product.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
}

// Update item quantity
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else if (quantity > item.stock) {
            showNotification('Maximum stock available', 'warning');
            item.quantity = item.stock;
        } else {
            item.quantity = quantity;
        }
        saveCart();
        renderCartItems();
    }
}

// Get cart total
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get cart items count
function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    renderCartItems();
}

// Render cart items (for cart page)
function renderCartItems() {
    const cartContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartDelivery = document.getElementById('cartDelivery');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'flex';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'block';
    
    const deliveryFee = getCartTotal() > 100 ? 0 : 9.99;
    const subtotal = getCartTotal();
    const total = subtotal + deliveryFee;
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-seller">
                    ${item.seller.verified ? '<span class="verified-badge"><i class="fas fa-check"></i> Verified</span>' : ''}
                    <span>${item.seller.name}</span>
                </div>
                <div class="cart-item-price">
                    ${item.price.toFixed(2)} Pi
                    ${item.price < 1 ? `(${Math.round(item.price * 1000)} Pi)` : ''}
                </div>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" ${item.quantity >= item.stock ? 'disabled' : ''}>
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="cart-item-total">
                ${(item.price * item.quantity).toFixed(2)} Pi
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    if (cartSubtotal) cartSubtotal.textContent = subtotal.toFixed(2) + ' Pi';
    if (cartDelivery) cartDelivery.textContent = deliveryFee === 0 ? 'FREE' : deliveryFee.toFixed(2) + ' Pi';
    if (cartTotal) cartTotal.textContent = total.toFixed(2) + ' Pi';
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'warning');
        return;
    }
    
    // Check if wallet is connected
    const walletData = getEcosystemSession();
    if (!walletData || !walletData.connected) {
        showNotification('Please connect your wallet first!', 'warning');
        return;
    }
    
    // Redirect to checkout
    window.location.href = 'checkout.html';
}

// Get ecosystem session (shared with SMAJ PI HUB)
function getEcosystemSession() {
    const session = localStorage.getItem('smaj_ecosystem_session');
    return session ? JSON.parse(session) : null;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    
    // Add event listeners for add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const product = products.find(p => p.id === productId);
            if (product) {
                addToCart(product);
            }
        });
    });
});

// Export for global use
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.proceedToCheckout = proceedToCheckout;
window.getCartTotal = getCartTotal;
window.getCartCount = getCartCount;
window.clearCart = clearCart;

