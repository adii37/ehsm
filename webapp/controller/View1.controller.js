sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (Controller, Filter, FilterOperator, MessageBox, MessageToast) => {
    "use strict";

    return Controller.extend("ehsm.controller.View1", {
        onInit() {
        },

        onSearch(oEvent) {
            this._applyFilters();
        },

        onPriorityChange(oEvent) {
            this._applyFilters();
        },

        _applyFilters() {
            const sSearch = this.byId("incidentsSearch").getValue();
            const sPriority = this.byId("priorityFilter").getSelectedKey();

            const aFilters = [];
            if (sSearch) {
                aFilters.push(new Filter("IncidentDescription", FilterOperator.Contains, sSearch));
            }
            if (sPriority !== "All") {
                aFilters.push(new Filter("IncidentPriority", FilterOperator.EQ, sPriority));
            }

            const oTable = this.byId("incidentsTable");
            oTable.getBinding("items").filter(aFilters);
        },

        onSearchRisk(oEvent) {
            const sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
            const aFilter = [];
            if (sQuery) {
                aFilter.push(new Filter("RiskDescription", FilterOperator.Contains, sQuery));
            }
            this.byId("risksTable").getBinding("items").filter(aFilter);
        },

        onLogout() {
            localStorage.removeItem("user");
            this.getOwnerComponent().getRouter().navTo("RouteLogin");
        },

        onItemPress(oEvent) {
            const oItem = oEvent.getSource();
            const oBindingContext = oItem.getBindingContext();
            const sId = oBindingContext.getProperty("IncidentId");
            const sDesc = oBindingContext.getProperty("IncidentDescription");

            MessageBox.information("Asset Event Log Extracted", {
                title: "Asset: " + sId,
                details: "Telemetry Log: \n" + sDesc + "\n\nStatus: Active Monitoring\nSecurity Clearance: L3 Required",
                styleClass: "glassDialog"
            });
        }
    });
});