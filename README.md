# SMAJ STORE

SMAJ STORE is a Pi-based multi-vendor marketplace integrated with SMAJ PI HUB authentication using HTML5, CSS3, and Vanilla JavaScript.

## Implemented Scope

- Mandatory auth guard on every page load (`assets/js/auth.js`)
  - Checks token (`localStorage`/cookie)
  - Redirects to `https://smajpihub.com/login` when missing
  - Fetches user profile from PI HUB (`user_id`, `role`, `wallet_address`)
- Role-based dashboards
  - Buyer dashboard: Orders, Cart, Wishlist, Profile
  - Vendor dashboard: Add Product, Manage Products, Orders, Earnings
  - Role routing via `data-required-roles`
- Product system
  - Reusable product card component (`SMAJStore.renderProductCard`)
  - Product detail page
  - Category filter + search
  - Product fields: `id, name, description, price_pi, vendor_id, stock, images, status`
- Cart system
  - Add/remove/update quantity
  - Header cart badge counter
  - Cart data in `localStorage`
- Vendor system
  - Become Vendor page + application form
  - Admin approval workflow in vendor dashboard (admin role)
  - Multi-vendor product ownership via `vendor_id`
- Checkout + escrow logic (MVP simulation)
  - Pi payment instructions
  - Verify payment action creates orders
  - Commission auto calculation: 5% SMAJ / 95% vendor
- Order management
  - Statuses: Pending Payment, Paid, Processing, Shipped, Delivered, Completed

## Main Files

- `assets/js/auth.js` auth + role guard
- `assets/js/store.js` shared marketplace/cart/order/vendor logic
- `assets/js/dashboard-page.js` buyer/vendor/become-vendor page behavior
- `assets/js/marketplace-page.js` filters + product rendering
- `assets/js/product-page.js` product details
- `assets/js/cart-page.js` cart updates and totals
- `assets/js/checkout-page.js` payment and order creation
- `index.html`, `marketplace.html`, `product.html`, `cart.html`, `checkout.html`, `become-vendor.html`, `buyer-dashboard.html`, `vendor-dashboard.html`

## Data Shapes

- `products`: `id, name, description, price_pi, vendor_id, stock, images, status`
- `orders`: `id, buyer_id, product_id, quantity, total_pi, commission_pi, status`
- `vendors`: `id, store_name, user_id, approved, balance_pi`
