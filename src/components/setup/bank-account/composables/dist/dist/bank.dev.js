"use strict";

exports.__esModule = true;
exports.useBank = void 0;

var composition_api_1 = require("@vue/composition-api");

var bank_account_service_1 = require("../services/bank-account.service");

var bank_account_types_service_1 = require("@/components/setup/bank-account-type/services/bank-account-types.service");

exports.useBank = function () {
  var dataItems = [];
  var documentCategoryData;
  var data = composition_api_1.reactive({
    title: "Manage Bank Accounts",
    modalTitle: "",
    headers: [{
      text: "GL Account",
      align: "start",
      sortable: false,
      value: "gl_account",
      width: 600
    }, {
      text: "Bank",
      align: "start",
      sortable: false,
      value: "bank"
    }, {
      text: "branch",
      align: "start",
      sortable: false,
      value: "branch"
    }, {
      text: "Name",
      align: "start",
      sortable: false,
      value: "name"
    }, {
      text: "Number",
      align: "start",
      sortable: false,
      value: "number"
    }, {
      text: "Gfs Code",
      align: "start",
      sortable: false,
      value: "gfs_code.name"
    }, {
      text: "Actions",
      value: "actions",
      sortable: false
    }],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: documentCategoryData,
    params: {
      total: 10,
      size: 10
    },
    itemtodelete: "",
    accounttypes: [],
    filterdialog: false,
    selectedSbc: [],
    subbudgetclasses: []
  });
  composition_api_1.onMounted(function () {
    initialize();
  });

  var initialize = function initialize() {
    // make api call
    var params = {
      total: 10,
      size: 10
    };
    bank_account_service_1.get(params).then(function (response) {
      console.log("data to filter", response.data.data.data);
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
    bank_account_types_service_1.bankaccounttypes().then(function (response) {
      // console.log("bank account", response.data.data.data);
      data.accounttypes = response.data.data.data;
    });
  };

  var bankName = composition_api_1.computed(function () {
    return data.itemsToFilter.map(function (account) {
      account.fullName = "Account Number -" + account.number + "  " + account.bank + " - " + account.branch;
      return account;
    });
  });

  var searchCategory = function searchCategory(categoryName) {
    // console.log("argument", categoryName);
    if (categoryName != null) {
      bank_account_service_1.search({
        name: categoryName.name
      }).then(function (response) {
        // //// data", response);
        data.items = response.data.data.data;
      });
    } else {
      reloadData();
    }
  };

  var reloadData = function reloadData() {
    var params = {
      total: 10,
      size: 10
    };
    bank_account_service_1.get(params).then(function (response) {
      // console.log("data", response.data.data);
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
  };

  var deleteSubBudgetClass = function deleteSubBudgetClass(deleteId) {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId; // console.log("delete year", data);
  };

  var getSubBudgetClass = function getSubBudgetClass() {
    bank_account_service_1.get(data).then(function (response) {// console.log("data", response.data);
    });
  };

  var cancelDialog = function cancelDialog() {
    data.formData = {};
    data.modal = !data.modal;
  };

  var cancelConfirmDialog = function cancelConfirmDialog() {
    data.formData = {};
    data.deletemodal = false;
    reloadData();
  };

  var cancelFilterDialog = function cancelFilterDialog() {
    data.filterdialog = false;
    reloadData();
  };

  var remove = function remove() {
    // console.log("delete data with id", data.itemtodelete);
    bank_account_service_1.destroy(data.itemtodelete).then(function () {
      reloadData();
      data.deletemodal = false;
    });
  };

  var save = function save() {
    console.log("Form Data", data.formData);

    if (data.formData.id) {
      updateFinancialYear(data.formData);
    } else {
      createUser(data.formData);
    }
  };

  var openDialog = function openDialog(formData) {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {};
      data.modalTitle = "Create";
    }

    data.modal = !data.modal;
  };

  var updateFinancialYear = function updateFinancialYear(data) {
    bank_account_service_1.update(data).then(function (response) {
      // console.log("Updated data", response.data);
      reloadData();
      cancelDialog();
    });
  };

  var createUser = function createUser(data) {
    bank_account_service_1.create(data).then(function (response) {
      // console.log("Created data", response.data);
      reloadData();
      cancelDialog();
    });
  };

  var openFilterDialog = function openFilterDialog() {
    data.filterdialog = true;
    data.modal = false;
  };

  var resumeDialog = function resumeDialog() {
    data.modal = true;
    data.filterdialog = false;
  };

  var filterSbc = function filterSbc(term) {
    var result = data.subbudgetclasses.filter(function (item) {
      return item.code.toLowerCase().includes(term.toLowerCase());
    });
    data.subbudgetclasses = result;
    return data.subbudgetclasses;
  };

  return {
    filterSbc: filterSbc,
    data: data,
    openDialog: openDialog,
    cancelDialog: cancelDialog,
    deleteSubBudgetClass: deleteSubBudgetClass,
    getSubBudgetClass: getSubBudgetClass,
    updateFinancialYear: updateFinancialYear,
    save: save,
    reloadData: reloadData,
    remove: remove,
    cancelConfirmDialog: cancelConfirmDialog,
    searchCategory: searchCategory,
    openFilterDialog: openFilterDialog,
    cancelFilterDialog: cancelFilterDialog,
    resumeDialog: resumeDialog,
    bankName: bankName
  };
};