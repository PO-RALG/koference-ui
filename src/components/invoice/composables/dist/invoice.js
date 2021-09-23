"use strict";
exports.__esModule = true;
exports.useInvoice = void 0;
var composition_api_1 = require("@vue/composition-api");
var invoice_1 = require("../services/invoice");
var gfs_service_1 = require("@/components/coa/gfs-code/service/gfs.service");
var customer_service_1 = require("@/components/setup/customer/services/customer.service");
var back_accounts_service_1 = require("@/components/setup/bank-account/services/back-accounts.service");
var invoice_item_definition_1 = require("@/components/setup/invoice-item-definition/services/invoice-item-definition");
exports.useInvoice = function () {
    var dataItems = [];
    var invoiceData;
    var HEADERS = [
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
            text: "Amount Pending",
            align: "start",
            sortable: false,
            value: "amount_pending",
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
            date: "",
            description: "",
            customer_id: "",
            bank_account_id: "",
            bank_reference_number: "",
            items: []
        },
        title: "Manage Invoice",
        modalTitle: "",
        headers: [
            {
                text: "Invoice Number",
                align: "start",
                sortable: false,
                value: "invoice_number"
            },
            { text: "Invoice Date", value: "date", sortable: true },
            {
                text: "Customer",
                align: "start",
                sortable: false,
                value: "customer.name"
            },
            {
                text: "Ammount",
                align: "start",
                sortable: false,
                value: "amount"
            },
            {
                text: "Amount Paid",
                align: "start",
                sortable: false,
                value: "amount"
            },
            {
                text: "Description",
                align: "start",
                sortable: false,
                value: "description"
            },
        ],
        modal: false,
        deletemodal: false,
        invoicedetails: false,
        invoicereceipt: false,
        items: dataItems,
        itemsToFilter: [],
        formData: invoiceData,
        rows: ["10", "20", "50", "100"],
        itemTodelete: "",
        response: {},
        bankName: [],
        customers: [],
        itemdefinitions: [],
        invoicedata: invoiceData,
        bankaccounts: [],
        customer: [],
        invoice_items: [
            {
                invoice_item_definition_id: "",
                amount: ""
            },
        ],
        loading: false,
        coat: "/coat_of_arms.svg.png"
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
        gfs_service_1.allgfscodes({ per_page: 2000 }).then(function (response) {
            data.bankName = response.data.data.data;
        });
        customer_service_1.customers({ per_page: 2000 }).then(function (response) {
            data.customers = response.data.data.data;
        });
        invoice_item_definition_1.itemdefinitions({ per_page: 2000 }).then(function (response) {
            data.itemdefinitions = response.data.data.data;
        });
    });
    var searchCategory = function (categoryName) {
        if (categoryName != null) {
            invoice_1.search({ invoice_number: categoryName.invoice_number }).then(function (response) {
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
        (data.invoice_items = [
            {
                invoice_item_definition_id: "",
                amount: ""
            },
        ]),
            (data.modal = !data.modal);
    };
    var cancelInvoiceDialog = function () {
        data.invoicedetails = false;
    };
    var cancelInvoiceReceipt = function () {
        data.invoicereceipt = false;
        data.invoicedetails = false;
        data.invoicereceip.items = [];
    };
    var openInvoiceReceipt = function (invoiceData) {
        data.invoicedetails = false;
        data.invoicereceipt = true;
        data.customer = [invoiceData]; //mapping customer in autocomplete field
        data.invoicereceip.customer_id = invoiceData; //mapping customer in autocomplete for two way binding
        if (data.invoicedata.invoice_items) {
            data.invoicedata.invoice_items.forEach(function (value) {
                var one_item = {
                    invoicedAmount: value.amount,
                    received: value.received_amount,
                    itemName: value.definition.name,
                    invoice_item_id: value.id,
                    amount: ""
                };
                data.invoicereceip.items.push(one_item);
            });
            back_accounts_service_1.bankaccounts({ per_page: 2000 }).then(function (response) {
                data.bankaccounts = response.data.data.data;
            });
        }
    };
    var bankName = composition_api_1.computed(function () {
        return data.bankaccounts.map(function (account) {
            account.fullName = "Account Number -" + account.number + ")  " + account.bank;
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
        data.formData.items = data.invoice_items;
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
    };
    var updateInvoiceItemDefinition = function (data) {
        invoice_1.update(data).then(function () {
            reloadData();
            cancelDialog();
        });
    };
    var createReceipt = function () {
        invoice_1.receiptcreate(data.invoicereceip);
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
        data.invoice_items.push({
            invoice_item_definition_id: "",
            amount: ""
        });
    };
    var removeRow = function (index) {
        data.invoice_items.splice(index, 1);
    };
    var previewInvoice = function (item) {
        invoice_1.viewinvoice(item).then(function (response) {
            data.invoicedata = response.data.data;
            data.invoicedetails = true;
        });
    };
    return {
        data: data,
        getData: getData,
        createReceipt: createReceipt,
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
        openInvoiceReceipt: openInvoiceReceipt,
        HEADERS: HEADERS,
        RECEIPTHEADERS: RECEIPTHEADERS,
        bankName: bankName
    };
};
