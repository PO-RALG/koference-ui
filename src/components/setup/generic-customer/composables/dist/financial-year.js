"use strict";
exports.__esModule = true;
exports.useFinancialYear = void 0;
var composition_api_1 = require("@vue/composition-api");
var financialyear_service_1 = require("../services/financialyear.service");
exports.useFinancialYear = function () {
    var dataItems = [];
    var financialYearData;
    var data = composition_api_1.reactive({
        title: "Manage Finacial Years",
        modalTitle: "",
        headers: [
            { text: "Name", align: "start", sortable: false, value: "name" },
            { text: "Start Date", value: "start_date" },
            { text: "End Date", value: "end_date" },
            { text: "Activation", value: "activations", sortable: false },
            { text: "Actions", value: "actions", sortable: false },
        ],
        modal: false,
        deletemodal: false,
        items: dataItems,
        itemsToFilter: [],
        formData: financialYearData,
        rows: ["10", "20", "50", "100"],
        itemtodelete: "",
        response: {}
    });
    composition_api_1.onMounted(function () {
        initialize();
    });
    var initialize = function () {
        financialyear_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
            data.itemsToFilter = response.data.data.data;
        });
    };
    var searchFinancialYear = function (categoryName) {
        if (categoryName != null) {
            financialyear_service_1.search({ name: categoryName.name }).then(function (response) {
                data.items = response.data.data.data;
            });
        }
        else {
            reloadData();
        }
    };
    var toggleStatus = function (item) {
        financialyear_service_1.startFinancialYear(item).then(function (response) {
            if (response.status === 200) {
                reloadData();
            }
        });
    };
    var reloadData = function () {
        financialyear_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
        });
    };
    var deleteFinancialYear = function (deleteId) {
        data.deletemodal = !data.modal;
        data.itemtodelete = deleteId;
        // console.log("delete year", data);
    };
    var getFinancialYear = function () {
        financialyear_service_1.get(data).then(function (response) {
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
        financialyear_service_1.destroy(data.itemtodelete).then(function () {
            reloadData();
            data.deletemodal = false;
        });
    };
    var save = function () {
        if (data.formData.id) {
            updateFinancialYear(data.formData);
        }
        else {
            createFinancialYear(data.formData);
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
    var updateFinancialYear = function (data) {
        financialyear_service_1.update(data).then(function (response) {
            if (response.status === 200) {
                reloadData();
                cancelDialog();
            }
        });
    };
    var createFinancialYear = function (data) {
        financialyear_service_1.create(data).then(function (response) {
            if (response.status === 200) {
                reloadData();
                cancelDialog();
            }
        });
    };
    var getData = function (params) {
        data.response = params;
        financialyear_service_1.get(params).then(function (response) {
            data.response = response.data.data;
            data.items = response.data.data.data;
        });
    };
    return {
        data: data,
        getData: getData,
        openDialog: openDialog,
        cancelDialog: cancelDialog,
        deleteFinancialYear: deleteFinancialYear,
        getFinancialYear: getFinancialYear,
        updateFinancialYear: updateFinancialYear,
        save: save,
        reloadData: reloadData,
        remove: remove,
        cancelConfirmDialog: cancelConfirmDialog,
        toggleStatus: toggleStatus,
        searchFinancialYear: searchFinancialYear
    };
};
