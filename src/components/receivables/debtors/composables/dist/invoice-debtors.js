"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.useInvoiceDebtor = void 0;
var composition_api_1 = require("@vue/composition-api");
var invoice_debtor_service_1 = require("../services/invoice-debtor.service");
var invoice_1 = require("../../invoice/services/invoice");
exports.useInvoiceDebtor = function () {
    var invoiceDebtorData = [];
    var invoiceData;
    // const invoiceData: Array<Invoice> = [];
    var data = composition_api_1.reactive({
        title: "Manage Invoice Debtors",
        coat: "/coat_of_arms.svg.png",
        modalTitle: "",
        headers: [
            { text: "Customer", align: "start", sortable: false, value: "customer" },
            {
                text: "Invoice Number",
                align: "start",
                sortable: false,
                value: "invoice_number"
            },
            { text: "Age (days)", align: "start", sortable: false, value: "age" },
            { text: "Action", align: "start", sortable: false, value: "actions" },
        ],
        HEADERS_INVOICE_DETAILS: [
            {
                text: "No",
                align: "start",
                sortable: false,
                value: "no",
                width: "5%"
            },
            {
                text: "Item Name",
                align: "start",
                sortable: false,
                value: "item",
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
                value: "received_amount",
                width: "15%"
            },
            {
                text: "Pending Amount ",
                align: "start",
                sortable: false,
                value: "balance_amount",
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
    var newDetorsWithin30Days = composition_api_1.computed(function () {
        return data.items
            .filter(function (item) { return item.age >= 0 && item.age <= 29; })
            .map(function (data, index) { return (__assign(__assign({}, data), { index: ++index })); });
    });
    var newDetorsBelow30Days = composition_api_1.computed(function () {
        return data.items
            .filter(function (item) { return item.age >= 30 && item.age <= 90; })
            .map(function (data, index) { return (__assign(__assign({}, data), { index: ++index })); });
    });
    var newDetorsGreater90Days = composition_api_1.computed(function () {
        return data.items
            .filter(function (item) { return item.age >= 31 && item.age >= 91; })
            .map(function (data, index) { return (__assign(__assign({}, data), { index: ++index })); });
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
    var newInvoiceItem = composition_api_1.computed(function () {
        return data.invoiceData.invoice_items.map(function (data, index) { return (__assign(__assign({}, data), { index: ++index })); });
    });
    var invoicedAmount = composition_api_1.ref(newInvoiceItem);
    var sumDebts = composition_api_1.computed(function () {
        return {
            sumamount: invoicedAmount.value.reduce(function (sum, totalAmount) {
                return sum + Number(totalAmount.amount);
            }, 0),
            sumamountReceived: invoicedAmount.value.reduce(function (sum, totalAmount) {
                return sum + Number(totalAmount.received_amount);
            }, 0),
            sumamountPending: invoicedAmount.value.reduce(function (sum, totalAmount) {
                return sum + Number(totalAmount.amount - totalAmount.received_amount);
            }, 0)
        };
    });
    return {
        newInvoiceItem: newInvoiceItem,
        sumDebts: sumDebts,
        invoicedAmount: invoicedAmount,
        data: data,
        getData: getData,
        cancelDialog: cancelDialog,
        viewInvoice: viewInvoice,
        getInvoiceDebtor: getInvoiceDebtor,
        reloadData: reloadData,
        searchCategory: searchCategory,
        previewInvoice: previewInvoice,
        cancelInvoiceDialog: cancelInvoiceDialog,
        newDetorsWithin30Days: newDetorsWithin30Days,
        newDetorsBelow30Days: newDetorsBelow30Days,
        newDetorsGreater90Days: newDetorsGreater90Days
    };
};
