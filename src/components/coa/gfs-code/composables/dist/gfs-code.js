"use strict";
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
exports.useGfsCode = void 0;
var composition_api_1 = require("@vue/composition-api");
var gfs_service_1 = require("../service/gfs.service");
var gfs_categories_service_1 = require("../../gfs-category/service/gfs-categories.service");
exports.useGfsCode = function () {
    var dataItems = [];
    var gfsCategoryData;
    var fileToupload = composition_api_1.ref("");
    var imageUrl = composition_api_1.ref("");
    var data = composition_api_1.reactive({
        title: "Manage Gfs Codes",
        modalTitle: "",
        headers: [
            { text: "Name", align: "start", sortable: false, value: "name" },
            { text: "Code", align: "start", sortable: false, value: "code" },
            {
                text: "Category code",
                align: "start",
                sortable: false,
                value: "category.description"
            },
            { text: "Actions", value: "actions", sortable: false },
        ],
        modal: false,
        deletemodal: false,
        items: dataItems,
        itemsToFilter: [],
        formData: gfsCategoryData,
        documentcategories: [],
        gfscategories: [],
        rows: ["10", "20", "50", "100"],
        itemtodelete: "",
        response: {}
    });
    composition_api_1.onMounted(function () {
        gfs_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
            data.itemsToFilter = response.data.data.data;
        });
        gfs_categories_service_1.gfscategories({ per_page: 2000 }).then(function (response) {
            data.gfscategories = response.data.data.data;
        });
    });
    var searchCategory = function (categoryName) {
        if (categoryName != null) {
            gfs_service_1.search({ name: categoryName.name }).then(function (response) {
                data.items = response.data.data.data;
            });
        }
        else {
            reloadData();
        }
    };
    var reloadData = function () {
        gfs_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
        });
    };
    var deleteGfsCode = function (deleteId) {
        data.deletemodal = !data.modal;
        data.itemtodelete = deleteId;
        // console.log("delete year", data);
    };
    var getGfsCode = function () {
        gfs_service_1.get(data).then(function (response) {
            // console.log("data", response.data);
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
        gfs_service_1.destroy(data.itemtodelete).then(function () {
            reloadData();
            data.deletemodal = false;
        });
    };
    var save = function () {
        if (data.formData.id) {
            updateGfsCodes(data.formData);
        }
        else {
            createGfsCode(data.formData);
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
    var updateGfsCodes = function (data) {
        gfs_service_1.update(data).then(function (response) {
            reloadData();
            cancelDialog();
        });
    };
    var createGfsCode = function (data) {
        gfs_service_1.create(data).then(function (response) {
            reloadData();
            cancelDialog();
        });
    };
    // watching a getter
    composition_api_1.watch(fileToupload, function (fileToupload) {
        if (!(fileToupload instanceof File)) {
            return;
        }
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileToupload);
        fileReader.addEventListener("load", function () {
            imageUrl.value = fileReader.result;
        });
    });
    var getData = function (params) {
        data.response = params;
        gfs_service_1.get(params).then(function (response) {
            data.response = response.data.data;
            data.items = response.data.data.data;
        });
    };
    var fetch = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, gfs_service_1.get({ per_page: 1000 })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        data: data,
        openDialog: openDialog,
        cancelDialog: cancelDialog,
        deleteGfsCode: deleteGfsCode,
        getGfsCode: getGfsCode,
        updateGfsCodes: updateGfsCodes,
        save: save,
        reloadData: reloadData,
        remove: remove,
        cancelConfirmDialog: cancelConfirmDialog,
        searchCategory: searchCategory,
        imageUrl: imageUrl,
        getData: getData,
        getGfsCodes: gfs_service_1.get,
        fetch: fetch
    };
};
