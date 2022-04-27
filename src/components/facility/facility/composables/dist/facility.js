"use strict";
exports.__esModule = true;
exports.useFacility = void 0;
var composition_api_1 = require("@vue/composition-api");
var router_1 = require("@/router");
var facility_service_1 = require("../services/facility.service");
var facility_types_service_1 = require("@/components/facility/facility-type/services/facility-types.service");
var admin_area_services_1 = require("@/components/admin-area/admin-area/services/admin-area-services");
exports.useFacility = function () {
    var dataItems = [];
    var facilityTypes = [];
    var adminAreas = [];
    var facilityData = {};
    var data = composition_api_1.reactive({
        title: "Manage Facilities",
        valid: true,
        isOpen: false,
        node: null,
        response: {},
        modalTitle: "",
        headers: [
            {
                text: "Name",
                align: "start",
                sortable: false,
                value: "name"
            },
            {
                text: "Code",
                align: "start",
                sortable: false,
                value: "code"
            },
            {
                text: "Phone number",
                align: "start",
                sortable: false,
                value: "phone_number"
            },
            {
                text: "Email",
                align: "start",
                sortable: false,
                value: "email"
            },
            {
                text: "Postal address",
                align: "start",
                sortable: false,
                value: "postal_address"
            },
            {
                text: "Facility type",
                align: "start",
                sortable: false,
                value: "facility_type.name"
            },
            {
                text: "Location",
                align: "start",
                sortable: false,
                value: "location.name"
            },
            {
                text: "Active",
                align: "start",
                sortable: false,
                value: "active"
            },
            {
                text: "Actions",
                value: "actions",
                sortable: false
            },
        ],
        modal: false,
        deletemodal: false,
        items: dataItems,
        facilityTypes: facilityTypes,
        itemsToFilter: [],
        formData: facilityData,
        params: {
            total: 100,
            size: 10
        },
        rows: ["10", "20", "50", "100"],
        itemtodelete: "",
        adminAreas: adminAreas,
        searchTerm: ""
    });
    composition_api_1.onMounted(function () {
        initialize();
    });
    var initialize = function () {
        getTableData();
        getNodes();
    };
    var getTableData = function () {
        facility_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.items = response.data.data.data;
            data.itemsToFilter = response.data.data.data;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
        });
    };
    var searchItem = function (itemName) {
        if (itemName != null) {
            facility_service_1.search({ name: itemName.name }).then(function (response) {
                data.items = response.data.data.data;
            });
        }
    };
    var getData = function (params) {
        data.response = params;
        facility_service_1.get(params).then(function (response) {
            data.response = response.data.data;
            data.items = response.data.data.data;
        });
    };
    var openConfirmDialog = function (deleteId) {
        data.deletemodal = !data.modal;
        data.itemtodelete = deleteId;
    };
    var getFacilityTypeData = function () {
        facility_types_service_1.get({ per_page: 10 }).then(function (response) {
            data.facilityTypes = response.data.data.data;
        });
    };
    var cancelDialog = function () {
        data.formData = {};
        data.modal = !data.modal;
    };
    var cancelConfirmDialog = function () {
        data.formData = {};
        data.deletemodal = false;
    };
    var remove = function () {
        facility_service_1.destroy(data.itemtodelete).then(function () {
            data.deletemodal = false;
            getTableData();
        });
    };
    var save = function () {
        if (data.formData.id) {
            updateFacility(data.formData);
        }
        else {
            createFacility(data.formData);
        }
    };
    var openDialog = function (formData) {
        if (formData.id) {
            data.formData = formData;
            data.modalTitle = "Update";
            data.searchTerm = "";
            searchFacilityTypes(formData.facility_type.code);
        }
        else {
            data.formData = {};
            data.modalTitle = "Create";
            data.searchTerm = "";
            getFacilityTypeData();
        }
        data.modal = !data.modal;
    };
    var updateFacility = function (data) {
        facility_service_1.update(data).then(function () {
            cancelDialog();
            getTableData();
        });
    };
    var createFacility = function (data) {
        facility_service_1.create(data).then(function () {
            cancelDialog();
            getTableData();
        });
    };
    var loadLocationChildren = function (location) {
        data.formData.location_id = location.id;
        if (!location.children) {
            if (location.id !== data.node.id) {
                admin_area_services_1.getChildren(location.id).then(function (response) {
                    if (response.data.data.children.length) {
                        composition_api_1.set(location, "children", response.data.data.children);
                    }
                });
            }
        }
    };
    var getNodes = function (id) {
        admin_area_services_1.getChildren(id).then(function (response) {
            data.node = response.data.data;
        });
    };
    var searchFacilityTypes = function (item) {
        var regSearchTerm = item ? item : data.searchTerm;
        facility_types_service_1.get({ per_page: 10, regSearch: regSearchTerm }).then(function (response) {
            data.facilityTypes = response.data.data.data;
        });
    };
    var navigateToFacility = function (facility) {
        router_1["default"].push({ path: "/manage-facilities?facility_id=" + facility.id });
    };
    return {
        navigateToFacility: navigateToFacility,
        data: data,
        openDialog: openDialog,
        cancelDialog: cancelDialog,
        openConfirmDialog: openConfirmDialog,
        getFacilityTypeData: getFacilityTypeData,
        updateFacility: updateFacility,
        save: save,
        remove: remove,
        cancelConfirmDialog: cancelConfirmDialog,
        searchItem: searchItem,
        getData: getData,
        loadLocationChildren: loadLocationChildren,
        getNodes: getNodes,
        searchFacilityTypes: searchFacilityTypes
    };
};
