"use strict";
exports.__esModule = true;
exports.useFacilityType = void 0;
var composition_api_1 = require("@vue/composition-api");
var facility_types_service_1 = require("../services/facility-types.service");
exports.useFacilityType = function () {
    var dataItems = [];
    var facilityTypeData;
    var data = composition_api_1.reactive({
        title: "Manage Facility Types",
        valid: true,
        isOpen: false,
        node: null,
        response: {},
        modalTitle: "",
        headers: [
            { text: "Name", align: "start", sortable: false, value: "name" },
            { text: "Code", align: "start", sortable: false, value: "code" },
            {
                text: "Cost Center",
                align: "start",
                sortable: false,
                value: "cost_center"
            },
            { text: "Actions", value: "actions", sortable: false },
        ],
        modal: false,
        deletemodal: false,
        items: dataItems,
        itemsToFilter: [],
        formData: facilityTypeData,
        rows: ["10", "20", "50", "100"],
        itemtodelete: ""
    });
    composition_api_1.onMounted(function () {
        fetchData();
    });
    var fetchData = function () {
        facility_types_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = {
                from: from,
                to: to,
                total: total,
                current_page: current_page,
                per_page: per_page,
                last_page: last_page
            };
            data.items = response.data.data.data;
            data.itemsToFilter = response.data.data.data;
        });
    };
    composition_api_1.computed(function () {
        return "test";
    });
    var searchCategory = function (categoryName) {
        if (categoryName != null) {
            facility_types_service_1.search({ name: categoryName.name }).then(function (response) {
                //// data", response.data.data);
                data.items = response.data.data.data;
            });
        }
    };
    var reloadData = function () {
        facility_types_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
        });
    };
    var openConfirmDialog = function (deleteId) {
        data.deletemodal = !data.modal;
        data.itemtodelete = deleteId;
        // console.log("delete year", data);
    };
    var getFacilityTypes = function () {
        facility_types_service_1.get(data).then(function (response) {
            console.log("data", response.data);
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
        facility_types_service_1.destroy(data.itemtodelete).then(function () {
            data.deletemodal = false;
            fetchData();
        });
    };
    var save = function () {
        if (data.formData.id) {
            updateFacilityType(data.formData);
        }
        else {
            createUser(data.formData);
        }
    };
    var openDialog = function (formData) {
        if (formData.id) {
            data.formData = formData;
            data.modalTitle = "Update";
        }
        else {
            data.formData = {};
            data.modalTitle = "Create";
        }
        data.modal = !data.modal;
    };
    var updateFacilityType = function (data) {
        facility_types_service_1.update(data).then(function (response) {
            cancelDialog();
            fetchData();
        });
    };
    var createUser = function (data) {
        facility_types_service_1.create(data).then(function (response) {
            if (response.data.status === 200) {
                cancelDialog();
                fetchData();
            }
        });
    };
    var getData = function (params) {
        data.response = params;
        facility_types_service_1.get(params).then(function (response) {
            data.response = response.data.data;
            data.items = response.data.data.data;
        });
    };
    return {
        data: data,
        openDialog: openDialog,
        getData: getData,
        cancelDialog: cancelDialog,
        openConfirmDialog: openConfirmDialog,
        getFacilityTypes: getFacilityTypes,
        updateFacilityType: updateFacilityType,
        save: save,
        remove: remove,
        cancelConfirmDialog: cancelConfirmDialog,
        searchCategory: searchCategory
    };
};
