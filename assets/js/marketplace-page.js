(function () {
  function renderMarketplace() {
    const grid = document.getElementById("productsGrid");
    if (!grid || !window.SMAJStore) return;

    const searchInput = document.getElementById("productSearch");
    const categorySelect = document.getElementById("categoryFilter");
    const params = new URLSearchParams(window.location.search);
    if (searchInput && params.get("q")) searchInput.value = params.get("q");

    function draw() {
      const query = searchInput ? searchInput.value : "";
      const category = categorySelect ? categorySelect.value : "all";
      const products = window.SMAJStore.searchProducts(query, category, false);

      if (!products.length) {
        grid.innerHTML = '<div class="card"><h3>No products found</h3><p>Try a different keyword or category.</p></div>';
        return;
      }

      grid.innerHTML = products.map(window.SMAJStore.renderProductCard).join("\n");
      bindAddToCart(grid);
    }

    function bindAddToCart(scope) {
      scope.querySelectorAll("[data-add-to-cart]").forEach((button) => {
        button.addEventListener("click", () => {
          const productId = button.getAttribute("data-add-to-cart");
          window.SMAJStore.addToCart(productId, 1);
          button.textContent = "Added";
          setTimeout(() => {
            button.textContent = "Add to Cart";
          }, 900);
        });
      });
    }

    if (searchInput) searchInput.addEventListener("input", draw);
    if (categorySelect) categorySelect.addEventListener("change", draw);
    draw();
  }

  window.SMAJPages = window.SMAJPages || {};
  window.SMAJPages.marketplace = renderMarketplace;
})();
