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
exports.useBankReconciliation = void 0;
var composition_api_1 = require("@vue/composition-api");
var bank_reconciliation_service_1 = require("../services/bank-reconciliation-service");
var moment_1 = require("moment");
var sortBy_1 = require("lodash/sortBy");
exports.useBankReconciliation = function (_a) {
    var root = _a.root;
    var data = composition_api_1.reactive({
        entries: [],
        selectedEntries: [],
        valid: true,
        isOpen: false,
        isUnlockOpen: false,
        showSelect: true,
        singleSelect: true,
        report: null,
        selectedDate: null,
        selectedBankAcc: null,
        response: {},
        formData: {
            date: null,
            balance: null,
            bank_account_id: null
        },
        showReconciliationOptions: false,
        valueWhenEmpty: "",
        clearable: true,
        title: "Bank Reconciliation",
        dialogTitle: "",
        buttonTitle: "",
        dialog: false,
        showEdit: false,
        showBalance: true,
        rows: ["10", "20", "50", "60", "100"],
        headers: [
            { text: "Ref Number", value: "reference_no" },
            { text: "Reconciled?", value: "status", sortable: false },
            { text: "Date", value: "date" },
            { text: "Acc", value: "account", sortable: false },
            { text: "Type", value: "type", sortable: false },
            { text: "Amount", align: "start", sortable: true, value: "amount" },
        ],
        statuses: ["RECONCILE"],
        balanceRules: [function (v) { return !!v || "Bank Balance is Required"; }],
        accountRules: [function (v) { return !!v || "You must selecte a bank account"; }],
        dateRules: [function (v) { return !!v || "You must selected a date"; }],
        options: {
            precision: 2
        },
        date: new Date().toISOString().substr(0, 7),
        modal: false
    });
    composition_api_1.onMounted(function () {
        loadComponent();
    });
    var loadComponent = function () { return __awaiter(void 0, void 0, void 0, function () {
        var date, bankAccountId, params, query;
        return __generator(this, function (_a) {
            date = root.$route.query.date ? root.$route.query.date : null;
            bankAccountId = root.$route.query.bank_account_id
                ? root.$route.query.bank_account_id
                : null;
            params = { date: date, bank_account_id: bankAccountId };
            query = __assign({}, params);
            data.selectedEntries = [];
            if (date && bankAccountId) {
                data.formData.bank_account_id = parseInt(bankAccountId);
                data.formData.date = date;
                init(query);
            }
            return [2 /*return*/];
        });
    }); };
    composition_api_1.watch(function () { return root.$route.query; }, function (newQuery) { return __awaiter(void 0, void 0, void 0, function () {
        var bank_account_id, date, params;
        return __generator(this, function (_a) {
            bank_account_id = newQuery.bank_account_id, date = newQuery.date;
            params = { date: date, bank_account_id: bank_account_id };
            if (!date && !bank_account_id) {
                init(params);
            }
            return [2 /*return*/];
        });
    }); });
    var init = function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            if (params.bank_account_id && params.date) {
                query = __assign(__assign({}, params), { per_page: 10 });
                bank_reconciliation_service_1.getEntries(query)
                    .then(function (response) {
                    ////: ", response);
                    var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
                    data.response = {
                        from: from,
                        to: to,
                        total: total,
                        current_page: current_page,
                        per_page: per_page,
                        last_page: last_page
                    };
                    data.entries = response.data.data.data;
                })
                    .then(function () {
                    bank_reconciliation_service_1.getReport(params.bank_account_id, { date: params.date }).then(function (response) {
                        if (response.data.data.balance_required) {
                            openDialog("BALANCE");
                        }
                        else {
                            if (response.data.data.diff === 0) {
                                showConfirmDialog();
                            }
                            data.report = response.data.data;
                        }
                    });
                });
            }
            else {
                data.entries = [];
                data.report = null;
            }
            return [2 /*return*/];
        });
    }); };
    var showConfirmDialog = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            data.isOpen = true;
            return [2 /*return*/];
        });
    }); };
    var closeConfirmDialog = function () {
        data.isOpen = false;
    };
    var closeUnlockDialog = function () {
        data.isUnlockOpen = false;
    };
    var openUnlockDialog = function () {
        data.isUnlockOpen = true;
    };
    var fetchData = function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = __assign(__assign({}, params), { date: root.$root.$route.query.date, bank_account_id: root.$root.$route.query.bank_account_id });
            data.response = query;
            bank_reconciliation_service_1.getEntries(query).then(function (response) {
                data.response = response.data.data;
                data.entries = response.data.data.data;
            });
            return [2 /*return*/];
        });
    }); };
    var openDialog = function (type) { return __awaiter(void 0, void 0, void 0, function () {
        var date, bankAccountId;
        return __generator(this, function (_a) {
            date = root.$route.query.date ? root.$route.query.date : null;
            bankAccountId = root.$route.query.bank_account_id
                ? root.$route.query.bank_account_id
                : null;
            data.formData.bank_account_id = parseInt(bankAccountId);
            data.formData.date = date;
            data.formData.balance = null;
            if (type === "LOAD") {
                data.dialogTitle = "Select Entries Account & Date";
                data.showBalance = false;
                data.buttonTitle = "Load Entries";
            }
            else {
                data.dialogTitle = "Add Bank Balance";
                data.buttonTitle = "Save";
                data.showBalance = true;
            }
            data.dialog = true;
            return [2 /*return*/];
        });
    }); };
    var cancelDialog = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            data.formData = { date: null, balance: null, bank_account_id: null };
            data.dialog = !data.dialog;
            return [2 /*return*/];
        });
    }); };
    var save = function () { return __awaiter(void 0, void 0, void 0, function () {
        var dateInst, date, date_1, bankAccountId_1, query;
        return __generator(this, function (_a) {
            dateInst = moment_1["default"](data.formData.date);
            /**
             * adding 1 month from the present month and then subtracting 1 day,
             * So you would get the last day of this month
             */
            dateInst.add(1, "months").date(1).subtract(1, "days");
            date = dateInst.format("YYYY-MM-DD");
            data.formData.date = date;
            data.selectedDate = data.formData.date;
            data.selectedBankAcc = data.formData.bank_account_id;
            if (data.showBalance) {
                bank_reconciliation_service_1.addBalance(data.formData).then(function (response) {
                    if (response.status === 200) {
                        data.showEdit = false;
                        data.formData = { date: null, balance: null, bank_account_id: null };
                        cancelDialog();
                        loadComponent();
                    }
                });
            }
            else {
                delete data.formData.balance;
                date_1 = root.$route.query.date ? root.$route.query.date : null;
                bankAccountId_1 = root.$route.query.bank_account_id
                    ? root.$route.query.bank_account_id
                    : null;
                query = __assign({}, data.formData);
                bank_reconciliation_service_1.getEntries(query)
                    .then(function (response) {
                    if (response.status === 200) {
                        if (data.formData.bank_account_id !== bankAccountId_1 ||
                            data.formData.date !== date_1) {
                            root.$router.replace({
                                query: {
                                    date: data.formData.date,
                                    bank_account_id: data.formData.bank_account_id
                                }
                            });
                        }
                        else {
                            return null;
                        }
                        var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
                        data.response = {
                            from: from,
                            to: to,
                            total: total,
                            current_page: current_page,
                            per_page: per_page,
                            last_page: last_page
                        };
                        data.entries = response.data.data.data;
                    }
                })
                    .then(function () {
                    bank_reconciliation_service_1.getReport(data.formData.bank_account_id, {
                        date: data.formData.date
                    }).then(function (response) {
                        if (response.data.data.balance_required) {
                            console.log("report", response.data.data);
                            data.dialog = !data.dialog;
                            openDialog("BALANCE");
                        }
                        else {
                            if (response.data.data.diff === 0) {
                                showConfirmDialog();
                            }
                            data.report = response.data.data;
                        }
                    });
                });
                data.dialog = !data.dialog;
            }
            return [2 /*return*/];
        });
    }); };
    var updateBalance = function () {
        var payload = {
            balance: data.report.bank_balance,
            date: root.$route.query.date,
            bank_account_id: root.$route.query.bank_account_id
        };
        bank_reconciliation_service_1.addBalance(payload).then(function (response) {
            if (response.status === 200) {
                data.showEdit = false;
                data.formData = { date: null, balance: null, bank_account_id: null };
                loadComponent();
            }
        });
    };
    var outstandingDeposits = composition_api_1.computed(function () {
        var sum = data.entries.reduce(function (acc, entry) {
            return acc + parseInt(entry.dr_amount);
        }, 0);
        return sum;
    });
    var outstandingPayments = composition_api_1.computed(function () {
        var sum = data.entries.reduce(function (acc, entry) {
            return acc + parseInt(entry.cr_amount);
        }, 0);
        return sum;
    });
    var diff = composition_api_1.computed(function () {
        if (data.report) {
            return data.report.adjusted_balance - data.report.cash_balance;
        }
    });
    var confirmReconciliation = function (item) { return __awaiter(void 0, void 0, void 0, function () {
        var payload;
        return __generator(this, function (_a) {
            payload = __assign(__assign({}, data.report), { bank_account_id: root.$root.$route.query.bank_account_id, date: root.$root.$route.query.date });
            bank_reconciliation_service_1.confirmReport(payload).then(function (response) {
                if (response.status === 200) {
                    data.isOpen = false;
                    loadComponent();
                }
            });
            return [2 /*return*/];
        });
    }); };
    var unlock = function () { return __awaiter(void 0, void 0, void 0, function () {
        var payload;
        return __generator(this, function (_a) {
            payload = {
                bank_account_id: root.$route.query.bank_account_id,
                start_date: root.$route.query.date
            };
            bank_reconciliation_service_1.unlock(payload).then(function (response) {
                if (response.status === 200) {
                    data.isUnlockOpen = false;
                    loadComponent();
                }
            });
            return [2 /*return*/];
        });
    }); };
    var rowClicked = function (item) {
        data.formData.balance = data.report.bank_balance;
        if (item.confirmed) {
            data.showEdit = false;
        }
        else {
            data.showEdit = true;
        }
    };
    var currentDate = composition_api_1.computed(function () {
        var date = new Date();
        return moment_1["default"](date).format("YYYY-MM");
    });
    var getType = function (transaction_type) {
        var type = transaction_type.split("\\")[2];
        switch (type) {
            case "Payment":
                return "OUTSTANDING PAYMENTS";
            case "Receipt":
                return "OUTSTANDING DEPOSITS";
            default:
                return "NO TYPE";
        }
    };
    var getAccount = function (transaction_type) {
        var type = transaction_type.split("\\")[2];
        switch (type) {
            case "Payment":
                return "AP";
            case "Receipt":
                return "AR";
            default:
                return "NO ACC";
        }
    };
    var title = composition_api_1.computed(function () {
        var reportUnlocked = data.report ? data.report.confirmed : false;
        var title = reportUnlocked
            ? "Bank Reconciliation locked as of " + moment_1["default"](data.report.month).format("YYYY-MM-DD")
            : data.title;
        return title;
    });
    var getAmount = function (entry) {
        var dr = parseInt(entry.dr_amount);
        var cr = parseInt(entry.cr_amount);
        if (cr > dr) {
            return cr;
        }
        else {
            return dr;
        }
    };
    var entries = composition_api_1.computed(function () {
        return sortBy_1["default"](data.entries.map(function (entry) {
            return __assign(__assign({}, entry), { type: getType(entry.transaction_type), account: getAccount(entry.transaction_type), amount: getAmount(entry) });
        }), "date").reverse();
    });
    var reconcileEntry = function (entry) {
        var status = entry.item.is_reconciled ? false : true;
        var item = [{ id: entry.item.id, status: status }];
        var payload = {
            date: root.$root.$route.query.date,
            bank_account_id: root.$root.$route.query.bank_account_id,
            entries: item
        };
        bank_reconciliation_service_1.reconcileEntries(payload).then(function (response) {
            console.log("payload", payload);
            if (response.status === 200) {
                loadComponent();
            }
        });
    };
    var selected = composition_api_1.computed(function () {
        return data.entries.filter(function (entry) {
            return entry.status === true;
        });
    });
    return {
        data: data,
        fetchData: fetchData,
        openDialog: openDialog,
        cancelDialog: cancelDialog,
        currentDate: currentDate,
        save: save,
        outstandingDeposits: outstandingDeposits,
        outstandingPayments: outstandingPayments,
        diff: diff,
        showConfirmDialog: showConfirmDialog,
        closeConfirmDialog: closeConfirmDialog,
        confirmReconciliation: confirmReconciliation,
        closeUnlockDialog: closeUnlockDialog,
        openUnlockDialog: openUnlockDialog,
        rowClicked: rowClicked,
        entries: entries,
        unlock: unlock,
        updateBalance: updateBalance,
        title: title,
        reconcileEntry: reconcileEntry,
        selected: selected
    };
};
