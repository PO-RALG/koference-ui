"use strict";
exports.__esModule = true;
exports.useFundSource = void 0;
var gfs_service_1 = require("@/components/coa/gfs-code/service/gfs.service");
var composition_api_1 = require("@vue/composition-api");
var funding_sources_1 = require("../services/funding-sources");
exports.useFundSource = function () {
    var dataItems = [];
    var financialYearData;
    var data = composition_api_1.reactive({
        title: "Manage Funding Sources",
        modalTitle: "",
        headers: [
            {
                text: "Funding Sources Code",
                align: "start",
                sortable: false,
                value: "code"
            },
            {
                text: "Description",
                align: "start",
                sortable: false,
                value: "description"
            },
            { text: "Actions", value: "actions", sortable: false },
        ],
        modal: false,
        deletemodal: false,
        items: dataItems,
        itemsToFilter: [],
        formData: financialYearData,
        rows: ["10", "20", "50", "100"],
        itemtodelete: "",
        response: {},
        selectedGfs: [],
        gfscodes: []
    });
    composition_api_1.onMounted(function () {
        funding_sources_1.get({ per_page: 10 }).then(function (response) {
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
    });
    var searchCategory = function (categoryName) {
        console.log("argument", categoryName);
        if (categoryName != null) {
            funding_sources_1.search({ code: categoryName.code }).then(function (response) {
                //// data", response);
                data.items = response.data.data.data;
            });
        }
        else {
            reloadData();
        }
    };
    var reloadData = function () {
        funding_sources_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
        });
    };
    var deleteFundingSource = function (deleteId) {
        data.deletemodal = !data.modal;
        data.itemtodelete = deleteId;
        // console.log("delete year", data);
    };
    var getFunfingSources = function () {
        funding_sources_1.get(data).then(function (response) {
            console.log("data", response.data);
        });
    };
    var cancelDialog = function () {
        data.formData = {};
        data.selectedGfs = [];
        data.modal = !data.modal;
    };
    var cancelConfirmDialog = function () {
        data.formData = {};
        data.deletemodal = false;
    };
    var remove = function () {
        funding_sources_1.destroy(data.itemtodelete).then(function () {
            reloadData();
            data.deletemodal = false;
        });
    };
    var save = function () {
        console.log("Form Data", data.formData);
        if (data.formData.id) {
            updateFunfingSources(data.formData);
        }
        else {
            createFundingSource(data.formData);
        }
    };
    var loadGfsCodes = function () {
        gfs_service_1.allgfscodes({ code: "REVENUE" }).then(function (response) {
            console.log("all gfs data", response.data.data.data);
            data.gfscodes = response.data.data.data[0].gfs_codes;
        });
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
        loadGfsCodes();
    };
    var updateFunfingSources = function (data) {
        funding_sources_1.update(data).then(function (response) {
            console.log("Updated data", response.data);
            reloadData();
            cancelDialog();
        });
    };
    var createFundingSource = function (data) {
        funding_sources_1.create(data).then(function (response) {
            console.log("Created data", response.data);
            reloadData();
            cancelDialog();
        });
    };
    var getData = function (params) {
        data.response = params;
        funding_sources_1.get(params).then(function (response) {
            data.response = response.data.data;
            data.items = response.data.data.data;
        });
    };
    var selectedGFS = composition_api_1.computed(function () {
        return data.selectedGfs;
    });
    var upsert = function (array, item) {
        var idx = array.findIndex(function (_item) { return _item.id === item.id; });
        if (idx > -1) {
            array.splice(idx, 1);
        }
        else {
            array.push(item);
        }
        return array;
    };
    var onChangeList = function (_a) {
        var source = _a.source, destination = _a.destination;
        destination.forEach(function (item) {
            data.gfscodes = upsert(source, item);
        });
        data.formData.gfscodes = destination;
    };
    return {
        data: data,
        openDialog: openDialog,
        getData: getData,
        cancelDialog: cancelDialog,
        deleteFundingSource: deleteFundingSource,
        getFunfingSources: getFunfingSources,
        updateFunfingSources: updateFunfingSources,
        save: save,
        reloadData: reloadData,
        remove: remove,
        cancelConfirmDialog: cancelConfirmDialog,
        searchCategory: searchCategory,
        selectedGFS: selectedGFS,
        onChangeList: onChangeList
    };
};
