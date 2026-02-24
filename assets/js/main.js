(function () {
  async function loadComponent(targetId, path) {
    const target = document.getElementById(targetId);
    if (!target) return;

    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error("Failed to load " + path);
      target.innerHTML = await response.text();
    } catch (error) {
      target.innerHTML = "";
    }
  }

  async function initComponents() {
    await loadComponent("site-header", "components/header.html");
    await loadComponent("site-footer", "components/footer.html");

    if (window.SmajHeader) window.SmajHeader.init();
    if (window.SmajCart) window.SmajCart.init();
  }

  async function initPageFeatures() {
    if (window.SMAJ_AUTH_READY) {
      await window.SMAJ_AUTH_READY;
    }

    if (window.SMAJStore) {
      window.SMAJStore.ensureStorage();
    }

    const pageName = document.body ? document.body.dataset.page : "";
    if (!pageName || !window.SMAJPages) return;

    const initializer = window.SMAJPages[pageName];
    if (typeof initializer === "function") {
      initializer();
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await initComponents();
    await initPageFeatures();
  });
})();
