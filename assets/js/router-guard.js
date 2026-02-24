(function () {
  function normalizeRoles(raw) {
    if (!raw) return [];
    return raw.split(",").map(function (entry) { return entry.trim(); }).filter(Boolean);
  }

  function enforcePageAccess() {
    if (!window.SMAJAuthClient) return;
    var body = document.body;
    if (!body) return;

    var requiresAuth = body.getAttribute("data-requires-auth") === "true";
    var allowedRoles = normalizeRoles(body.getAttribute("data-allowed-roles"));

    if (requiresAuth && !window.SMAJAuthClient.isAuthenticated()) {
      window.SMAJAuthClient.redirectToLogin();
      return;
    }

    if (allowedRoles.length) {
      var role = window.SMAJAuthClient.getRole();
      if (allowedRoles.indexOf(role) === -1) {
        var root = document.documentElement.getAttribute("data-root") || ".";
        window.location.href = root + "/index.html";
      }
    }
  }

  window.SMAJRouteGuard = {
    enforcePageAccess: enforcePageAccess
  };
})();
