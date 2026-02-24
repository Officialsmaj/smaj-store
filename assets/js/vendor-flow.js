(function () {
  function initVendorGateLinks() {
    document.querySelectorAll("[data-become-vendor]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (!window.SMAJAuthClient || window.SMAJAuthClient.isAuthenticated()) return;
        event.preventDefault();
        window.SMAJAuthClient.redirectToLogin();
      });
    });
  }

  function initVendorForm() {
    var form = document.getElementById("vendorApplicationForm");
    if (!form) return;
    var state = document.querySelector("[data-vendor-submit-state]");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (state) {
        state.textContent = "Application captured in UI mode. Future backend state: role=buyer, vendor_status=pending.";
      }
    });
  }

  function init() {
    initVendorGateLinks();
    initVendorForm();
  }

  window.SMAJVendorFlow = {
    init: init
  };
})();
