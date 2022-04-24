"use strict";
exports.__esModule = true;
exports.useProject = void 0;
var composition_api_1 = require("@vue/composition-api");
var project_service_1 = require("../services/project.service");
exports.useProject = function () {
    var dataItems = [];
    var financialYearData;
    var data = composition_api_1.reactive({
        title: "Manage projects",
        modalTitle: "",
        headers: [
            {
                text: "Project Code",
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
        response: {}
    });
    composition_api_1.onMounted(function () {
        project_service_1.get({ per_page: 10 }).then(function (response) {
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
            project_service_1.search({ code: categoryName.code }).then(function (response) {
                //// data", response);
                data.items = response.data.data.data;
            });
        }
        else {
            reloadData();
        }
    };
    var reloadData = function () {
        project_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
        });
    };
    var deleteProject = function (deleteId) {
        data.deletemodal = !data.modal;
        data.itemtodelete = deleteId;
        // console.log("delete year", data);
    };
    var getProject = function () {
        project_service_1.get(data).then(function (response) {
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
        project_service_1.destroy(data.itemtodelete).then(function () {
            reloadData();
            data.deletemodal = false;
        });
    };
    var save = function () {
        if (data.formData.id) {
            updateProject(data.formData);
        }
        else {
            createProject(data.formData);
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
    var updateProject = function (data) {
        project_service_1.update(data).then(function (response) {
            reloadData();
            cancelDialog();
        });
    };
    var createProject = function (data) {
        project_service_1.create(data).then(function (response) {
            reloadData();
            cancelDialog();
        });
    };
    var getData = function (params) {
        data.response = params;
        project_service_1.get(params).then(function (response) {
            data.response = response.data.data;
            data.items = response.data.data.data;
        });
    };
    return {
        data: data,
        getData: getData,
        openDialog: openDialog,
        cancelDialog: cancelDialog,
        deleteProject: deleteProject,
        getProject: getProject,
        updateProject: updateProject,
        save: save,
        reloadData: reloadData,
        remove: remove,
        cancelConfirmDialog: cancelConfirmDialog,
        searchCategory: searchCategory
    };
};
