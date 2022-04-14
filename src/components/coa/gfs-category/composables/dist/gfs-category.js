"use strict";
exports.__esModule = true;
exports.useGfsCategory = void 0;
var composition_api_1 = require("@vue/composition-api");
var gfs_categories_service_1 = require("../service/gfs-categories.service");
var account_service_1 = require("../../account/services/account.service");
exports.useGfsCategory = function () {
    var dataItems = [];
    var documentCategoryData;
    var imageUrl = composition_api_1.ref("");
    var data = composition_api_1.reactive({
        title: "Manage Gfs Categories",
        modalTitle: "",
        headers: [
            {
                text: "Open to View Gfs Codes",
                align: "start",
                sortable: false,
                value: "code"
            },
            {
                text: "Category Name",
                align: "start",
                sortable: false,
                value: "name"
            },
            {
                text: "Nature",
                align: "start",
                sortable: false,
                value: "account_nature"
            },
            {
                text: "Type",
                align: "start",
                sortable: false,
                value: "account_type"
            },
            { text: "Actions", value: "actions", sortable: false },
        ],
        gfsCodes: [
            { text: "Gfs Name", align: "start", sortable: false, value: "name" },
            { text: "Gfs Code", align: "start", sortable: false, value: "code" },
        ],
        modal: false,
        deletemodal: false,
        items: dataItems,
        ACCOUNT_TYPES: [],
        ACCOUNT_NATURE: [],
        itemsToFilter: [],
        formData: documentCategoryData,
        params: {
            total: 10,
            size: 10
        },
        documentcategories: [],
        rows: ["10", "20", "50", "100"],
        itemtodelete: "",
        response: {}
    });
    composition_api_1.onMounted(function () {
        gfs_categories_service_1.get({ per_page: 10 }).then(function (response) {
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
        getAccounts();
    });
    var getAccounts = function () {
        account_service_1.getTypes().then(function (response) {
            data.ACCOUNT_TYPES = response.data.data;
        });
        account_service_1.getNature().then(function (response) {
            data.ACCOUNT_NATURE = response.data.data;
        });
    };
    var searchCategory = function (categoryName) {
        console.log("argument", categoryName);
        if (categoryName != null) {
            gfs_categories_service_1.search({ name: categoryName.name }).then(function (response) {
                //// data", response);
                data.items = response.data.data.data;
            });
        }
        else {
            reloadData();
        }
    };
    var reloadData = function () {
        gfs_categories_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
        });
    };
    var deleteGfsCategory = function (deleteId) {
        data.deletemodal = !data.modal;
        data.itemtodelete = deleteId;
        // console.log("delete year", data);
    };
    var getGfsCategory = function () {
        gfs_categories_service_1.get(data).then(function (response) {
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
        console.log("delete data with id", data.itemtodelete);
        gfs_categories_service_1.destroy(data.itemtodelete).then(function () {
            reloadData();
            data.deletemodal = false;
        });
    };
    var save = function () {
        console.log("Form Data", data.formData);
        if (data.formData.id) {
            updateGfsCategory(data.formData);
        }
        else {
            createCategory(data.formData);
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
    var updateGfsCategory = function (data) {
        gfs_categories_service_1.update(data).then(function (response) {
            reloadData();
            cancelDialog();
        });
    };
    var createCategory = function (data) {
        gfs_categories_service_1.create(data).then(function (response) {
            reloadData();
            cancelDialog();
        });
    };
    // watching a getter
    var getData = function (params) {
        data.response = params;
        gfs_categories_service_1.get(params).then(function (response) {
            data.response = response.data.data;
            data.items = response.data.data.data;
        });
    };
    return {
        data: data,
        getData: getData,
        openDialog: openDialog,
        cancelDialog: cancelDialog,
        deleteGfsCategory: deleteGfsCategory,
        getGfsCategory: getGfsCategory,
        updateGfsCategory: updateGfsCategory,
        save: save,
        reloadData: reloadData,
        remove: remove,
        cancelConfirmDialog: cancelConfirmDialog,
        searchCategory: searchCategory,
        imageUrl: imageUrl
    };
};
