(function () {
  function renderBuyerDashboard() {
    const user = window.SMAJ_AUTH;
    if (!user || !window.SMAJStore) return;

    const profileRoot = document.getElementById("buyerProfile");
    const orderRoot = document.getElementById("buyerOrders");
    const cartRoot = document.getElementById("buyerCart");
    const wishlistRoot = document.getElementById("buyerWishlist");

    if (profileRoot) {
      profileRoot.innerHTML = [
        "<p><strong>User ID:</strong> " + (user.userId || "-") + "</p>",
        "<p><strong>Role:</strong> " + user.role + "</p>",
        "<p><strong>Wallet Address:</strong> " + (user.wallet || "-") + "</p>"
      ].join("\n");
    }

    if (orderRoot) {
      const orders = window.SMAJStore.getOrdersByBuyer(user.userId);
      if (!orders.length) {
        orderRoot.innerHTML = "<p>No orders yet.</p>";
      } else {
        orderRoot.innerHTML =
          '<ul class="status-list">' +
          orders
            .map(
              (order) =>
                "<li><strong>" +
                order.id +
                "</strong> | Product: " +
                order.product_id +
                " | Qty: " +
                order.quantity +
                " | Total: " +
                window.SMAJStore.formatPi(order.total_pi) +
                " Pi | Status: " +
                order.status +
                "</li>"
            )
            .join("") +
          "</ul>";
      }
    }

    if (cartRoot) {
      const totals = window.SMAJStore.getCartTotals();
      cartRoot.innerHTML =
        "<p>Items in cart: <strong>" +
        totals.items.length +
        "</strong></p><p>Total: <strong>" +
        window.SMAJStore.formatPi(totals.totalPi) +
        " Pi (~$" +
        window.SMAJStore.formatUsd(totals.totalUsd) +
        ")</strong></p><a class=\"btn\" href=\"cart.html\">Go to Cart</a>";
    }

    if (wishlistRoot) {
      wishlistRoot.innerHTML =
        "<p>Wishlist is currently local-only in this MVP. You can add persistence in backend phase.</p>";
    }
  }

  function renderVendorDashboard() {
    const user = window.SMAJ_AUTH;
    if (!user || !window.SMAJStore) return;

    const productForm = document.getElementById("vendorProductForm");
    const productRoot = document.getElementById("vendorProducts");
    const ordersRoot = document.getElementById("vendorOrders");
    const earningsRoot = document.getElementById("vendorEarnings");
    const adminRoot = document.getElementById("adminApprovals");

    function drawProducts() {
      if (!productRoot) return;
      const products = window.SMAJStore
        .getProducts()
        .filter((product) => product.vendor_id === user.userId || user.role === "admin");

      if (!products.length) {
        productRoot.innerHTML = "<p>No products yet.</p>";
        return;
      }

      productRoot.innerHTML =
        '<div class="product-grid">' + products.map(window.SMAJStore.renderProductCard).join("") + "</div>";

      productRoot.querySelectorAll("[data-add-to-cart]").forEach((button) => {
        button.classList.add("is-hidden");
      });
    }

    function drawOrdersAndEarnings() {
      const vendorRecord = window.SMAJStore.getVendorByUserId(user.userId);
      const vendorId = vendorRecord ? vendorRecord.id : user.userId;
      const orders = window.SMAJStore.getOrdersByVendor(vendorId, user.userId);

      if (ordersRoot) {
        if (!orders.length) {
          ordersRoot.innerHTML = "<p>No incoming orders.</p>";
        } else {
          ordersRoot.innerHTML = orders
            .map(
              (order) =>
                '<div class="order-row"><p><strong>' +
                order.id +
                "</strong> | " +
                window.SMAJStore.formatPi(order.total_pi) +
                " Pi | Status: " +
                order.status +
                '</p><label>Status <select data-order-status="' +
                order.id +
                '">' +
                window.SMAJStore.ORDER_STATUSES.map(
                  (status) =>
                    '<option value="' +
                    status +
                    '"' +
                    (status === order.status ? " selected" : "") +
                    ">" +
                    status +
                    "</option>"
                ).join("") +
                "</select></label></div>"
            )
            .join("");

          ordersRoot.querySelectorAll("[data-order-status]").forEach((select) => {
            select.addEventListener("change", () => {
              window.SMAJStore.updateOrderStatus(select.getAttribute("data-order-status"), select.value);
              drawOrdersAndEarnings();
            });
          });
        }
      }

      if (earningsRoot) {
        const earnedPi = orders.reduce((sum, order) => sum + (Number(order.vendor_amount_pi) || 0), 0);
        const commissionPi = orders.reduce((sum, order) => sum + (Number(order.commission_pi) || 0), 0);
        earningsRoot.innerHTML =
          "<p><strong>Total Vendor Earnings:</strong> " +
          window.SMAJStore.formatPi(earnedPi) +
          " Pi</p><p><strong>Total SMAJ Commission:</strong> " +
          window.SMAJStore.formatPi(commissionPi) +
          " Pi</p>";
      }
    }

    function drawAdminApprovals() {
      if (!adminRoot) return;
      if (user.role !== "admin") {
        adminRoot.innerHTML = "<p>Admin approval panel is only available for admin role.</p>";
        return;
      }

      const pending = window.SMAJStore
        .getVendorApplications()
        .filter((application) => application.status === "pending");

      if (!pending.length) {
        adminRoot.innerHTML = "<p>No pending vendor applications.</p>";
        return;
      }

      adminRoot.innerHTML = pending
        .map(
          (application) =>
            '<div class="card"><p><strong>' +
            application.store_name +
            "</strong> | User: " +
            application.user_id +
            "</p><p>Wallet: " +
            (application.payout_wallet || "-") +
            '</p><button type="button" class="btn" data-approve-id="' +
            application.id +
            '">Approve Vendor</button></div>'
        )
        .join("");

      adminRoot.querySelectorAll("[data-approve-id]").forEach((button) => {
        button.addEventListener("click", () => {
          window.SMAJStore.approveVendorApplication(button.getAttribute("data-approve-id"));
          drawAdminApprovals();
        });
      });
    }

    if (productForm) {
      productForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(productForm);
        window.SMAJStore.addVendorProduct(
          {
            name: String(formData.get("name") || "").trim(),
            description: String(formData.get("description") || "").trim(),
            category: String(formData.get("category") || "general").trim(),
            price_pi: Number(formData.get("price_pi") || 0),
            stock: Number(formData.get("stock") || 0),
            image: String(formData.get("image") || "").trim(),
            status: String(formData.get("status") || "active").trim(),
            vendor_id: user.userId
          },
          user.userId
        );
        productForm.reset();
        drawProducts();
      });
    }

    drawProducts();
    drawOrdersAndEarnings();
    drawAdminApprovals();
  }

  function renderBecomeVendorPage() {
    const user = window.SMAJ_AUTH;
    if (!user || !window.SMAJStore) return;

    const statusRoot = document.getElementById("vendorStatus");
    const form = document.getElementById("vendorApplicationForm");
    if (!statusRoot || !form) return;

    function drawStatus() {
      const approved = window.SMAJStore.isVendorApproved(user.userId);
      const pending = window.SMAJStore
        .getVendorApplications()
        .find((application) => application.user_id === user.userId && application.status === "pending");

      if (approved) {
        statusRoot.innerHTML =
          '<div class="card success-card"><h3>You are an approved vendor</h3><p>Go to vendor dashboard to add products.</p><a class="btn" href="vendor-dashboard.html">Open Vendor Dashboard</a></div>';
        form.classList.add("is-hidden");
        return;
      }

      if (pending) {
        statusRoot.innerHTML =
          '<div class="card"><h3>Application Pending</h3><p>Your vendor request is awaiting admin approval.</p></div>';
        return;
      }

      statusRoot.innerHTML =
        "<div class=\"card\"><h3>Become a Vendor</h3><p>Submit your store details for admin approval.</p></div>";
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const result = window.SMAJStore.applyForVendor({
        store_name: String(formData.get("store_name") || "").trim(),
        user_id: user.userId,
        payout_wallet: String(formData.get("payout_wallet") || "").trim(),
        description: String(formData.get("description") || "").trim()
      });

      if (!result.ok) {
        statusRoot.innerHTML =
          '<div class="card"><h3>Pending request already exists</h3><p>Please wait for admin review.</p></div>';
      }

      form.reset();
      drawStatus();
    });

    drawStatus();
  }

  function renderDashboardHome() {
    const user = window.SMAJ_AUTH;
    if (!user) return;

    const content = document.getElementById("dashboardContent");
    if (!content) return;

    const role = (user.role || "buyer").toLowerCase();

    content.innerHTML = [
      '<div class="card">',
      '  <h3>Welcome, ' + (user.walletShort || "User") + '</h3>',
      '  <p>Role: ' + role + '</p>',
      '  <p>Wallet: ' + (user.wallet || "-") + '</p>',
      '</div>',
      '<div class="grid grid-2">',
      '  <div class="card">',
      '    <h4>Quick Stats</h4>',
      '    <p>View your account statistics and recent activity.</p>',
      '  </div>',
      '  <div class="card">',
      '    <h4>Recent Activity</h4>',
      '    <p>Check your recent orders and updates.</p>',
      '  </div>',
      '</div>'
    ].join("\n");
  }

  function renderDashboardOrders() {
    const user = window.SMAJ_AUTH;
    if (!user || !window.SMAJStore) return;

    const list = document.getElementById("ordersList");
    if (!list) return;

    const role = (user.role || "buyer").toLowerCase();
    let orders = [];

    if (role === "vendor" || role === "admin") {
      const vendorRecord = window.SMAJStore.getVendorByUserId(user.userId);
      const vendorId = vendorRecord ? vendorRecord.id : user.userId;
      orders = window.SMAJStore.getOrdersByVendor(vendorId, user.userId);
    } else {
      orders = window.SMAJStore.getOrdersByBuyer(user.userId);
    }

    if (!orders.length) {
      list.innerHTML = '<p>No orders found.</p>';
      return;
    }

    list.innerHTML = orders.map(function(order) {
      return '<div class="card"><p><strong>' + order.id + '</strong></p><p>Total: ' + 
        window.SMAJStore.formatPi(order.total_pi) + ' Pi | Status: ' + order.status + '</p></div>';
    }).join("\n");
  }

  function renderDashboardProfile() {
    const user = window.SMAJ_AUTH;
    if (!user) return;

    const content = document.getElementById("profileContent");
    if (!content) return;

    content.innerHTML = [
      '<p><strong>User ID:</strong> ' + (user.userId || "-") + '</p>',
      '<p><strong>Role:</strong> ' + (user.role || "buyer") + '</p>',
      '<p><strong>Wallet Address:</strong> ' + (user.wallet || "-") + '</p>'
    ].join("\n");
  }

  function renderDashboardSettings() {
    const form = document.getElementById("settingsForm");
    const state = document.getElementById("settingsState");
    if (!form) return;

    form.addEventListener("submit", function(e) {
      e.preventDefault();
      if (state) {
        state.textContent = "Settings saved successfully!";
        state.style.color = "green";
      }
    });
  }

  function renderAdminUsers() {
    console.log("Admin Users page initialized");
  }

  function renderAdminVendors() {
    console.log("Admin Vendors page initialized");
  }

  function renderAdminReports() {
    console.log("Admin Reports page initialized");
  }

  window.SMAJPages = window.SMAJPages || {};
  window.SMAJPages.buyerDashboard = renderBuyerDashboard;
  window.SMAJPages.vendorDashboard = renderVendorDashboard;
  window.SMAJPages.becomeVendor = renderBecomeVendorPage;
  window.SMAJPages.dashboard = renderDashboardHome;
  window.SMAJPages.dashboardOrders = renderDashboardOrders;
  window.SMAJPages.dashboardProfile = renderDashboardProfile;
  window.SMAJPages.dashboardSettings = renderDashboardSettings;
  window.SMAJPages.adminUsers = renderAdminUsers;
  window.SMAJPages.adminVendors = renderAdminVendors;
  window.SMAJPages.adminReports = renderAdminReports;
})();
