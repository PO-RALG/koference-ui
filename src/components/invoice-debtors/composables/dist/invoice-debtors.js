"use strict";
exports.__esModule = true;
exports.useInvoiceDebtor = void 0;
var composition_api_1 = require("@vue/composition-api");
var invoice_debtor_service_1 = require("../services/invoice-debtor.service");
var invoice_1 = require("../../invoice/services/invoice");
exports.useInvoiceDebtor = function () {
    var invoiceDebtorData = [];
    var invoiceData = [];
    var data = composition_api_1.reactive({
        title: "Manage Invoice Debtors",
        modalTitle: "",
        headers: [
            { text: "Actions", align: "start", value: "actions", sortable: false },
            { text: "Name", align: "start", sortable: false, value: "name" },
            { text: "Email", align: "start", sortable: false, value: "email" },
            { text: "Address", align: "start", sortable: false, value: "address" },
            { text: "Phone", align: "start", sortable: false, value: "phone" },
        ],
        HEADERS_INVOICE_DETAILS: [
            {
                text: "Item Name",
                align: "start",
                sortable: false,
                value: "invoice_number",
                width: "30%"
            },
            {
                text: "Amount",
                align: "start",
                sortable: false,
                value: "amount",
                width: "15%"
            },
            {
                text: "Received Amount",
                align: "start",
                sortable: false,
                value: "amount",
                width: "15%"
            },
            {
                text: "Balance ",
                align: "start",
                sortable: false,
                value: "amount",
                width: "15%"
            },
        ],
        invoice_headers: [
            {
                text: "Invoice Number",
                sortable: false,
                value: "invoice_number",
                width: "17%"
            },
            { text: "Invoice Date", value: "date", sortable: true },
            {
                text: "Description",
                align: "start",
                sortable: false,
                value: "description"
            },
            {
                text: "Amount",
                align: "start",
                sortable: false,
                value: "amount"
            },
            {
                text: "Received Amount",
                align: "start",
                sortable: false,
                value: "received_amount"
            },
            {
                text: "Pending Amount",
                align: "start",
                sortable: false,
                value: "pending"
            },
        ],
        viewInvoiceDialog: false,
        items: invoiceDebtorData,
        itemsToFilter: [],
        rows: ["10", "20", "50", "100"],
        response: {},
        invoices: invoiceData,
        selectedDebtor: {},
        invoiceData: invoiceData,
        invoicedetails: false
    });
    composition_api_1.onMounted(function () {
        invoice_debtor_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
            data.itemsToFilter = response.data.data.data;
        });
    });
    composition_api_1.computed(function () {
        return "test";
    });
    var searchCategory = function (categoryName) {
        console.log("argument", categoryName);
        if (categoryName != null) {
            invoice_debtor_service_1.search({ email: categoryName.email }).then(function (response) {
                data.items = response.data.data.data;
            });
        }
        else {
            reloadData();
        }
    };
    var reloadData = function () {
        invoice_debtor_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
        });
    };
    var viewInvoice = function (debtor) {
        data.selectedDebtor = debtor;
        var params = { customer_id: debtor.id };
        invoice_1.search(params).then(function (response) {
            if (response.data.status === 200) {
                data.viewInvoiceDialog = true;
                var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
                data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
                data.invoices = response.data.data.data;
            }
        });
    };
    var getInvoiceDebtor = function () {
        invoice_debtor_service_1.get(data).then(function (response) {
            console.log("data", response.data);
        });
    };
    var cancelDialog = function () {
        data.viewInvoiceDialog = false;
    };
    var getData = function (params) {
        data.response = params;
        invoice_debtor_service_1.get(params).then(function (response) {
            data.response = response.data.data;
            data.items = response.data.data.data;
        });
    };
    var previewInvoice = function (item) {
        invoice_1.viewinvoice(item).then(function (response) {
            data.invoiceData = response.data.data;
            data.invoicedetails = true;
            data.viewInvoiceDialog = false;
        });
    };
    var cancelInvoiceDialog = function () {
        data.invoicedetails = false;
        data.viewInvoiceDialog = true;
    };
    return {
        data: data,
        getData: getData,
        cancelDialog: cancelDialog,
        viewInvoice: viewInvoice,
        getInvoiceDebtor: getInvoiceDebtor,
        reloadData: reloadData,
        searchCategory: searchCategory,
        previewInvoice: previewInvoice,
        cancelInvoiceDialog: cancelInvoiceDialog
    };
};
