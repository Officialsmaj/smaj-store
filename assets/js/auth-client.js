(function () {
  var AUTH_PORTAL = "https://smajpihub.com";
  var TOKEN_KEYS = ["smaj_auth_token", "smaj_token", "auth_token", "token"];
  var ROLE_KEYS = ["smaj_role", "role"];
  var WALLET_KEYS = ["smaj_wallet_address", "wallet_address"];
  var USER_ID_KEYS = ["smaj_user_id", "user_id"];

  function getCookie(name) {
    var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : "";
  }

  function getFirstValue(keys) {
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      var value = localStorage.getItem(key) || getCookie(key);
      if (value) return value;
    }
    return "";
  }

  function shortenAddress(address) {
    if (!address) return "";
    if (address.length <= 12) return address;
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  function getSession() {
    try {
      var raw = localStorage.getItem("smaj_store_session");
      var stored = raw ? JSON.parse(raw) : null;
      var token = getFirstValue(TOKEN_KEYS) || (stored && stored.token) || "";
      if (!token) return null;

      var wallet = getFirstValue(WALLET_KEYS) || (stored && stored.wallet) || "";
      var role = (getFirstValue(ROLE_KEYS) || (stored && stored.role) || "buyer").toLowerCase();
      var userId = getFirstValue(USER_ID_KEYS) || (stored && stored.user_id) || "";
      var session = {
        authenticated: true,
        token: token,
        role: role,
        user_id: userId,
        wallet: wallet,
        walletShort: shortenAddress(wallet)
      };
      localStorage.setItem("smaj_store_session", JSON.stringify(session));
      return session;
    } catch (err) {
      return null;
    }
  }

  function isAuthenticated() {
    var session = getSession();
    return !!(session && session.authenticated);
  }

  function getRole() {
    var session = getSession();
    return session && session.role ? session.role : "guest";
  }

  function redirectToLogin() {
    var target = encodeURIComponent(window.location.href);
    window.location.href = AUTH_PORTAL + "/login?service=smaj-store&return_to=" + target;
  }

  function redirectToRegister() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    window.location.href = AUTH_PORTAL + "/register?service=smaj-store&redirect=" + encodeURIComponent(path);
  }

  function requireSession() {
    var session = getSession();
    if (session) return session;
    redirectToLogin();
    return null;
  }

  window.SMAJAuthClient = {
    getSession: getSession,
    isAuthenticated: isAuthenticated,
    getRole: getRole,
    requireSession: requireSession,
    redirectToLogin: redirectToLogin,
    redirectToRegister: redirectToRegister,
    shortenAddress: shortenAddress
  };
})();
