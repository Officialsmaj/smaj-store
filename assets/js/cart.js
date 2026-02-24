(function () {
  function getCartCount() {
    if (!window.SMAJStore) return 0;
    const cart = window.SMAJStore.getCart();
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }

  function updateCartCount(count) {
    const badge = document.querySelector("[data-cart-count]");
    if (!badge) return;
    badge.textContent = String(count);
  }

  function init() {
    updateCartCount(getCartCount());
    document.addEventListener("smaj-cart-updated", (event) => {
      updateCartCount(event.detail.count || 0);
    });
  }

  window.SmajCart = {
    init,
    updateCartCount
  };
})();
