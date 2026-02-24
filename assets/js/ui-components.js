(function () {
  function createBadge() {
    var badge = document.createElement("span");
    badge.className = "verified-badge";
    badge.textContent = "✔ Verified Vendor";
    return badge;
  }

  function renderVerificationBadges() {
    var targets = document.querySelectorAll("[data-vendor-name]");
    targets.forEach(function (node) {
      var status = (node.getAttribute("data-vendor-status") || "").trim();
      var hasBadge = !!node.parentElement.querySelector(".verified-badge");
      if (status === "verified" && !hasBadge) {
        node.insertAdjacentElement("afterend", createBadge());
      }
    });
  }

  window.SMAJUI = {
    renderVerificationBadges: renderVerificationBadges
  };
})();
