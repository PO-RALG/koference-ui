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
exports.useUser = void 0;
var composition_api_1 = require("@vue/composition-api");
var user_service_1 = require("../services/user.service");
var admin_area_services_1 = require("@/components/admin-area/admin-area/services/admin-area-services");
var role_services_1 = require("@/components/role/services/role-services");
var level_services_1 = require("@/components/admin-area/level/services/level-services");
var facility_service_1 = require("@/components/facility/facility/services/facility.service");
exports.useUser = function () {
    var dataItems = [];
    var userData = {};
    var data = composition_api_1.reactive({
        title: "Manage Users",
        valid: true,
        isOpen: false,
        selectedRoles: [],
        levels: [],
        facilities: [],
        showFacility: false,
        isFacilityUser: false,
        node: null,
        item: userData,
        itemName: "name",
        location: {},
        response: {},
        roles: [],
        modalTitle: "",
        headers: [
            { text: "Check Number", value: "check_number" },
            { text: "Phone Number", value: "phone_number" },
            { text: "Name", align: "start", sortable: false, value: "fullName" },
            { text: "Email", value: "email" },
            { text: "Actions", value: "actions", sortable: false },
        ],
        modal: false,
        items: dataItems,
        formData: userData,
        rows: ["10", "20", "100"],
        params: {
            total: 100,
            size: 10
        },
        nameRules: [
            function (v) { return !!v || "Name is required"; },
            function (v) {
                return (v && v.length <= 10) || "Name must be less than 10 characters";
            },
        ],
        email: "",
        emailRules: [
            function (v) { return !!v || "E-mail is required"; },
            function (v) { return /.+@.+\..+/.test(v) || "E-mail must be valid"; },
        ]
    });
    composition_api_1.onMounted(function () {
        initialize();
    });
    var initialize = function () {
        user_service_1.get({ per_page: 10 }).then(function (response) {
            var _a = response.data.data, from = _a.from, to = _a.to, total = _a.total, current_page = _a.current_page, per_page = _a.per_page, last_page = _a.last_page;
            data.response = { from: from, to: to, total: total, current_page: current_page, per_page: per_page, last_page: last_page };
            data.items = response.data.data.data;
        });
        loadLevels();
        getNodes();
        loadRoles();
    };
    var cancelDialog = function () {
        data.formData = {};
        data.isFacilityUser = false;
        data.modal = !data.modal;
    };
    var save = function () {
        var roles = data.formData.roles
            ? data.formData.roles.map(function (role) { return role.id; })
            : [];
        composition_api_1.set(data.formData, "roles", roles);
        if (data.formData.id) {
            updateUser(data.formData);
        }
        else {
            createUser(data.formData);
        }
    };
    var users = composition_api_1.computed(function () {
        return data.items.map(function (user) { return (__assign(__assign({}, user), { fullName: user.first_name + " " + user.middle_name + "  " + user.last_name })); });
    });
    var selectedRoles = composition_api_1.computed(function () {
        return data.selectedRoles;
    });
    var facilities = composition_api_1.computed(function () {
        return data.facilities.map(function (facility) { return (__assign(__assign({}, facility), { label: facility.name + " - (" + facility.facility_type.name + ")" })); });
    });
    var getData = function (params) {
        data.response = params;
        user_service_1.get(params).then(function (response) {
            data.response = response.data.data;
            data.items = response.data.data.data;
        });
    };
    var openDialog = function (formData) {
        if (formData && formData.id) {
            data.selectedRoles = formData.roles;
            data.formData = formData;
            if (formData.facility_id) {
                data.isFacilityUser = true;
                loadFacilities();
            }
            data.modalTitle = "Update";
        }
        else {
            data.selectedRoles = [];
            data.modalTitle = "Create";
        }
        data.modal = !data.modal;
    };
    var updateUser = function (data) {
        user_service_1.update(data).then(function (response) {
            console.log(response.status);
            if (response.status === 200) {
                cancelDialog();
                initialize();
            }
        });
    };
    var createUser = function (data) {
        user_service_1.create(data).then(function (response) {
            if (response.status === 200) {
                cancelDialog();
                initialize();
            }
        });
    };
    var openConfirmDialog = function (item) {
        data.item = item;
        data.isOpen = true;
    };
    var closeConfirmDialog = function () {
        data.item = {};
        data.isOpen = false;
    };
    var deleteItem = function (item) {
        var payload = item;
        user_service_1.deleteUser(payload).then(function (response) {
            console.log(response);
            initialize();
        });
        data.item = {};
        data.isOpen = false;
    };
    var loadLocationChildren = function (location) {
        data.location = location;
        toggleFacilitylOption(location);
        data.formData.location_id = location.id;
        if (!location.children) {
            if (location.id !== data.node.id) {
                admin_area_services_1.getChildren(location.id).then(function (response) {
                    if (response.data.data.children.length) {
                        composition_api_1.set(location, "children", response.data.data.children);
                    }
                });
            }
        }
    };
    var getNodes = function (id) {
        admin_area_services_1.getChildren(id).then(function (response) {
            data.node = response.data.data;
        });
    };
    var loadRoles = function () {
        role_services_1.get({}).then(function (response) {
            data.roles = response.data.data.data;
        });
    };
    var loadLevels = function () {
        level_services_1.get({}).then(function (response) {
            data.levels = response.data.data.data;
        });
    };
    var toggleFacilitylOption = function (location) {
        var level = data.levels.find(function (level) { return level.id === location.level_id; });
        if (level.code === "WARD" || level.code === "VILLAGE_MTAA") {
            data.showFacility = true;
        }
        else {
            data.showFacility = false;
        }
    };
    var loadFacilities = function () {
        var isFacilityUser = !!data.isFacilityUser;
        data.isFacilityUser = isFacilityUser;
        facility_service_1.get({ search: { location_id: data.location["id"] } }).then(function (response) {
            data.facilities = response.data.data.data;
        });
    };
    var filterRoles = function (term) {
        var result = data.roles.filter(function (item) {
            return item.name.toLowerCase().includes(term.toLowerCase());
        });
        data.roles = result;
        return data.roles;
    };
    return {
        data: data,
        openDialog: openDialog,
        cancelDialog: cancelDialog,
        closeConfirmDialog: closeConfirmDialog,
        openConfirmDialog: openConfirmDialog,
        filterRoles: filterRoles,
        selectedRoles: selectedRoles,
        loadLocationChildren: loadLocationChildren,
        loadFacilities: loadFacilities,
        getNodes: getNodes,
        getData: getData,
        users: users,
        facilities: facilities,
        updateUser: updateUser,
        save: save,
        deleteItem: deleteItem
    };
};
