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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.useReceipt = void 0;
var composition_api_1 = require("@vue/composition-api");
var receipt_service_1 = require("../services/receipt-service");
var customer_service_1 = require("@/components/receivables/customer/services/customer.service");
var bank_account_service_1 = require("@/components/setup/bank-account/services/bank-account.service");
var invoice_item_definition_1 = require("@/components/receivables/invoice-item-definition/services/invoice-item-definition");
var moment_1 = require("moment");
exports.useReceipt = function () {
    var INVOICE_ITEM_HEADERS = [
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
            width: "20%"
        },
        {
            text: "Amount Received",
            align: "start",
            sortable: false,
            value: "amount",
            width: "20%"
        },
        {
            text: "Add Amount",
            align: "start",
            sortable: false,
            value: "amount",
            width: "20%"
        },
    ];
    var receipt = composition_api_1.reactive({
        id: null,
        customer_id: null,
        invoice_id: null,
        date: null,
        bank_reference_number: null,
        description: null,
        bank_account_id: null,
        items: [
            {
                funding_source_code: null,
                gl_account_id: null,
                amount: null
            },
        ]
    });
    var dataItems = [];
    var receiptData;
    var HEADERS = [
        {
            text: "Fund Source",
            align: "start",
            sortable: false,
            value: "invoice_number",
            width: "80%"
        },
        {
            text: "GL Account",
            align: "start",
            sortable: false,
            width: "20%"
        },
        {
            text: "Amount",
            align: "start",
            sortable: false,
            value: "amount",
            width: "20%"
        },
    ];
    var data = composition_api_1.reactive({
        title: "Manage Receipts",
        isInvoice: "NO",
        selectedUser: null,
        selectedInvoice: null,
        modalTitle: "",
        maxDate: moment_1["default"](new Date()).format("YYYY-MM-DD"),
        minDate: null,
        headers: [
            {
                text: "Receipt Number",
                align: "start",
                sortable: false,
                value: "receipt_number"
            },
            { text: "Date", value: "date", sortable: true },
            {
                text: "Amount",
                align: "start",
                sortable: false,
                value: "totalAmt"
            },
            {
                text: "From",
                align: "start",
                sortable: false,
                value: "customer.name"
            },
            {
                text: "Description",
                align: "start",
                sortable: false,
                value: "description"
            },
            {
                text: "Bank Account",
                align: "start",
                sortable: false,
                value: "bank_account"
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
        gl_accounts: [],
        receipt: {
            id: null,
            customer_id: null,
            invoice_id: null,
            date: null,
            bank_reference_number: null,
            description: null,
            bank_account_id: null,
            items: [
                {
                    funding_source_code: null,
                    gl_account_id: null,
                    amount: null
                },
            ]
        },
        rows: ["10", "20", "50", "100"],
        itemTodelete: "",
        response: {},
        accounts: [],
        customers: [],
        fundingSources: [],
        glAccounts: [],
        receiptdata: receiptData,
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
        init();
    });
    var init = function () {
        data.receipt = {
            id: null,
            customer_id: null,
            invoice_id: null,
            date: null,
            bank_reference_number: null,
            description: null,
            bank_account_id: null,
            items: [
                {
                    funding_source_code: null,
                    gl_account_id: null,
                    amount: null
                },
            ]
        };
        data.loading = true;
        receipt_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
            data.itemsToFilter = response.data.data.data;
            data.loading = false;
        });
        customer_service_1.get({ per_page: 2000, active: true }).then(function (response) {
            data.customers = response.data.data.data;
        });
    };
    var searchCategory = function (categoryName) {
        if (categoryName != null) {
            receipt_service_1.search({ receipt_number: categoryName.receipt_number }).then(function (response) {
                data.items = response.data.data.data;
            });
        }
        else {
            reloadData();
        }
    };
    var reloadData = function () {
        receipt_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
        });
    };
    var cancelDialog = function () {
        data.receipt = receipt;
        (data.receipt_items = [
            {
                gl_account_id: "",
                amount: ""
            },
        ]),
            (data.modal = !data.modal);
    };
    var accounts = composition_api_1.computed(function () {
        return data.bankaccounts.map(function (account) {
            account.fullName = "Account Number -" + account.number + "  " + account.bank + " - " + account.branch;
            return account;
        });
    });
    var cancelConfirmDialog = function () {
        data.receipt = receipt;
        data.deletemodal = false;
    };
    var remove = function () {
        receipt_service_1.destroy(data.itemTodelete).then(function () {
            reloadData();
            data.deletemodal = false;
        });
    };
    var geGlAccountId = function (account) {
        var ac = data.glAccounts.find(function (glAccount) { return glAccount.code === account; });
        return ac.id;
    };
    var getFundingSource = function (id) {
        var fs = data.fundingSources.find(function (fs) { return fs.id === id; });
        return fs.code;
    };
    var save = function () {
        var payload = {};
        if (isInvoice && data.selectedInvoice) {
            payload = {
                customer_id: data.receipt.customer_id,
                invoice_id: data.selectedInvoice.id,
                date: data.receipt.date,
                bank_account_id: data.receipt.bank_account_id,
                bank_reference_number: data.receipt.bank_reference_number,
                description: data.receipt.description,
                items: data.selectedInvoice.invoice_items.map(function (item) {
                    return {
                        invoice_item_id: item.id,
                        amount: item.pay_amount,
                        gl_account_id: geGlAccountId(item.gl_account),
                        funding_source_code: getFundingSource(item.definition.funding_source_id)
                    };
                })
            };
        }
        else {
            if (data.receipt.invoice_id) {
                delete data.receipt.invoice_id;
            }
            payload = data.receipt;
        }
        receipt_service_1.create(payload).then(function (response) {
            if (response.status === 200) {
                init();
                data.modal = false;
            }
        });
    };
    var openDialog = function (formData) {
        data.modalTitle = "Create";
        data.modal = !data.modal;
        bank_account_service_1.get({ per_page: 2000 }).then(function (response) {
            data.bankaccounts = response.data.data.data;
        });
        invoice_item_definition_1.fundingSource({ per_page: 2000 }).then(function (response) {
            data.fundingSources = response.data.data.data;
        });
        invoice_item_definition_1.glAccount({ per_page: 2000, gl_account_type: "REVENUE" }).then(function (response) {
            data.glAccounts = response.data.data.data;
        });
    };
    var loadGLAccounts = function (fundSourceCode, index) { return __awaiter(void 0, void 0, void 0, function () {
        var params;
        return __generator(this, function (_a) {
            params = {
                per_page: 10,
                gl_account_type: "REVENUE",
                fund_code: fundSourceCode
            };
            invoice_item_definition_1.glAccount(params).then(function (response) {
                if (response.data.data.data.length > 0) {
                    data.gl_accounts.push(response.data.data.data);
                }
            });
            return [2 /*return*/];
        });
    }); };
    var newreceiptItem = composition_api_1.computed(function () {
        return data.items
            ? data.items.map(function (data, index) { return (__assign(__assign({}, data), { index: ++index, newData: data, bankAccount: data.bank_account.bank +
                    data.bank_account.name +
                    " (" +
                    data.bank_account.number +
                    ")" })); })
            : [];
    });
    var updateReceipt = function (data) {
        receipt_service_1.update(data).then(function () {
            reloadData();
            cancelDialog();
        });
    };
    var createReceipt = function (data) {
        receipt_service_1.create(data).then(function () {
            reloadData();
            cancelDialog();
        });
    };
    var getData = function (params) {
        data.response = params;
        receipt_service_1.get(params).then(function (response) {
            data.response = response.data.data;
            data.items = response.data.data.data;
        });
    };
    var addRow = function () {
        data.receipt.items.push({
            funding_source_code: null,
            gl_account_id: null,
            amount: null
        });
    };
    var removeRow = function (index) {
        data.receipt.items.splice(index, 1);
    };
    var print = function (id) {
        receipt_service_1.printReceipt(id);
    };
    var isInvoice = composition_api_1.computed(function () {
        return data.isInvoice === "YES" ? true : false;
    });
    var setCustomer = function (invoice) {
        data.selectedUser = invoice.customer;
        data.selectedInvoice = invoice;
        data.receipt.customer_id = invoice.customer_id;
        data.receipt.invoice_id = invoice.id;
        data.minDate = moment_1["default"](invoice.date).format("YYYY-MM-DD");
    };
    var resetDate = function () {
        if (data.isInvoice === "NO") {
            data.selectedInvoice = null;
            data.minDate = null;
            data.maxDate = moment_1["default"](new Date()).format("YYYY-MM-DD");
        }
        else {
            data.minDate = data.selectedInvoice
                ? moment_1["default"](data.selectedInvoice.date).format("YYYY-MM-DD")
                : moment_1["default"](new Date()).format("YYYY-MM-DD");
        }
    };
    return {
        data: data,
        getData: getData,
        addRow: addRow,
        removeRow: removeRow,
        openDialog: openDialog,
        cancelDialog: cancelDialog,
        save: save,
        reloadData: reloadData,
        remove: remove,
        cancelConfirmDialog: cancelConfirmDialog,
        searchCategory: searchCategory,
        accounts: accounts,
        newreceiptItem: newreceiptItem,
        print: print,
        HEADERS: HEADERS,
        INVOICE_ITEM_HEADERS: INVOICE_ITEM_HEADERS,
        loadGLAccounts: loadGLAccounts,
        isInvoice: isInvoice,
        setCustomer: setCustomer,
        resetDate: resetDate
    };
};
