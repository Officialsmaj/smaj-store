(function () {
  function getRootPrefix() {
    var root = document.documentElement.getAttribute("data-root");
    return root && root.trim() ? root.trim() : ".";
  }

  function isRelativeUrl(url) {
    return !!url && !/^(?:[a-z]+:|#|\/)/i.test(url);
  }

  function rewriteRelativeLinks(scope) {
    var prefix = getRootPrefix();
    scope.querySelectorAll("[href], [src]").forEach(function (node) {
      ["href", "src"].forEach(function (attr) {
        var value = node.getAttribute(attr);
        if (!isRelativeUrl(value)) return;
        if (value.indexOf("..") === 0 || value.indexOf("./") === 0) return;
        node.setAttribute(attr, prefix + "/" + value);
      });
    });
  }

  async function includePartials() {
    var targets = document.querySelectorAll("[data-include]");
    for (var i = 0; i < targets.length; i += 1) {
      var slot = targets[i];
      var file = slot.getAttribute("data-include");
      if (!file) continue;
      var res = await fetch(file, { credentials: "same-origin" });
      if (!res.ok) {
        slot.innerHTML = "";
        continue;
      }
      slot.innerHTML = await res.text();
      rewriteRelativeLinks(slot);
    }
  }

  function syncMobileOverlay() {
    var overlay = document.querySelector("[data-menu-overlay]");
    if (!overlay) return;
    var open = document.body.classList.contains("menu-open") || document.body.classList.contains("search-open");
    overlay.classList.toggle("is-open", open);
  }

  function initHeaderMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) return;

    function setOpen(open) {
      if (open) {
        document.body.classList.remove("search-open");
        var searchBar = document.querySelector("[data-search-bar]");
        var searchToggle = document.querySelector("[data-search-toggle]");
        if (searchBar) searchBar.classList.remove("is-open");
        if (searchToggle) searchToggle.setAttribute("aria-expanded", "false");
      }
      document.body.classList.toggle("menu-open", open);
      panel.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      syncMobileOverlay();
    }

    toggle.addEventListener("click", function () {
      setOpen(!panel.classList.contains("is-open"));
    });

    var overlay = document.querySelector("[data-menu-overlay]");
    if (overlay) {
      overlay.addEventListener("click", function () {
        setOpen(false);
        document.body.classList.remove("search-open");
        var searchBar = document.querySelector("[data-search-bar]");
        var searchToggle = document.querySelector("[data-search-toggle]");
        if (searchBar) searchBar.classList.remove("is-open");
        if (searchToggle) searchToggle.setAttribute("aria-expanded", "false");
        syncMobileOverlay();
      });
    }

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });
  }

  function initHeaderSearch() {
    var toggle = document.querySelector("[data-search-toggle]");
    var bar = document.querySelector("[data-search-bar]");
    var input = bar ? bar.querySelector("[data-global-search]") : null;
    if (!toggle || !bar) return;

    function setOpen(open) {
      if (open) {
        document.body.classList.remove("menu-open");
        var panel = document.querySelector("[data-mobile-panel]");
        var menuToggle = document.querySelector("[data-menu-toggle]");
        if (panel) panel.classList.remove("is-open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
      document.body.classList.toggle("search-open", open);
      bar.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      syncMobileOverlay();
      if (open && input) setTimeout(function () { input.focus(); }, 0);
    }

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      setOpen(!bar.classList.contains("is-open"));
    });

    document.addEventListener("click", function (event) {
      if (!bar.classList.contains("is-open")) return;
      if (bar.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function initUserDropdown() {
    var menu = document.querySelector("[data-user-menu]");
    if (!menu) return;
    var toggle = menu.querySelector("[data-user-toggle]");
    var dropdown = menu.querySelector("[data-user-dropdown]");
    if (!toggle || !dropdown) return;

    function setOpen(open) {
      dropdown.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      setOpen(!dropdown.classList.contains("is-open"));
    });

    document.addEventListener("click", function () {
      setOpen(false);
    });
  }

  function initHeaderActions() {
    document.querySelectorAll("[data-open-cart]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.location.href = getRootPrefix() + "/cart.html";
      });
    });

    document.querySelectorAll("[data-global-search]").forEach(function (input) {
      input.addEventListener("keydown", function (event) {
        if (event.key !== "Enter") return;
        var value = encodeURIComponent((input.value || "").trim());
        window.location.href = getRootPrefix() + "/marketplace.html?q=" + value;
      });
    });
  }

  function initLogout() {
    var logoutLinks = document.querySelectorAll("#logoutLink, #logoutLinkMobile");
    logoutLinks.forEach(function (logout) {
      logout.addEventListener("click", function (event) {
        event.preventDefault();
        if (window.SMAJ_AUTH_HELPERS && window.SMAJ_AUTH_HELPERS.clearAuth) {
          window.SMAJ_AUTH_HELPERS.clearAuth();
        }
        try {
          localStorage.removeItem("smaj_store_session");
        } catch (error) {}
        window.location.replace("https://smajpihub.com/login");
      });
    });
  }

  function updateHeaderForUser(session) {
    if (!session) return;

    var role = (session.role || "buyer").toLowerCase();
    var isVendor = role === "vendor" || role === "admin";
    var profileHref = isVendor ? "vendor/index.html" : "dashboard/profile.html";
    var ordersHref = isVendor ? "vendor/orders.html" : "dashboard/orders.html";
    var dashboardHref = isVendor ? "vendor/index.html" : "dashboard/index.html";
    var walletShort = session.walletShort || (window.SMAJAuthClient && window.SMAJAuthClient.shortenAddress ? window.SMAJAuthClient.shortenAddress(session.wallet || "") : "");

    var profile = document.querySelector("[data-profile-link]");
    if (profile) profile.setAttribute("href", profileHref);
    var profileMobile = document.querySelector("[data-profile-link-mobile]");
    if (profileMobile) profileMobile.setAttribute("href", profileHref);

    var orders = document.querySelector("[data-orders-link]");
    if (orders) orders.setAttribute("href", ordersHref);
    var ordersMain = document.querySelector("[data-orders-link-main]");
    if (ordersMain) ordersMain.setAttribute("href", ordersHref);
    var ordersMobile = document.querySelector("[data-orders-link-mobile]");
    if (ordersMobile) ordersMobile.setAttribute("href", ordersHref);
    var ordersMainMobile = document.querySelector("[data-orders-link-main-mobile]");
    if (ordersMainMobile) ordersMainMobile.setAttribute("href", ordersHref);

    var dashboard = document.querySelector("[data-dashboard-link]");
    if (dashboard) dashboard.setAttribute("href", dashboardHref);
    var dashboardMobile = document.querySelector("[data-dashboard-link-mobile]");
    if (dashboardMobile) dashboardMobile.setAttribute("href", dashboardHref);

    document.querySelectorAll("[data-wallet-short]").forEach(function (node) {
      node.textContent = walletShort || "-";
    });
    document.querySelectorAll("[data-wallet-short-mobile]").forEach(function (node) {
      node.textContent = walletShort || "-";
    });
  }

  function updateCartBadge() {
    var count = 0;
    try {
      var raw = localStorage.getItem("smaj_cart");
      var items = raw ? JSON.parse(raw) : [];
      if (Array.isArray(items)) {
        count = items.reduce(function (sum, item) {
          return sum + (Number(item.quantity) || 1);
        }, 0);
      }
    } catch (error) {
      count = 0;
    }
    document.querySelectorAll("[data-cart-count]").forEach(function (badge) {
      badge.textContent = String(count);
    });
  }

  function initHeaderComponent() {
    initHeaderMenu();
    initHeaderSearch();
    initUserDropdown();
    initHeaderActions();
    initLogout();
    updateCartBadge();

    var session = window.SMAJAuthClient && window.SMAJAuthClient.requireSession ? window.SMAJAuthClient.requireSession() : null;
    if (!session) return;
    updateHeaderForUser(session);
  }

  function initAuthHandoffs() {
    var loginBtn = document.querySelector("[data-login-handoff]");
    if (loginBtn) {
      loginBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.SMAJAuthClient.redirectToLogin();
      });
    }

    var registerBtn = document.querySelector("[data-register-handoff]");
    if (registerBtn) {
      registerBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.SMAJAuthClient.redirectToRegister();
      });
    }
  }

  function initVendorStatusLabels() {
    var statusLabel = document.querySelector("[data-vendor-status-label]");
    var roleLabel = document.querySelector("[data-role-label]");
    var session = window.SMAJAuthClient.getSession();
    if (statusLabel && session) statusLabel.textContent = session.vendor_status || "pending";
    if (roleLabel && session) roleLabel.textContent = session.role || "buyer";
  }

  function initPageFeatures() {
    if (window.SMAJStore && typeof window.SMAJStore.ensureStorage === "function") {
      window.SMAJStore.ensureStorage();
    }

    var pageName = document.body ? document.body.getAttribute("data-page") : "";
    if (!pageName || !window.SMAJPages) return;
    var initializer = window.SMAJPages[pageName];
    if (typeof initializer === "function") initializer();
  }

  document.addEventListener("DOMContentLoaded", async function () {
    await includePartials();
    initHeaderComponent();
    if (window.SMAJRouteGuard) window.SMAJRouteGuard.enforcePageAccess();
    if (window.SMAJUI) window.SMAJUI.renderVerificationBadges();
    if (window.SMAJVendorFlow) window.SMAJVendorFlow.init();
    if (window.SMAJAdminUI) window.SMAJAdminUI.init();
    initAuthHandoffs();
    initVendorStatusLabels();
    initPageFeatures();
  });
})();

