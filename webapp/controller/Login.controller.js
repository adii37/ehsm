sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("ehsm.controller.Login", {
        onInit() {
        },

        onLogin() {
            const sUser = this.byId("usernameInput").getValue();
            const sPass = this.byId("passwordInput").getValue();

            // Simple demo logic
            if (sUser && sPass) {
                MessageToast.show("Access Granted. Synchronizing...");

                // Set fake user in storage for dashboard use
                localStorage.setItem("user", JSON.stringify({ EmpId: sUser }));

                // Navigate to dashboard
                this.getOwnerComponent().getRouter().navTo("RouteView1");
            } else {
                MessageToast.show("Please enter valid credentials.");
            }
        }
    });
});
