(function () {
  async function request(path, options) {
    var defaults = {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    };
    var config = Object.assign({}, defaults, options || {});
    return fetch(path, config);
  }

  window.SMAJApiClient = {
    request: request
  };
})();
