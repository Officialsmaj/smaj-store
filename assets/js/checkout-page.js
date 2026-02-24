(function () {
  function renderCheckoutPage() {
    if (!window.SMAJStore) return;

    const summaryRoot = document.getElementById("checkoutSummaryContent");
    const instructionRoot = document.getElementById("paymentInstructionsContent");
    const verifyButton = document.getElementById("verifyPaymentBtn");
    const resultRoot = document.getElementById("checkoutResult");
    if (!summaryRoot || !instructionRoot || !verifyButton || !resultRoot) return;

    const user = window.SMAJ_AUTH || { userId: "", wallet: "" };

    function drawSummary() {
      const snapshot = window.SMAJStore.getCartTotals();
      if (!snapshot.items.length) {
        summaryRoot.innerHTML = '<div class="card"><h3>Cart is empty</h3><p>Add products before checkout.</p><a class="btn" href="marketplace.html">Browse Products</a></div>';
        instructionRoot.innerHTML = "";
        verifyButton.classList.add("is-disabled");
        return false;
      }

      const commissionPi = snapshot.totalPi * window.SMAJStore.COMMISSION_RATE;
      const vendorPi = snapshot.totalPi - commissionPi;

      summaryRoot.innerHTML = [
        '<div class="card">',
        "  <h3>Order Summary</h3>",
        "  <ul class=\"summary-list\">",
        snapshot.items
          .map(
            (item) =>
              "<li>" +
              item.product.name +
              " x " +
              item.quantity +
              " = " +
              window.SMAJStore.formatPi(item.lineTotalPi) +
              " Pi (~$" +
              window.SMAJStore.formatUsd(item.lineTotalUsd) +
              ")</li>"
          )
          .join(""),
        "  </ul>",
        "  <p><strong>Total:</strong> " + window.SMAJStore.formatPi(snapshot.totalPi) + " Pi (~$" + window.SMAJStore.formatUsd(snapshot.totalUsd) + ")</p>",
        "  <p><strong>Commission (5%):</strong> " + window.SMAJStore.formatPi(commissionPi) + " Pi</p>",
        "  <p><strong>Vendor Receives:</strong> " + window.SMAJStore.formatPi(vendorPi) + " Pi</p>",
        "</div>"
      ].join("\n");

      instructionRoot.innerHTML = [
        '<div class="card">',
        "  <h3>Pi Payment Instructions</h3>",
        "  <ol>",
        "    <li>Send " + window.SMAJStore.formatPi(snapshot.totalPi) + " Pi to escrow wallet: <strong>SMAJ_ESCROW_WALLET</strong>.</li>",
        "    <li>Include your buyer ID <strong>" + (user.userId || "unknown") + "</strong> in payment note.</li>",
        "    <li>Click Verify Payment after transfer to create orders and notify vendors.</li>",
        "  </ol>",
        "</div>"
      ].join("\n");

      verifyButton.classList.remove("is-disabled");
      return true;
    }

    verifyButton.addEventListener("click", () => {
      const paymentRef = "PI-" + Date.now();
      const orders = window.SMAJStore.createOrdersFromCart(user, paymentRef);
      if (!orders.length) return;

      resultRoot.innerHTML = [
        '<div class="card success-card">',
        "  <h3>Payment Verified</h3>",
        "  <p>Orders created: " + orders.length + "</p>",
        "  <p>Payment reference: <strong>" + paymentRef + "</strong></p>",
        "  <p>Vendors notified and order status set to Paid.</p>",
        "  <a class=\"btn\" href=\"buyer-dashboard.html#orders\">View Orders</a>",
        "</div>"
      ].join("\n");

      drawSummary();
    });

    drawSummary();
  }

  window.SMAJPages = window.SMAJPages || {};
  window.SMAJPages.checkout = renderCheckoutPage;
})();
