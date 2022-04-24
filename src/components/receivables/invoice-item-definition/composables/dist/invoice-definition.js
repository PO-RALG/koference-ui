"use strict";
exports.__esModule = true;
exports.useInvoiceDefinition = void 0;
var composition_api_1 = require("@vue/composition-api");
var invoice_item_definition_1 = require("../services/invoice-item-definition");
var funding_sources_1 = require("@/components/coa/funding-source/services/funding-sources");
exports.useInvoiceDefinition = function () {
    var dataItems = [];
    var customerData;
    var gfsCodeData;
    var data = composition_api_1.reactive({
        title: "Manage Invoice Item Definition",
        modalTitle: "",
        headers: [
            { text: "Name", align: "start", sortable: false, value: "name" },
            {
                text: "Unit of Measure",
                align: "start",
                sortable: false,
                value: "unit_of_measure"
            },
            { text: "Code", align: "start", sortable: false, value: "code" },
            {
                text: "Description",
                align: "start",
                sortable: false,
                value: "description"
            },
            { text: "Fund Source", value: "fund_source.code", sortable: true },
            { text: "Gfs Code", value: "gfs_code.code", sortable: true },
            { text: "Activation", value: "activations", sortable: false },
            { text: "Actions", value: "actions", sortable: false },
        ],
        modal: false,
        deletemodal: false,
        items: dataItems,
        itemsToFilter: [],
        formData: customerData,
        rows: ["10", "20", "50", "100"],
        itemtodelete: "",
        response: {},
        gfscodes: gfsCodeData,
        fundsourcesGfscodes: [],
        fundingsources: []
    });
    composition_api_1.onMounted(function () {
        initialize();
    });
    var initialize = function () {
        invoice_item_definition_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
            data.itemsToFilter = response.data.data.data;
        });
        funding_sources_1.fundingsources({ per_page: 2000 }).then(function (response) {
            data.fundingsources = response.data.data.data;
        });
    };
    var gfsName = composition_api_1.computed(function () {
        return data.gfscodes && data.gfscodes.gfs_codes
            ? data.gfscodes.gfs_codes.map(function (gfsCodeItem) {
                gfsCodeItem.fullName = gfsCodeItem.code + " - " + gfsCodeItem.name + " ";
                return gfsCodeItem;
            })
            : [];
    });
    var fundingsourceName = composition_api_1.computed(function () {
        return data.fundingsources.map(function (fundingsourceItem) {
            fundingsourceItem.sourceName = fundingsourceItem.code + " - " + fundingsourceItem.description + " ";
            return fundingsourceItem;
        });
    });
    var setActivation = function (item) {
        invoice_item_definition_1.activation(item).then(function (response) {
            console.log("activated data", response.data);
            reloadData();
        });
    };
    var searchCategory = function (categoryName) {
        console.log("argument", categoryName);
        if (categoryName != null) {
            invoice_item_definition_1.search({ name: categoryName.name }).then(function (response) {
                //// data", response.data.data.data);
                data.items = response.data.data.data;
            });
        }
        else {
            reloadData();
        }
    };
    var reloadData = function () {
        invoice_item_definition_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
        });
    };
    var deleteInvoiceItemdefinition = function (deleteId) {
        data.deletemodal = !data.modal;
        data.itemtodelete = deleteId;
        // console.log("delete year", data);
    };
    var getInvoiceItemdefinition = function () {
        invoice_item_definition_1.get(data).then(function (response) {
            console.log("data", response.data);
        });
    };
    var cancelDialog = function () {
        data.formData = {};
        data.modal = !data.modal;
        data.gfscodes = {};
    };
    var cancelConfirmDialog = function () {
        data.formData = {};
        data.deletemodal = false;
    };
    var remove = function () {
        console.log("delete data with id", data.itemtodelete);
        invoice_item_definition_1.destroy(data.itemtodelete).then(function () {
            reloadData();
            data.deletemodal = false;
        });
    };
    var save = function () {
        console.log("Form Data", data.formData);
        if (data.formData.id) {
            updateInvoiceItemDefinition(data.formData);
        }
        else {
            createCustomer(data.formData);
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
    var updateInvoiceItemDefinition = function (data) {
        invoice_item_definition_1.update(data).then(function (response) {
            console.log("Updated data", response.data);
            reloadData();
            cancelDialog();
        });
    };
    var createCustomer = function (data) {
        invoice_item_definition_1.create(data).then(function (response) {
            console.log("Created data", response.data);
            reloadData();
            cancelDialog();
        });
    };
    var getData = function (params) {
        data.response = params;
        invoice_item_definition_1.get(params).then(function (response) {
            data.response = response.data.data;
            data.items = response.data.data.data;
        });
    };
    var loadGfsCodes = function (params) {
        data.fundsourcesGfscodes = fundingsourceName.value.filter(function (word) { return word.id === params; });
    };
    return {
        data: data,
        getData: getData,
        openDialog: openDialog,
        cancelDialog: cancelDialog,
        deleteInvoiceItemdefinition: deleteInvoiceItemdefinition,
        getInvoiceItemdefinition: getInvoiceItemdefinition,
        updateInvoiceItemDefinition: updateInvoiceItemDefinition,
        save: save,
        reloadData: reloadData,
        remove: remove,
        cancelConfirmDialog: cancelConfirmDialog,
        searchCategory: searchCategory,
        setActivation: setActivation,
        gfsName: gfsName,
        fundingsourceName: fundingsourceName,
        loadGfsCodes: loadGfsCodes
    };
};
