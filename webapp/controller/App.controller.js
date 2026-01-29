sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (BaseController) => {
  "use strict";

  return BaseController.extend("ehsm.controller.App", {
    onInit() {
      const sUser = localStorage.getItem("user");
      if (!sUser) {
        this.getOwnerComponent().getRouter().navTo("RouteLogin");
      }
    }
  });
});