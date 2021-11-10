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
exports.useReceipt = void 0;
var composition_api_1 = require("@vue/composition-api");
var invoice_1 = require("../services/invoice");
var customer_service_1 = require("@/components/setup/customer/services/customer.service");
var back_accounts_service_1 = require("@/components/setup/bank-account/services/back-accounts.service");
var invoice_item_definition_1 = require("@/components/setup/invoice-item-definition/services/invoice-item-definition");
exports.useReceipt = function () {
    var dataItems = [];
    var invoiceData;
    var HEADERS = [
        {
            text: "GLAccount",
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
            text: "",
            align: "center",
            sortable: false,
            value: "amount_pending",
            width: "13%"
        },
    ];
    var HEADERS_INVOICE_DETAILS = [
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
    ];
    var RECEIPTHEADERS = [
        {
            text: "Item",
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
            text: "Amount Received",
            align: "start",
            sortable: false,
            value: "amount_received",
            width: "17%"
        },
        {
            text: "Add Amount",
            align: "start",
            sortable: false,
            value: "amount_pending",
            width: "15%"
        },
    ];
    var data = composition_api_1.reactive({
        invoicereceip: {
            invoice_id: "",
            date: "",
            description: "",
            customer_id: "",
            bank_account_id: "",
            bank_reference_number: "",
            invoice_number: "",
            items: []
        },
        title: "Manage Receipts",
        modalTitle: "",
        headers: [
            {
                text: "Receipt Number",
                align: "start",
                sortable: false,
                value: "receipt_number"
            },
            {
                text: "Amount",
                align: "start",
                sortable: false,
                value: "amount"
            },
            {
                text: "Customer",
                align: "start",
                sortable: false,
                value: "customer.name"
            },
            { text: "Receipt Date", value: "date", sortable: true },
            {
                text: "Description",
                align: "start",
                sortable: false,
                value: "description"
            },
            {
                text: "Action",
                align: "start",
                sortable: false,
                value: "actions"
            },
        ],
        modal: false,
        deletemodal: false,
        invoicedetails: false,
        items: dataItems,
        itemsToFilter: [],
        formData: invoiceData,
        rows: ["10", "20", "50", "100"],
        itemTodelete: "",
        response: {},
        bankName: [],
        customers: [],
        glAccounts: [],
        invoicedata: invoiceData,
        bankaccounts: [],
        customer: [],
        receipt_items: [
            {
                gl_account_id: "",
                amount: ""
            },
        ],
        loading: false,
        coat: "/coat_of_arms.svg.png",
        toSave: {}
    });
    composition_api_1.onMounted(function () {
        data.loading = true;
        invoice_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
            data.itemsToFilter = response.data.data.data;
            data.loading = false;
        });
        customer_service_1.customers({ per_page: 2000, active: true }).then(function (response) {
            data.customers = response.data.data.data;
        });
    });
    var searchCategory = function (categoryName) {
        console.log("receipt_number", categoryName);
        if (categoryName != null) {
            invoice_1.search({ receipt_number: categoryName.receipt_number }).then(function (response) {
                data.items = response.data.data.data;
            });
        }
        else {
            reloadData();
        }
    };
    var reloadData = function () {
        invoice_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
        });
    };
    var deleteInvoiceItemdefinition = function (deleteId) {
        data.deletemodal = !data.modal;
        data.itemTodelete = deleteId;
        data.invoicedetails = false;
    };
    var getInvoiceItemdefinition = function () {
        invoice_1.get(data);
    };
    var cancelDialog = function () {
        data.formData = {};
        (data.receipt_items = [
            {
                gl_account_id: "",
                amount: ""
            },
        ]),
            (data.modal = !data.modal);
    };
    var cancelInvoiceDialog = function () {
        data.invoicedetails = false;
    };
    var cancelInvoiceReceipt = function () {
        data.invoicedetails = true;
        data.invoicereceip.items = [];
    };
    var bankName = composition_api_1.computed(function () {
        return data.bankaccounts.map(function (account) {
            account.fullName = "Account Number -" + account.number + "  " + account.bank + " - " + account.branch;
            return account;
        });
    });
    var cancelConfirmDialog = function () {
        data.formData = {};
        data.deletemodal = false;
    };
    var remove = function () {
        invoice_1.destroy(data.itemTodelete).then(function () {
            reloadData();
            data.deletemodal = false;
        });
    };
    var save = function () {
        data.formData.items = data.receipt_items;
        if (data.formData.id) {
            updateInvoiceItemDefinition(data.formData);
        }
        else {
            createInvoice(data.formData);
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
        back_accounts_service_1.bankaccounts({ per_page: 2000 }).then(function (response) {
            data.bankaccounts = response.data.data.data;
        });
        invoice_item_definition_1.glAccounts({ per_page: 2000, gl_account_type: "REVENUE" }).then(function (response) {
            data.glAccounts = response.data.data.data;
        });
    };
    var newreceiptItem = composition_api_1.computed(function () {
        return data.items
            ? data.items.map(function (data, index) { return (__assign(__assign({}, data), { index: ++index, tatizo: data })); })
            : [];
    });
    var updateInvoiceItemDefinition = function (data) {
        invoice_1.update(data).then(function () {
            reloadData();
            cancelDialog();
        });
    };
    var createInvoice = function (data) {
        invoice_1.create(data).then(function () {
            reloadData();
            cancelDialog();
        });
    };
    var getData = function (params) {
        data.response = params;
        invoice_1.get(params).then(function (response) {
            data.response = response.data.data;
            data.items = response.data.data.data;
        });
    };
    var addRow = function () {
        data.receipt_items.push({
            gl_account_id: "",
            amount: ""
        });
    };
    var checkDublicate = function (value, index) {
        var obj = data.receipt_items.filter(function (o) { return o.gl_account_id === value; });
        if (obj.length < 2) {
            // addRow();
        }
        else {
            data.receipt_items.splice(index, 10000);
        }
    };
    var removeRow = function (index) {
        data.receipt_items.splice(index, 1);
    };
    var print = function (id) {
        invoice_1.printReceipt(id);
    };
    var previewInvoice = function (item) {
        invoice_1.viewinvoice(item).then(function (response) {
            data.invoicedata = response.data.data;
            data.invoicedetails = true;
        });
    };
    var newInvoiceItems = composition_api_1.computed(function () {
        if (data.invoicereceip) {
            return data.invoicereceip.items.map(function (item) {
                item.cleared = item.invoicedAmount == item.received ? true : false;
                return item;
            });
        }
    });
    return {
        data: data,
        getData: getData,
        addRow: addRow,
        removeRow: removeRow,
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
        previewInvoice: previewInvoice,
        cancelInvoiceDialog: cancelInvoiceDialog,
        cancelInvoiceReceipt: cancelInvoiceReceipt,
        HEADERS: HEADERS,
        RECEIPTHEADERS: RECEIPTHEADERS,
        bankName: bankName,
        HEADERS_INVOICE_DETAILS: HEADERS_INVOICE_DETAILS,
        newInvoiceItems: newInvoiceItems,
        checkDublicate: checkDublicate,
        newreceiptItem: newreceiptItem,
        print: print
    };
};
