"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAcademicYears = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var API = "api/v1/financial-years";

var getAcademicYears = function getAcademicYears(payload) {
  return regeneratorRuntime.async(function getAcademicYears$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", _axios["default"].get(API, {
            params: payload
          }));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.getAcademicYears = getAcademicYears;