(function () {
  const DEFAULT_PI_USD_RATE = 314159;
  const COMMISSION_RATE = 0.05;
  const KEY_PRODUCTS = "smaj_products";
  const KEY_CART = "smaj_cart";
  const KEY_ORDERS = "smaj_orders";
  const KEY_VENDORS = "smaj_vendors";
  const KEY_VENDOR_APPLICATIONS = "smaj_vendor_applications";
  const KEY_PI_USD_RATE = "smaj_pi_usd_rate";
  const ORDER_STATUSES = [
    "Pending Payment",
    "Paid",
    "Processing",
    "Shipped",
    "Delivered",
    "Completed"
  ];

  function nowIso() {
    return new Date().toISOString();
  }

  function makeId(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 8) + "-" + Date.now().toString(36);
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getPiUsdRate() {
    const stored = Number(localStorage.getItem(KEY_PI_USD_RATE));
    if (Number.isFinite(stored) && stored > 0) return stored;
    return DEFAULT_PI_USD_RATE;
  }

  function setPiUsdRate(rate) {
    const safe = Number(rate);
    if (!Number.isFinite(safe) || safe <= 0) return false;
    localStorage.setItem(KEY_PI_USD_RATE, String(safe));
    document.dispatchEvent(new CustomEvent("smaj-rate-updated", { detail: { rate: safe } }));
    return true;
  }

  function usdToPi(usd, rateInput) {
    const safe = Number(usd) || 0;
    const rate = Number(rateInput) || getPiUsdRate();
    return safe / rate;
  }

  function piToUsd(pi, rateInput) {
    const safe = Number(pi) || 0;
    const rate = Number(rateInput) || getPiUsdRate();
    return safe * rate;
  }

  function formatPi(pi) {
    const value = Number(pi) || 0;
    const fixed = value.toFixed(8);
    return fixed.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  }

  function formatUsd(usd) {
    const value = Number(usd) || 0;
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function seedProducts() {
    return [
      {
        id: "p-headphones",
        title: "Headphones",
        name: "Headphones",
        description: "Noise-cancelling wireless headphones with 30-hour battery life.",
        price_usd: 10,
        price_pi: usdToPi(10),
        vendor_id: "vendor-alpha",
        stock: 34,
        images: ["https://via.placeholder.com/640x420?text=Headphones"],
        status: "active",
        category: "electronics"
      },
      {
        id: "p-phone",
        title: "Phone",
        name: "Phone",
        description: "Unlocked smartphone with OLED display and fast charging.",
        price_usd: 500,
        price_pi: usdToPi(500),
        vendor_id: "vendor-beta",
        stock: 8,
        images: ["https://via.placeholder.com/640x420?text=Phone"],
        status: "active",
        category: "electronics"
      },
      {
        id: "p-laptop",
        title: "Laptop",
        name: "Laptop",
        description: "14-inch lightweight laptop for work, creators, and remote teams.",
        price_usd: 2000,
        price_pi: usdToPi(2000),
        vendor_id: "vendor-gamma",
        stock: 6,
        images: ["https://via.placeholder.com/640x420?text=Laptop"],
        status: "active",
        category: "computers"
      },
      {
        id: "p-service",
        title: "Service",
        name: "Service",
        description: "One-on-one digital consulting session delivered in 48 hours.",
        price_usd: 50,
        price_pi: usdToPi(50),
        vendor_id: "vendor-alpha",
        stock: 100,
        images: ["https://via.placeholder.com/640x420?text=Service"],
        status: "active",
        category: "services"
      }
    ];
  }

  function seedVendors() {
    return [
      {
        id: "vendor-alpha",
        store_name: "Alpha Audio",
        user_id: "vendor_user_alpha",
        approved: true,
        balance_pi: 0
      },
      {
        id: "vendor-beta",
        store_name: "Beta Mobile",
        user_id: "vendor_user_beta",
        approved: true,
        balance_pi: 0
      },
      {
        id: "vendor-gamma",
        store_name: "Gamma Compute",
        user_id: "vendor_user_gamma",
        approved: true,
        balance_pi: 0
      }
    ];
  }

  function ensureStorage() {
    if (!localStorage.getItem(KEY_PRODUCTS)) writeJson(KEY_PRODUCTS, seedProducts());
    if (!localStorage.getItem(KEY_VENDORS)) writeJson(KEY_VENDORS, seedVendors());
    if (!localStorage.getItem(KEY_CART)) writeJson(KEY_CART, []);
    if (!localStorage.getItem(KEY_ORDERS)) writeJson(KEY_ORDERS, []);
    if (!localStorage.getItem(KEY_VENDOR_APPLICATIONS)) writeJson(KEY_VENDOR_APPLICATIONS, []);
  }

  function getProducts() {
    ensureStorage();
    return readJson(KEY_PRODUCTS, []);
  }

  function saveProducts(products) {
    writeJson(KEY_PRODUCTS, products);
  }

  function getProductById(id) {
    return getProducts().find((product) => product.id === id) || null;
  }

  function searchProducts(searchText, category, includeInactive) {
    const query = (searchText || "").trim().toLowerCase();
    const categoryFilter = (category || "").trim().toLowerCase();
    return getProducts().filter((product) => {
      const activeOk = includeInactive ? true : product.status === "active";
      if (!activeOk) return false;
      const categoryOk = !categoryFilter || categoryFilter === "all" || (product.category || "").toLowerCase() === categoryFilter;
      if (!categoryOk) return false;
      if (!query) return true;
      const haystack = [product.name, product.description, product.vendor_id, product.category].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }

  function upsertProduct(product) {
    const products = getProducts();
    const index = products.findIndex((item) => item.id === product.id);
    if (index >= 0) products[index] = product;
    else products.push(product);
    saveProducts(products);
    return product;
  }

  function addVendorProduct(input, userId) {
    const priceUsd = Number(input.price_usd);
    const pricePi = Number(input.price_pi);
    const normalizedUsd = Number.isFinite(priceUsd) && priceUsd > 0 ? priceUsd : piToUsd(pricePi);
    const normalizedPi = Number.isFinite(pricePi) && pricePi > 0 ? pricePi : usdToPi(normalizedUsd);
    const product = {
      id: makeId("prod"),
      title: input.name,
        name: input.name,
      description: input.description,
      price_usd: normalizedUsd,
      price_pi: normalizedPi,
      vendor_id: input.vendor_id || userId,
      stock: Number(input.stock) || 0,
      images: [input.image || "https://via.placeholder.com/640x420?text=Product"],
      status: input.status || "active",
      category: input.category || "general"
    };
    upsertProduct(product);
    return product;
  }

  function getProductPricing(product) {
    if (!product) return { usd: 0, pi: 0 };
    const usdFromProduct = Number(product.price_usd);
    if (Number.isFinite(usdFromProduct) && usdFromProduct > 0) {
      return {
        usd: usdFromProduct,
        pi: usdToPi(usdFromProduct)
      };
    }

    const piFromProduct = Number(product.price_pi) || 0;
    return {
      usd: piToUsd(piFromProduct),
      pi: piFromProduct
    };
  }

  function getCart() {
    ensureStorage();
    return readJson(KEY_CART, []);
  }

  function saveCart(items) {
    writeJson(KEY_CART, items);
    const count = items.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
    localStorage.setItem("smaj_cart_count", String(count));
    document.dispatchEvent(new CustomEvent("smaj-cart-updated", { detail: { count } }));
  }

  function addToCart(productId, quantity) {
    const qty = Math.max(1, Number(quantity) || 1);
    const product = getProductById(productId);
    if (!product) return getCart();
    const pricing = getProductPricing(product);
    const rate = getPiUsdRate();
    const items = getCart();
    const existing = items.find((item) => item.product_id === productId);
    if (existing) {
      existing.quantity += qty;
      existing.unit_price_usd = pricing.usd;
      existing.unit_price_pi = pricing.pi;
      existing.pi_usd_rate = rate;
    } else {
      items.push({
        product_id: productId,
        quantity: qty,
        unit_price_usd: pricing.usd,
        unit_price_pi: pricing.pi,
        pi_usd_rate: rate
      });
    }
    saveCart(items);
    return items;
  }

  function updateCartQuantity(productId, quantity) {
    const qty = Number(quantity) || 0;
    const items = getCart();
    const item = items.find((entry) => entry.product_id === productId);
    if (!item) return items;
    if (qty <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = qty;
    saveCart(items);
    return items;
  }

  function removeFromCart(productId) {
    const items = getCart().filter((item) => item.product_id !== productId);
    saveCart(items);
    return items;
  }

  function clearCart() {
    saveCart([]);
  }

  function getCartDetailed() {
    const items = getCart();
    return items
      .map((item) => {
        const product = getProductById(item.product_id);
        if (!product) return null;
        const quantity = Number(item.quantity) || 1;
        const fallbackPricing = getProductPricing(product);
        const unitPriceUsd = Number(item.unit_price_usd);
        const unitPricePi = Number(item.unit_price_pi);
        const safeUnitUsd = Number.isFinite(unitPriceUsd) && unitPriceUsd > 0 ? unitPriceUsd : fallbackPricing.usd;
        const safeUnitPi = Number.isFinite(unitPricePi) && unitPricePi > 0 ? unitPricePi : fallbackPricing.pi;
        const lineTotalPi = quantity * safeUnitPi;
        const lineTotalUsd = quantity * safeUnitUsd;
        return {
          product,
          quantity,
          unitPricePi: safeUnitPi,
          unitPriceUsd: safeUnitUsd,
          lineTotalPi,
          lineTotalUsd
        };
      })
      .filter(Boolean);
  }

  function getCartTotals() {
    const detailed = getCartDetailed();
    const totalPi = detailed.reduce((sum, item) => sum + item.lineTotalPi, 0);
    const totalUsd = detailed.reduce((sum, item) => sum + item.lineTotalUsd, 0);
    return {
      items: detailed,
      totalPi,
      totalUsd
    };
  }

  function getOrders() {
    ensureStorage();
    return readJson(KEY_ORDERS, []);
  }

  function saveOrders(orders) {
    writeJson(KEY_ORDERS, orders);
  }

  function createOrdersFromCart(user, paymentReference) {
    const totals = getCartTotals();
    if (!totals.items.length) return [];

    const orders = getOrders();
    const vendors = getVendors();
    const newOrders = totals.items.map((item) => {
      const totalPi = item.lineTotalPi;
      const commissionPi = totalPi * COMMISSION_RATE;
      const vendorAmountPi = totalPi - commissionPi;
      const order = {
        id: makeId("ord"),
        buyer_id: user.userId,
        product_id: item.product.id,
        quantity: item.quantity,
        total_pi: totalPi,
        commission_pi: commissionPi,
        status: "Paid",
        vendor_amount_pi: vendorAmountPi,
        vendor_id: item.product.vendor_id,
        payment_reference: paymentReference,
        wallet_address: user.wallet || "",
        created_at: nowIso()
      };

      const vendor = vendors.find((entry) => entry.id === item.product.vendor_id || entry.user_id === item.product.vendor_id);
      if (vendor) vendor.balance_pi = (Number(vendor.balance_pi) || 0) + vendorAmountPi;
      return order;
    });

    orders.push(...newOrders);
    saveOrders(orders);
    writeJson(KEY_VENDORS, vendors);
    clearCart();
    return newOrders;
  }

  function updateOrderStatus(orderId, status) {
    if (!ORDER_STATUSES.includes(status)) return null;
    const orders = getOrders();
    const order = orders.find((item) => item.id === orderId);
    if (!order) return null;
    order.status = status;
    saveOrders(orders);
    return order;
  }

  function getOrdersByBuyer(buyerId) {
    return getOrders().filter((order) => order.buyer_id === buyerId);
  }

  function getOrdersByVendor(vendorId, userId) {
    return getOrders().filter((order) => order.vendor_id === vendorId || order.vendor_id === userId);
  }

  function getVendors() {
    ensureStorage();
    return readJson(KEY_VENDORS, []);
  }

  function getVendorApplications() {
    ensureStorage();
    return readJson(KEY_VENDOR_APPLICATIONS, []);
  }

  function applyForVendor(payload) {
    const applications = getVendorApplications();
    const duplicate = applications.find((app) => app.user_id === payload.user_id && app.status === "pending");
    if (duplicate) return { ok: false, reason: "pending_exists" };

    const app = {
      id: makeId("vapp"),
      store_name: payload.store_name,
      user_id: payload.user_id,
      approved: false,
      description: payload.description || "",
      payout_wallet: payload.payout_wallet || "",
      status: "pending",
      created_at: nowIso()
    };
    applications.push(app);
    writeJson(KEY_VENDOR_APPLICATIONS, applications);
    return { ok: true, application: app };
  }

  function approveVendorApplication(applicationId) {
    const applications = getVendorApplications();
    const application = applications.find((item) => item.id === applicationId);
    if (!application) return null;

    application.status = "approved";
    application.approved = true;
    writeJson(KEY_VENDOR_APPLICATIONS, applications);

    const vendors = getVendors();
    const existing = vendors.find((vendor) => vendor.user_id === application.user_id);
    if (existing) {
      existing.approved = true;
      existing.store_name = application.store_name;
    } else {
      vendors.push({
        id: makeId("vendor"),
        store_name: application.store_name,
        user_id: application.user_id,
        approved: true,
        balance_pi: 0
      });
    }
    writeJson(KEY_VENDORS, vendors);
    return application;
  }

  function isVendorApproved(userId) {
    return getVendors().some((vendor) => vendor.user_id === userId && vendor.approved);
  }

  function getVendorByUserId(userId) {
    return getVendors().find((vendor) => vendor.user_id === userId) || null;
  }

  function renderProductCard(product) {
    const pricing = getProductPricing(product);
    return [
      '<article class="product-card">',
      '  <a class="product-image-wrap" href="product.html?id=' + encodeURIComponent(product.id) + '">',
      '    <img src="' + (product.images && product.images[0] ? product.images[0] : "https://via.placeholder.com/640x420?text=Product") + '" alt="' + product.name + '" class="product-image" />',
      "  </a>",
      '  <div class="product-content">',
      '    <p class="product-category">' + (product.category || "General") + "</p>",
      '    <h3><a href="product.html?id=' + encodeURIComponent(product.id) + '">' + product.name + "</a></h3>",
      '    <p class="product-description">' + product.description + "</p>",
      '    <p class="product-price">$' + formatUsd(pricing.usd) + ' <span>(' + formatPi(pricing.pi) + ' Pi)</span></p>',
      '    <p class="product-meta">Vendor: ' + product.vendor_id + ' | Stock: ' + product.stock + ' | Status: ' + product.status + "</p>",
      '    <button type="button" class="btn add-cart-btn" data-add-to-cart="' + product.id + '">Add to Cart</button>',
      "  </div>",
      "</article>"
    ].join("\n");
  }

  window.SMAJStore = {
    PI_USD_RATE: DEFAULT_PI_USD_RATE,
    COMMISSION_RATE,
    ORDER_STATUSES,
    ensureStorage,
    getPiUsdRate,
    setPiUsdRate,
    usdToPi,
    piToUsd,
    formatPi,
    formatUsd,
    getProductPricing,
    getProducts,
    getProductById,
    searchProducts,
    addVendorProduct,
    getCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
    getOrders,
    getOrdersByBuyer,
    getOrdersByVendor,
    createOrdersFromCart,
    updateOrderStatus,
    getVendors,
    getVendorApplications,
    applyForVendor,
    approveVendorApplication,
    isVendorApproved,
    getVendorByUserId,
    renderProductCard
  };
})();


