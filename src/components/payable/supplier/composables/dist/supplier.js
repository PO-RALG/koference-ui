"use strict";
exports.__esModule = true;
exports.useSupplier = void 0;
var composition_api_1 = require("@vue/composition-api");
var supplier_services_1 = require("../services/supplier.services");
exports.useSupplier = function () {
    var dataItems = [];
    var supplyData = {};
    var data = composition_api_1.reactive({
        title: "Manage Suppliers",
        valid: false,
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
                text: "Email",
                align: "start",
                sortable: false,
                value: "email"
            },
            {
                text: "TIN",
                align: "start",
                sortable: false,
                value: "tin"
            },
            {
                text: "Phone",
                align: "start",
                sortable: false,
                value: "phone"
            },
            {
                text: "Type",
                align: "start",
                sortable: false,
                value: "supplier_type"
            },
            {
                text: "Bank Name",
                align: "start",
                sortable: false,
                value: "bank_name"
            },
            {
                text: "Bank Account Name",
                align: "start",
                sortable: false,
                value: "bank_account_name"
            },
            {
                text: "Bank Account Number",
                align: "start",
                sortable: false,
                value: "bank_account_number"
            },
            {
                text: "Activation",
                align: "start",
                sortable: false,
                value: "activations"
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
        itemsToFilter: [],
        formData: supplyData,
        params: {
            total: 100,
            size: 10
        },
        rows: ["10", "20", "50", "100"],
        itemtodelete: "",
        searchTerm: "",
        focus: false,
        supplierTypes: ["Contractor", "Employee", "Others"],
        phoneRules: [
            function (v) { return !!v || "Phone number is required"; },
            function (v) {
                return (v && v.length <= 10) || "Phone number must be less than 10 characters";
            },
        ],
        tinRules: [
            function (v) { return !!v || "TIN is required"; },
            function (v) {
                return /^[\d]{3}-[\d]{3}-[\d]{3}$/.test(v) ||
                    "TIN must be valid. e.g 000-111-222";
            },
        ],
        checkRules: [
            function (v) { return !!v || "Number is required"; },
            function (v) {
                return (v && v.length <= 10) || "Number must be less than 10 characters";
            },
        ]
    });
    composition_api_1.onMounted(function () {
        getTableData();
    });
    var getTableData = function () {
        supplier_services_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.items = response.data.data.data;
            data.itemsToFilter = response.data.data.data;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
        });
    };
    var searchItem = function (itemName) {
        if (itemName != null) {
            supplier_services_1.search({ name: itemName.name }).then(function (response) {
                data.items = response.data.data.data;
            });
        }
    };
    var getData = function (params) {
        data.response = params;
        supplier_services_1.get(params).then(function (response) {
            data.response = response.data.data;
            data.items = response.data.data.data;
        });
    };
    var openConfirmDialog = function (deleteId) {
        data.deletemodal = !data.modal;
        data.itemtodelete = deleteId;
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
        supplier_services_1.destroy(data.itemtodelete).then(function () {
            data.deletemodal = false;
            getTableData();
        });
    };
    var save = function () {
        if (data.formData.id) {
            updateSupplier(data.formData);
        }
        else {
            createSupplier(data.formData);
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
    var updateSupplier = function (data) {
        supplier_services_1.update(data).then(function () {
            cancelDialog();
            getTableData();
        });
    };
    var createSupplier = function (data) {
        supplier_services_1.create(data).then(function () {
            cancelDialog();
            getTableData();
        });
    };
    var setActivation = function (item) {
        supplier_services_1.activation(item).then(function () {
            getTableData();
        });
    };
    return {
        data: data,
        openDialog: openDialog,
        cancelDialog: cancelDialog,
        openConfirmDialog: openConfirmDialog,
        updateSupplier: updateSupplier,
        save: save,
        remove: remove,
        cancelConfirmDialog: cancelConfirmDialog,
        searchItem: searchItem,
        getData: getData,
        setActivation: setActivation
    };
};
