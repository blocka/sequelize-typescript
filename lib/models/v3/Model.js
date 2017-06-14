"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../BaseModel");
var sequelize_1 = require("sequelize");
var SeqInstance = sequelize_1.Instance;
var SeqModelProto = sequelize_1.Model.prototype;
// work around for fixing issue while model definition;
// 'length' get called on instances dataValues (which
// is undefined during this process) by lodash, which
// results in weird behaviour
SeqInstance.prototype.dataValues = {};
/**
 * Sequelize model for sequelize versions less than v4
 */
exports.Model = (function () {
    var _Model = (function (_super) {
        __extends(class_1, _super);
        function class_1(values, options) {
            var _newTarget = this.constructor;
            return _super.call(this, values, BaseModel_1.BaseModel.prepareInstantiationOptions(options, _newTarget)) || this;
        }
        return class_1;
    }(SeqInstance));
    // Create proxies for static model, to forward any
    // static function calls to the "real" sequelize model,
    // which is referred in the property "Model";
    // e.g. "build" and "create"
    Object
        .keys(SeqModelProto)
        .forEach(function (key) {
        if (typeof SeqModelProto[key] === 'function') {
            _Model[key] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = SeqModelProto[key]).call.apply(_a, [this.Model || this].concat(args));
                var _a;
            };
        }
    });
    return _Model;
})();
//# sourceMappingURL=Model.js.map