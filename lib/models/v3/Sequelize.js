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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var SequelizeOrigin = require("sequelize");
var Model_1 = require("../Model");
var models_1 = require("../../services/models");
var models_2 = require("../../services/models");
var BaseSequelize_1 = require("../BaseSequelize");
var Table_1 = require("../../annotations/Table");
var preparedConfig;
var Sequelize = (function (_super) {
    __extends(Sequelize, _super);
    function Sequelize(config) {
        var _this = 
        // a spread operator would be the more reasonable approach here,
        // but this is currently not possible due to a bug by ts
        // https://github.com/Microsoft/TypeScript/issues/4130
        // TODO@robin probably make the constructor private and
        // TODO       use a static factory function instead
        _super.call(this, (preparedConfig = BaseSequelize_1.BaseSequelize.prepareConfig(config), preparedConfig.name), preparedConfig.username, preparedConfig.password, preparedConfig) || this;
        // to fix "$1" called with something that's not an instance of Sequelize.Model
        _this.Model = Function;
        _this.thoughMap = {};
        _this._ = {};
        _this.init(config);
        return _this;
    }
    Sequelize.prototype.getThroughModel = function (through) {
        // tslint:disable:max-classes-per-file
        var Through = (function (_super) {
            __extends(Through, _super);
            function Through() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Through;
        }(Model_1.Model));
        Through = __decorate([
            Table_1.Table({ tableName: through, modelName: through })
        ], Through);
        return Through;
    };
    /**
     * The association needs to be adjusted. So that throughModel properties
     * referencing a original sequelize Model instance
     */
    Sequelize.prototype.adjustAssociation = function (model, association) {
        if (association.throughModel && association.throughModel.Model) {
            var seqThroughModel_1 = association.throughModel.Model;
            var throughModel_1 = association.throughModel;
            Object.keys(seqThroughModel_1).forEach(function (key) {
                if (key !== 'name')
                    throughModel_1[key] = seqThroughModel_1[key];
            });
            association.throughModel = association.through.model = association.throughModel.Model;
        }
    };
    /**
     * Creates sequelize models and registers these models
     * in the registry
     */
    Sequelize.prototype.defineModels = function (classes) {
        var _this = this;
        classes.forEach(function (_class) {
            var modelName = models_1.getModelName(_class.prototype);
            var attributes = models_1.getAttributes(_class.prototype);
            var options = models_1.getOptions(_class.prototype);
            if (!options)
                throw new Error("@Table annotation is missing on class \"" + _class['name'] + "\"");
            var model = _this.define(modelName, attributes, options);
            // replace Instance model with the original model
            model.Instance = _class;
            model.Instance.prototype.Model = _class;
            model.Instance.prototype.$Model = _class;
            // this initializes some stuff for Instance
            model['refreshAttributes']();
            // copy static fields to class
            Object.keys(model).forEach(function (key) { return key !== 'name' && (_class[key] = model[key]); });
            // the class needs to know its sequelize model
            _class['Model'] = model;
            _class.prototype['Model'] = _class.prototype['$Model'] = model;
            // model needs to know its original class
            model[models_2.PROPERTY_LINK_TO_ORIG] = _class;
            // to fix "$1" called with something that's not an instance of Sequelize.Model
            _class['sequelize'] = _this;
        });
    };
    return Sequelize;
}(SequelizeOrigin));
exports.Sequelize = Sequelize;
//# sourceMappingURL=Sequelize.js.map