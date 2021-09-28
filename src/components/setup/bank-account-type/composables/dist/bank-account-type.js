"use strict";
exports.__esModule = true;
exports.useBankAccountType = void 0;
var composition_api_1 = require("@vue/composition-api");
var banck_account_types_service_1 = require("../services/banck-account-types.service");
var gfs_code_1 = require("@/components/coa/gfs-code/composables/gfs-code");
exports.useBankAccountType = function () {
    var dataItems = [];
    var customerData;
    var getGfsCodes = gfs_code_1.useGfsCode().getGfsCodes;
    var data = composition_api_1.reactive({
        title: "Manage Bank Account Types",
        modalTitle: "",
        headers: [
            { text: "Name", align: "start", sortable: false, value: "name" },
            {
                text: "Gfs code",
                align: "start",
                sortable: false,
                value: "gfs_code.name"
            },
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
        gfscodes: []
    });
    composition_api_1.onMounted(function () {
        initialize();
    });
    var initialize = function () {
        banck_account_types_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
            data.itemsToFilter = response.data.data.data;
        });
    };
    var searchCategory = function (categoryName) {
        if (categoryName != null) {
            banck_account_types_service_1.search({ name: categoryName.name }).then(function (response) {
                console.log("response data", response.data.data);
                data.items = response.data.data;
            });
        }
        else {
            reloadData();
        }
    };
    var reloadData = function () {
        banck_account_types_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
        });
    };
    var deleteBankAccountType = function (deleteId) {
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
        console.log("delete data with id", data.itemtodelete);
        banck_account_types_service_1.destroy(data.itemtodelete).then(function () {
            reloadData();
            data.deletemodal = false;
        });
    };
    var save = function () {
        console.log("Form Data", data.formData);
        if (data.formData.id) {
            updateCustomer(data.formData);
        }
        else {
            createCustomer(data.formData);
        }
    };
    var openDialog = function (formData) {
        loadGfsCodes();
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
    var loadGfsCodes = function () {
        getGfsCodes().then(function (response) {
            data.gfscodes = response.data.data.data;
        });
    };
    var gfsCodes = composition_api_1.computed(function () {
        return data.gfscodes.map(function (gfs) {
            gfs.fullName = "(" + gfs.code + ") - " + gfs.name;
            return gfs;
        });
    });
    var updateCustomer = function (data) {
        banck_account_types_service_1.update(data).then(function (response) {
            console.log("Updated data", response.data);
            reloadData();
            cancelDialog();
        });
    };
    var createCustomer = function (data) {
        banck_account_types_service_1.create(data).then(function (response) {
            console.log("Created data", response.data);
            reloadData();
            cancelDialog();
        });
    };
    var getData = function (params) {
        data.response = params;
        banck_account_types_service_1.get(params).then(function (response) {
            data.response = response.data.data;
            data.items = response.data.data.data;
        });
    };
    return {
        data: data,
        getData: getData,
        openDialog: openDialog,
        cancelDialog: cancelDialog,
        deleteBankAccountType: deleteBankAccountType,
        save: save,
        reloadData: reloadData,
        remove: remove,
        cancelConfirmDialog: cancelConfirmDialog,
        searchCategory: searchCategory,
        gfsCodes: gfsCodes
    };
};
