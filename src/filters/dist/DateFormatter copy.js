"use strict";
exports.__esModule = true;
var toCurrency = function (value) {
    var val = value.toString();
    return val.charAt(0).toUpperCase() + value.slice(1);
};
exports["default"] = toCurrency;
