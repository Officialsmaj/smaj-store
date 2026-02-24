(function () {
  function getSessionUser() {
    var session = window.SMAJAuthClient ? window.SMAJAuthClient.getSession() : null;
    if (!session) return null;
    return {
      userId: session.user_id || session.userId || "",
      role: (session.role || "buyer").toLowerCase(),
      wallet: session.wallet || ""
    };
  }

  function renderFeaturedProducts() {
    var grid = document.getElementById("homeFeaturedProducts");
    if (!grid || !window.SMAJStore) return;

    var products = window.SMAJStore.getProducts().slice(0, 6);
    if (!products.length) {
      grid.innerHTML = '<article class="card"><h3>No products yet</h3><p>Products will appear here after vendors publish listings.</p></article>';
      return;
    }

    grid.innerHTML = products
      .map(function (product) {
        var pricing = window.SMAJStore.getProductPricing(product);
        return [
          '<article class="card home-product-card">',
          '  <p class="home-category">' + (product.category || "general") + "</p>",
          "  <h3>" + product.name + "</h3>",
          '  <p class="home-copy">' + product.description + "</p>",
          '  <p class="home-price">$' + window.SMAJStore.formatUsd(pricing.usd) + ' <span>(' + window.SMAJStore.formatPi(pricing.pi) + " Pi)</span></p>",
          '  <div class="actions">',
          '    <button class="btn btn-secondary" type="button" data-home-add="' + product.id + '">Add to Cart</button>',
          '    <button class="btn btn-primary" type="button" data-home-buy="' + product.id + '">Buy Now</button>',
          "  </div>",
          "</article>"
        ].join("\n");
      })
      .join("\n");

    grid.querySelectorAll("[data-home-add]").forEach(function (button) {
      button.addEventListener("click", function () {
        var productId = button.getAttribute("data-home-add");
        window.SMAJStore.addToCart(productId, 1);
        button.textContent = "Added";
        setTimeout(function () {
          button.textContent = "Add to Cart";
        }, 800);
      });
    });

    grid.querySelectorAll("[data-home-buy]").forEach(function (button) {
      button.addEventListener("click", function () {
        var productId = button.getAttribute("data-home-buy");
        window.SMAJStore.addToCart(productId, 1);
        window.location.href = "checkout.html";
      });
    });
  }

  function updatePiRate() {
    var rateNodes = document.querySelectorAll("[data-pi-rate]");
    if (!window.SMAJStore) return;
    var rate = window.SMAJStore.getPiUsdRate();
    rateNodes.forEach(function (node) {
      node.textContent = "$" + Number(rate).toLocaleString("en-US");
    });
  }

  function renderVendorArea() {
    var user = getSessionUser();
    var cta = document.getElementById("vendorCtaArea");
    var formWrap = document.getElementById("vendorFormWrap");
    var state = document.getElementById("vendorFormState");
    var form = document.getElementById("vendorApplicationForm");
    if (!cta || !formWrap || !form || !window.SMAJStore) return;

    if (!user || !user.userId) {
      cta.innerHTML = '<a class="btn btn-primary" href="https://smajpihub.com/login">Sign in on SMAJ PI HUB</a>';
      formWrap.classList.add("is-hidden");
      return;
    }

    var isVendor = user.role === "vendor" || user.role === "admin" || window.SMAJStore.isVendorApproved(user.userId);
    if (isVendor) {
      cta.innerHTML = [
        '<a class="btn btn-primary" href="vendor/index.html">Vendor Dashboard</a>',
        '<a class="btn btn-secondary" href="vendor/add-product.html">Add Product</a>'
      ].join("");
      formWrap.classList.add("is-hidden");
      return;
    }

    cta.innerHTML = '<button type="button" class="btn btn-primary" id="openVendorFormBtn">Apply to Become a Vendor</button>';
    formWrap.classList.remove("is-hidden");
    var openBtn = document.getElementById("openVendorFormBtn");
    if (openBtn) {
      openBtn.addEventListener("click", function () {
        formWrap.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var storeName = (document.getElementById("storeName").value || "").trim();
      var description = (document.getElementById("storeDescription").value || "").trim();
      if (!storeName) {
        state.textContent = "Store name is required.";
        return;
      }

      var result = window.SMAJStore.applyForVendor({
        store_name: storeName,
        user_id: user.userId,
        description: description,
        payout_wallet: user.wallet || ""
      });

      if (!result.ok && result.reason === "pending_exists") {
        state.textContent = "Your vendor application is already pending manual approval.";
        return;
      }

      state.textContent = "Application submitted. Manual approval is required from SMAJ PI HUB admins.";
      form.reset();
    });
  }

  function renderHomePage() {
    if (!window.SMAJStore) return;
    renderFeaturedProducts();
    renderVendorArea();
    updatePiRate();
    document.addEventListener("smaj-rate-updated", updatePiRate);
  }

  window.SMAJPages = window.SMAJPages || {};
  window.SMAJPages.home = renderHomePage;
})();
