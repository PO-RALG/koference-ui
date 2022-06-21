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
exports.useStaleCheque = void 0;
var composition_api_1 = require("@vue/composition-api");
var stale_check_1 = require("../services/stale-check");
var gfs_service_1 = require("@/components/coa/gfs-code/service/gfs.service");
var customer_service_1 = require("@/components/receivables/customer/services/customer.service");
var bank_account_service_1 = require("@/components/setup/bank-account/services/bank-account.service");
var invoice_item_definition_1 = require("@/components/receivables/invoice-item-definition/services/invoice-item-definition");
var moment_1 = require("moment");
exports.useStaleCheque = function () {
    var dataItems = [];
    var paymentData;
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
        maxDate: moment_1["default"](new Date()).format("YYYY-MM-DD"),
        title: "Manage StaleCheck",
        modalTitle: "",
        headers: [
            {
                text: "Voucher Number",
                align: "start",
                sortable: false,
                value: "voucher_number"
            },
            { text: "StaleCheck Date", value: "date", sortable: true },
            {
                text: "Description",
                align: "start",
                sortable: false,
                value: "description"
            },
            {
                text: "Bank",
                align: "start",
                sortable: false,
                value: "bank_account"
            },
            {
                text: "Amount [ TZS ]",
                align: "start",
                sortable: false,
                value: "amount"
            },
        ],
        modal: false,
        deletemodal: false,
        paymentdetails: false,
        invoicereceipt: false,
        items: dataItems,
        itemsToFilter: [],
        formData: paymentData,
        rows: ["10", "20", "50", "100"],
        itemTodelete: "",
        response: {},
        bankName: [],
        customers: [],
        itemdefinitions: [],
        paymentData: paymentData,
        bankaccounts: [],
        customer: [],
        invoice_items: [
            {
                invoice_item_definition_id: "",
                amount: ""
            },
        ],
        loading: false,
        coat: "/coat_of_arms.svg.png",
        toSave: {},
        searchTerm: "",
        search: ""
    });
    composition_api_1.onMounted(function () {
        data.loading = true;
        stale_check_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
            data.itemsToFilter = response.data.data.data;
            data.loading = false;
        });
        gfs_service_1.allgfscodes({ per_page: 20000 }).then(function (response) {
            data.bankName = response.data.data.data;
        });
        loadCustomer();
        invoice_item_definition_1.itemdefinitions({ per_page: 20000 }).then(function (response) {
            data.itemdefinitions = response.data.data.data;
        });
    });
    var searchCategory = function (categoryName) {
        // console.log("categoryname", categoryName.invoice_number);
        if (categoryName != null && categoryName.length >= 2) {
            stale_check_1.regSearch({ regSearch: categoryName }).then(function (response) {
                data.itemsToFilter = response.data.data.data;
            });
        }
        else if (categoryName ? categoryName.length == 0 : "") {
            reloadData();
            data.search = "";
        }
        else {
            reloadData();
        }
    };
    var reanderSearched = function (categoryName) {
        console.log("categoryname", categoryName);
        if (categoryName != null) {
            stale_check_1.regSearch({ regSearch: categoryName.invoice_number }).then(function (response) {
                data.items = response.data.data.data;
            });
        }
    };
    var reloadData = function () {
        stale_check_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
        });
    };
    var loadCustomer = function () {
        customer_service_1.customers({ per_page: 20000, active: true }).then(function (response) {
            data.customers = response.data.data.data;
        });
    };
    var deleteInvoiceItemdefinition = function (deleteId) {
        data.deletemodal = !data.modal;
        data.itemTodelete = deleteId;
        data.paymentdetails = false;
    };
    var getInvoiceItemdefinition = function () {
        stale_check_1.get(data);
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
        data.paymentdetails = false;
    };
    var cancelInvoiceReceipt = function () {
        data.invoicereceipt = false;
        data.paymentdetails = true;
        data.invoicereceip.items = [];
    };
    var openInvoiceReceipt = function (paymentData) {
        data.paymentdetails = false;
        data.invoicereceipt = true;
        data.customer = [paymentData]; //mapping customer in autocomplete field
        data.invoicereceip.customer_id = paymentData; //mapping customer in autocomplete for two way binding
        data.invoicereceip.invoice_id = paymentData.id;
        data.invoicereceip.invoice_number = paymentData.invoice_number;
        if (data.paymentData.invoice_items) {
            data.paymentData.invoice_items.forEach(function (value) {
                var one_item = {
                    invoicedAmount: value.amount,
                    received: value.received_amount,
                    itemName: value.definition.name,
                    invoice_item_id: value.id,
                    amount: ""
                };
                data.invoicereceip.items.push(one_item);
            });
            bank_account_service_1.get({ per_page: 2000 }).then(function (response) {
                data.bankaccounts = response.data.data.data;
            });
        }
    };
    var bankName = composition_api_1.computed(function () {
        return data.bankaccounts.map(function (account) {
            account.fullName = "Account Number -" + account.number + "  " + account.bank + " - " + account.branch;
            return account;
        });
    });
    var newInvoiceItem = composition_api_1.computed(function () {
        return data && data.paymentData && data.paymentData
            ? data.paymentData.invoice_items.map(function (data, index) { return (__assign(__assign({}, data), { index: ++index })); })
            : "";
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
    var cancelConfirmDialog = function () {
        data.formData = {};
        data.deletemodal = false;
    };
    var remove = function () {
        stale_check_1.destroy(data.itemTodelete).then(function () {
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
        stale_check_1.update(data).then(function () {
            reloadData();
            cancelDialog();
        });
    };
    var createReceipt = function () {
        var invoiceItems = data.invoicereceip.items.filter(function (item) { return item.cleared !== true; });
        data.invoicereceip.items = invoiceItems;
        stale_check_1.receiptcreate(data.invoicereceip).then(function () {
            data.invoicereceipt = false;
            reloadData();
            data.invoicereceip = {
                invoice_id: "",
                date: "",
                description: "",
                customer_id: "",
                bank_account_id: "",
                bank_reference_number: "",
                invoice_number: "",
                items: []
            };
        });
    };
    var createInvoice = function (data) {
        stale_check_1.create(data).then(function () {
            reloadData();
            cancelDialog();
        });
    };
    var getData = function (params) {
        data.response = params;
        stale_check_1.get(params).then(function (response) {
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
    var checkDublicate = function (value, index) {
        var obj = data.invoice_items.filter(function (o) { return o.invoice_item_definition_id === value; });
        if (obj.length < 2) {
            // addRow();
        }
        else {
            data.invoice_items.splice(index, 10000);
        }
    };
    var removeRow = function (index) {
        data.invoice_items.splice(index, 1);
    };
    var previewPayment = function (paymentData) {
        data.paymentData = paymentData;
        data.paymentdetails = true;
    };
    var newInvoiceItems = composition_api_1.computed(function () {
        if (data.invoicereceip) {
            return data.invoicereceip.items.map(function (item) {
                item.cleared = item.invoicedAmount == item.received ? true : false;
                return item;
            });
        }
    });
    var searchCustomer = function (item) {
        if (item) {
            var regSearchTerm = item ? item : data.searchTerm;
            customer_service_1.regSearch({
                active: true,
                regSearch: regSearchTerm
            }).then(function (response) {
                data.customers = response.data.data.data;
            });
        }
        else {
            loadCustomer();
        }
    };
    var print = function (id) {
        stale_check_1.printInvoice(id);
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
        previewPayment: previewPayment,
        cancelInvoiceDialog: cancelInvoiceDialog,
        cancelInvoiceReceipt: cancelInvoiceReceipt,
        openInvoiceReceipt: openInvoiceReceipt,
        HEADERS: HEADERS,
        RECEIPTHEADERS: RECEIPTHEADERS,
        bankName: bankName,
        HEADERS_INVOICE_DETAILS: HEADERS_INVOICE_DETAILS,
        newInvoiceItems: newInvoiceItems,
        newInvoiceItem: newInvoiceItem,
        sumDebts: sumDebts,
        checkDublicate: checkDublicate,
        searchCustomer: searchCustomer,
        reanderSearched: reanderSearched,
        print: print
    };
};
