(function () {
  const TOKEN_KEYS = ["smaj_auth_token", "smaj_token", "auth_token", "token"];
  const ROLE_KEYS = ["smaj_role", "role"];
  const WALLET_KEYS = ["smaj_wallet_address", "wallet_address"];
  const USER_ID_KEYS = ["smaj_user_id", "user_id"];
  const API_BASE = "https://smajpihub.com";
  const PROFILE_ENDPOINT = API_BASE + "/api/me";
  const LOGIN_URL = API_BASE + "/login";

  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function getFirstValue(keys, fallback) {
    for (const key of keys) {
      const value = localStorage.getItem(key) || getCookie(key);
      if (value) return value;
    }
    return fallback;
  }

  function getAuthToken() {
    return getFirstValue(TOKEN_KEYS, null);
  }

  function getUserRole() {
    return getFirstValue(ROLE_KEYS, "buyer");
  }

  function getWalletAddress() {
    return getFirstValue(WALLET_KEYS, "");
  }

  function getUserId() {
    return getFirstValue(USER_ID_KEYS, "");
  }

  function persistUser(user) {
    localStorage.setItem("smaj_user_id", user.userId || "");
    localStorage.setItem("smaj_role", user.role || "buyer");
    localStorage.setItem("smaj_wallet_address", user.wallet || "");
  }

  function shortenAddress(address) {
    if (!address) return "";
    if (address.length <= 10) return address;
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  function clearAuth() {
    [...TOKEN_KEYS, ...ROLE_KEYS, ...WALLET_KEYS, ...USER_ID_KEYS].forEach((key) => {
      localStorage.removeItem(key);
      document.cookie = key + "=; Max-Age=0; path=/";
    });
  }

  function getRequiredRolesFromPage() {
    const value = document.body ? document.body.dataset.requiredRoles : "";
    if (!value) return [];
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function redirectToLogin() {
    const returnTo = encodeURIComponent(window.location.href);
    window.location.replace(LOGIN_URL + "?return_to=" + returnTo);
  }

  async function fetchUserProfile(token) {
    try {
      const response = await fetch(PROFILE_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      if (!response.ok) return null;
      const data = await response.json();
      return {
        userId: data.user_id || data.id || "",
        role: (data.role || "buyer").toLowerCase(),
        wallet: data.wallet_address || ""
      };
    } catch (error) {
      return null;
    }
  }

  function getRoleHome(role) {
    if (role === "vendor" || role === "admin") return "vendor-dashboard.html";
    return "buyer-dashboard.html";
  }

  function applyRoleRouting(user) {
    const requiredRoles = getRequiredRolesFromPage();
    if (!requiredRoles.length) return;

    const isAllowed = requiredRoles.includes(user.role);
    if (isAllowed) return;

    window.location.replace(getRoleHome(user.role));
  }

  async function enforceAuth() {
    const token = getAuthToken();
    if (!token) {
      redirectToLogin();
      return null;
    }

    const profile = await fetchUserProfile(token);
    const user = {
      token,
      userId: profile ? profile.userId : getUserId(),
      role: profile ? profile.role : getUserRole(),
      wallet: profile ? profile.wallet : getWalletAddress()
    };

    user.walletShort = shortenAddress(user.wallet);
    persistUser(user);

    window.SMAJ_AUTH = user;
    if (document.body) document.body.dataset.role = user.role;

    applyRoleRouting(user);

    document.dispatchEvent(new CustomEvent("smaj-auth-ready", { detail: user }));
    return user;
  }

  function requireRole(roles, redirect) {
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (!window.SMAJ_AUTH) return;
    if (!allowed.includes(window.SMAJ_AUTH.role)) {
      window.location.replace(redirect || "index.html");
    }
  }

  window.SMAJ_AUTH_HELPERS = {
    enforceAuth,
    shortenAddress,
    clearAuth,
    requireRole
  };

  document.addEventListener("DOMContentLoaded", () => {
    window.SMAJ_AUTH_READY = enforceAuth();
  });
})();
