(function () {
  function renderCartPage() {
    if (!window.SMAJStore) return;

    const tableBody = document.getElementById("cartTableBody");
    const totals = document.getElementById("cartTotals");
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (!tableBody || !totals || !checkoutBtn) return;

    function draw() {
      const snapshot = window.SMAJStore.getCartTotals();
      const items = snapshot.items;

      if (!items.length) {
        tableBody.innerHTML = '<tr><td colspan="6">Your cart is empty.</td></tr>';
        totals.innerHTML = "Total: 0 Pi (~$0.00)";
        checkoutBtn.classList.add("is-disabled");
        checkoutBtn.setAttribute("aria-disabled", "true");
        return;
      }

      checkoutBtn.classList.remove("is-disabled");
      checkoutBtn.removeAttribute("aria-disabled");

      tableBody.innerHTML = items
        .map((item) => {
          const product = item.product;
          return [
            "<tr>",
            "  <td>" + product.name + "</td>",
            "  <td>$" + window.SMAJStore.formatUsd(item.unitPriceUsd) + " (" + window.SMAJStore.formatPi(item.unitPricePi) + " Pi)</td>",
            "  <td><input type=\"number\" min=\"1\" class=\"qty-input\" data-qty-id=\"" + product.id + "\" value=\"" + item.quantity + "\" /></td>",
            "  <td>$" + window.SMAJStore.formatUsd(item.lineTotalUsd) + "</td>",
            "  <td>" + window.SMAJStore.formatPi(item.lineTotalPi) + " Pi</td>",
            "  <td><button type=\"button\" class=\"btn btn-outline\" data-remove-id=\"" + product.id + "\">Remove</button></td>",
            "</tr>"
          ].join("\n");
        })
        .join("\n");

      totals.innerHTML =
        "Total: " +
        "$" +
        window.SMAJStore.formatUsd(snapshot.totalUsd) +
        " (" +
        window.SMAJStore.formatPi(snapshot.totalPi) +
        " Pi)";

      bindEvents();
    }

    function bindEvents() {
      tableBody.querySelectorAll("[data-remove-id]").forEach((button) => {
        button.addEventListener("click", () => {
          window.SMAJStore.removeFromCart(button.getAttribute("data-remove-id"));
          draw();
        });
      });

      tableBody.querySelectorAll("[data-qty-id]").forEach((input) => {
        input.addEventListener("change", () => {
          const qty = Number(input.value) || 1;
          window.SMAJStore.updateCartQuantity(input.getAttribute("data-qty-id"), qty);
          draw();
        });
      });
    }

    checkoutBtn.addEventListener("click", () => {
      const snapshot = window.SMAJStore.getCartTotals();
      if (!snapshot.items.length) return;
      window.location.href = "checkout.html";
    });

    draw();
  }

  window.SMAJPages = window.SMAJPages || {};
  window.SMAJPages.cart = renderCartPage;
})();
