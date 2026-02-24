(function () {
  function renderProductPage() {
    if (!window.SMAJStore) return;

    const root = document.getElementById("productDetail");
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const product = productId ? window.SMAJStore.getProductById(productId) : null;

    if (!product) {
      root.innerHTML = '<div class="card"><h2>Product not found</h2><p>This listing may have been removed.</p><a class="btn" href="marketplace.html">Back to Marketplace</a></div>';
      return;
    }

    const pricing = window.SMAJStore.getProductPricing(product);
    root.innerHTML = [
      '<div class="product-detail-grid">',
      '  <div class="card">',
      '    <img src="' + (product.images[0] || "https://via.placeholder.com/640x420?text=Product") + '" alt="' + product.name + '" class="product-detail-image" />',
      "  </div>",
      '  <div class="card">',
      '    <div class="eyebrow">Product Detail</div>',
      '    <h1 class="display small">' + product.name + "</h1>",
      '    <p class="lead">' + product.description + "</p>",
      '    <p class="product-price detail">$' + window.SMAJStore.formatUsd(pricing.usd) + ' <span>(' + window.SMAJStore.formatPi(pricing.pi) + ' Pi)</span></p>',
      '    <p class="product-meta">Vendor ID: ' + product.vendor_id + "</p>",
      '    <p class="product-meta">Stock: ' + product.stock + "</p>",
      '    <p class="product-meta">Status: ' + product.status + "</p>",
      '    <div class="button-row">',
      '      <button class="btn" type="button" id="detailAddToCart">Add to Cart</button>',
      '      <a class="btn btn-outline" href="marketplace.html">Back to Marketplace</a>',
      "    </div>",
      "  </div>",
      "</div>"
    ].join("\n");

    const add = document.getElementById("detailAddToCart");
    if (add) {
      add.addEventListener("click", () => {
        window.SMAJStore.addToCart(product.id, 1);
        add.textContent = "Added";
        setTimeout(() => {
          add.textContent = "Add to Cart";
        }, 900);
      });
    }
  }

  window.SMAJPages = window.SMAJPages || {};
  window.SMAJPages.product = renderProductPage;
})();
