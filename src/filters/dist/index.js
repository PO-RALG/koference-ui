"use strict";
exports.__esModule = true;
var vue_1 = require("vue");
var DateFormatter_1 = require("./DateFormatter");
var CurrencyFormatter_1 = require("./CurrencyFormatter");
var CapitalizeFirstLatter_1 = require("./CapitalizeFirstLatter");
exports["default"] = {
    install: function () {
        vue_1["default"].filter("format", DateFormatter_1["default"]);
        vue_1["default"].filter("toCurrency", CurrencyFormatter_1["default"]);
        vue_1["default"].filter("capitalizeFirstLatter", CapitalizeFirstLatter_1["default"]);
    }
};
