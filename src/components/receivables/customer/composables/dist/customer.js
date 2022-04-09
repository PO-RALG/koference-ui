"use strict";
exports.__esModule = true;
exports.useCustomer = void 0;
var composition_api_1 = require("@vue/composition-api");
var customer_service_1 = require("../services/customer.service");
exports.useCustomer = function () {
    var dataItems = [];
    var customerData;
    var data = composition_api_1.reactive({
        title: "Manage Customers",
        modalTitle: "",
        headers: [
            { text: "Name", align: "start", sortable: false, value: "name" },
            { text: "Email", align: "start", sortable: false, value: "email" },
            { text: "Address", align: "start", sortable: false, value: "address" },
            { text: "Phone", align: "start", sortable: false, value: "phone" },
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
        addcustomer: false,
        genericCustomer: [
            {
                id: "1",
                name: "NHIF",
                email: "nhif@gmail.com",
                phone: "0766158716",
                address: "PO.BOX 3478 DSM"
            },
            {
                id: "2",
                name: "WHO",
                email: "who@gmail.com",
                phone: "323299923",
                address: "PO.BOX 443 DDM"
            },
        ]
    });
    composition_api_1.onMounted(function () {
        customer_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
            data.itemsToFilter = response.data.data.data;
        });
    });
    var setActivation = function (item) {
        customer_service_1.activation(item).then(function (response) {
            console.log("activated data", response.data);
            reloadData();
        });
    };
    composition_api_1.computed(function () {
        return "test";
    });
    var isUpdate = composition_api_1.computed(function () {
        return data.modalTitle == "Update" ? true : false;
    });
    var searchCategory = function (categoryName) {
        console.log("argument", categoryName);
        if (categoryName != null) {
            customer_service_1.search({ name: categoryName.name }).then(function (response) {
                //// data", response.data.data);
                data.items = response.data.data;
            });
        }
        else {
            reloadData();
        }
    };
    var reloadData = function () {
        customer_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
        });
    };
    var deleteCustomer = function (deleteId) {
        data.deletemodal = !data.modal;
        data.itemtodelete = deleteId;
        // console.log("delete year", data);
    };
    var getCustomer = function () {
        customer_service_1.get(data).then(function (response) {
            console.log("data", response.data);
        });
    };
    var cancelDialog = function () {
        data.formData = {};
        data.modal = !data.modal;
        data.addcustomer = false;
    };
    var cancelConfirmDialog = function () {
        data.formData = {};
        data.deletemodal = false;
    };
    var remove = function () {
        console.log("delete data with id", data.itemtodelete);
        customer_service_1.destroy(data.itemtodelete).then(function () {
            reloadData();
            data.deletemodal = false;
        });
    };
    var save = function () {
        console.log("Form Data", data.formData);
        if (data.formData.id && isUpdate.value) {
            updatecustomer(data.formData);
        }
        else {
            delete data.formData.id;
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
    var updatecustomer = function (data) {
        customer_service_1.update(data).then(function (response) {
            console.log("Updated data", response.data);
            reloadData();
            cancelDialog();
        });
    };
    var createCustomer = function (data) {
        customer_service_1.create(data).then(function (response) {
            console.log("Created data", response.data);
            reloadData();
            cancelDialog();
        });
    };
    var getData = function (params) {
        data.response = params;
        customer_service_1.get(params).then(function (response) {
            data.response = response.data.data;
            data.items = response.data.data.data;
        });
    };
    var setAddCostomerValue = function () {
        data.addcustomer = true;
        data.formData = {};
    };
    var setGenericValue = function () {
        data.addcustomer = false;
        data.formData = {};
    };
    var populateFormData = function (event) {
        data.formData = event;
    };
    return {
        data: data,
        getData: getData,
        openDialog: openDialog,
        cancelDialog: cancelDialog,
        deleteCustomer: deleteCustomer,
        getCustomer: getCustomer,
        updatecustomer: updatecustomer,
        save: save,
        reloadData: reloadData,
        remove: remove,
        cancelConfirmDialog: cancelConfirmDialog,
        searchCategory: searchCategory,
        setActivation: setActivation,
        setAddCostomerValue: setAddCostomerValue,
        setGenericValue: setGenericValue,
        populateFormData: populateFormData,
        isUpdate: isUpdate
    };
};
