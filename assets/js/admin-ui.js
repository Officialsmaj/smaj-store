(function () {
  function init() {
    document.querySelectorAll("[data-admin-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        var action = button.getAttribute("data-admin-action");
        button.setAttribute("data-last-action", action || "");
      });
    });
  }

  window.SMAJAdminUI = {
    init: init
  };
})();
