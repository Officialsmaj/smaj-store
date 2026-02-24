(function () {
  function toggleClass(el, className, state) {
    if (!el) return;
    el.classList.toggle(className, state);
  }

  function syncMobileOverlay() {
    const overlay = document.querySelector("[data-menu-overlay]");
    if (!overlay) return;
    const open = document.body.classList.contains("menu-open") || document.body.classList.contains("search-open");
    overlay.classList.toggle("is-open", open);
  }

  function initMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) return;

    function setOpen(open) {
      if (open) {
        document.body.classList.remove("search-open");
        const searchBar = document.querySelector("[data-search-bar]");
        const searchToggle = document.querySelector("[data-search-toggle]");
        if (searchBar) searchBar.classList.remove("is-open");
        if (searchToggle) searchToggle.setAttribute("aria-expanded", "false");
      }
      toggleClass(document.body, "menu-open", open);
      toggleClass(panel, "is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      syncMobileOverlay();
    }

    toggle.addEventListener("click", () => {
      setOpen(!panel.classList.contains("is-open"));
    });

    const overlay = document.querySelector("[data-menu-overlay]");
    if (overlay) {
      overlay.addEventListener("click", () => {
        setOpen(false);
        document.body.classList.remove("search-open");
        const searchBar = document.querySelector("[data-search-bar]");
        const searchToggle = document.querySelector("[data-search-toggle]");
        if (searchBar) searchBar.classList.remove("is-open");
        if (searchToggle) searchToggle.setAttribute("aria-expanded", "false");
        syncMobileOverlay();
      });
    }
    panel.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
  }

  function initSearchToggle() {
    const toggle = document.querySelector("[data-search-toggle]");
    const bar = document.querySelector("[data-search-bar]");
    const input = bar ? bar.querySelector("[data-global-search]") : null;
    if (!toggle || !bar) return;

    function setOpen(open) {
      if (open) {
        document.body.classList.remove("menu-open");
        const panel = document.querySelector("[data-mobile-panel]");
        const menuToggle = document.querySelector("[data-menu-toggle]");
        if (panel) panel.classList.remove("is-open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
      document.body.classList.toggle("search-open", open);
      bar.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      syncMobileOverlay();
      if (open && input) setTimeout(() => input.focus(), 0);
    }

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(!bar.classList.contains("is-open"));
    });

    document.addEventListener("click", (event) => {
      if (!bar.classList.contains("is-open")) return;
      if (bar.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function initUserMenu() {
    const menu = document.querySelector("[data-user-menu]");
    if (!menu) return;
    const toggle = menu.querySelector("[data-user-toggle]");
    const dropdown = menu.querySelector("[data-user-dropdown]");
    if (!toggle || !dropdown) return;

    function setOpen(open) {
      dropdown.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(!dropdown.classList.contains("is-open"));
    });

    document.addEventListener("click", () => setOpen(false));
  }

  function initLogout() {
    const logoutLinks = document.querySelectorAll("#logoutLink, #logoutLinkMobile");
    logoutLinks.forEach((logout) => {
      logout.addEventListener("click", (event) => {
        event.preventDefault();
        if (window.SMAJ_AUTH_HELPERS) window.SMAJ_AUTH_HELPERS.clearAuth();
        try {
          localStorage.removeItem("smaj_store_session");
        } catch (error) {}
        window.location.replace("https://smajpihub.com/login");
      });
    });
  }

  function initCartButton() {
    const cartButtons = document.querySelectorAll("[data-open-cart]");
    cartButtons.forEach((button) => {
      button.addEventListener("click", () => {
        window.location.href = "cart.html";
      });
    });
  }

  function initGlobalSearch() {
    const searchInputs = document.querySelectorAll("[data-global-search]");
    searchInputs.forEach((input) => {
      input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        const value = (input.value || "").trim();
        const query = encodeURIComponent(value);
        window.location.href = "marketplace.html?q=" + query;
      });
    });
  }

  function updateUserUI(user) {
    if (!user) return;

    const walletShort = user.walletShort || (window.SMAJ_AUTH_HELPERS ? window.SMAJ_AUTH_HELPERS.shortenAddress(user.wallet || "") : "");
    document.querySelectorAll("[data-wallet-short]").forEach((node) => {
      node.textContent = walletShort || "-";
    });
    document.querySelectorAll("[data-wallet-short-mobile]").forEach((node) => {
      node.textContent = walletShort || "-";
    });

    const profile = document.querySelector("[data-profile-link]");
    if (profile) {
      profile.setAttribute("href", user.role === "vendor" ? "vendor/index.html" : "dashboard/profile.html");
    }

    const profileMobile = document.querySelector("[data-profile-link-mobile]");
    if (profileMobile) {
      profileMobile.setAttribute("href", user.role === "vendor" ? "vendor/index.html" : "dashboard/profile.html");
    }

    const mobileWalletLink = document.querySelector("[data-mobile-wallet-link]");
    if (mobileWalletLink) {
      mobileWalletLink.setAttribute("href", user.role === "vendor" ? "vendor/index.html" : "dashboard/profile.html");
    }

    const orders = document.querySelector("[data-orders-link]");
    if (orders) {
      orders.setAttribute("href", user.role === "vendor" ? "vendor/orders.html" : "dashboard/orders.html");
    }
    const ordersMain = document.querySelector("[data-orders-link-main]");
    if (ordersMain) {
      ordersMain.setAttribute("href", user.role === "vendor" ? "vendor/orders.html" : "dashboard/orders.html");
    }

    const ordersMobile = document.querySelector("[data-orders-link-mobile]");
    if (ordersMobile) {
      ordersMobile.setAttribute("href", user.role === "vendor" ? "vendor/orders.html" : "dashboard/orders.html");
    }
    const ordersMainMobile = document.querySelector("[data-orders-link-main-mobile]");
    if (ordersMainMobile) {
      ordersMainMobile.setAttribute("href", user.role === "vendor" ? "vendor/orders.html" : "dashboard/orders.html");
    }

    const dashboard = document.querySelector("[data-dashboard-link]");
    if (dashboard) {
      dashboard.setAttribute("href", user.role === "vendor" || user.role === "admin" ? "vendor/index.html" : "dashboard/index.html");
    }

    const dashboardMobile = document.querySelector("[data-dashboard-link-mobile]");
    if (dashboardMobile) {
      dashboardMobile.setAttribute("href", user.role === "vendor" || user.role === "admin" ? "vendor/index.html" : "dashboard/index.html");
    }
  }

  function init() {
    initMenu();
    initSearchToggle();
    initUserMenu();
    initLogout();
    initCartButton();
    initGlobalSearch();

    if (window.SMAJ_AUTH) updateUserUI(window.SMAJ_AUTH);
    else document.addEventListener("smaj-auth-ready", (event) => updateUserUI(event.detail));
  }

  window.SmajHeader = {
    init,
    updateUserUI
  };
})();

