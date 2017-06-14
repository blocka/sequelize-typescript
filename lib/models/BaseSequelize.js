"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../services/models");
var association_1 = require("../services/association");
var models_2 = require("../services/models");
var association_2 = require("../services/association");
/**
 * Why does v3/Sequlize and v4/Sequelize does not extend? Because of
 * the transpile target, which is for v3/Sequelize and BaseSequelize ES5
 * and for v4/Sequelize ES6. This is needed for extending the original
 * Sequelize (version 4), which is an ES6 class: ES5 constructor-pattern
 * "classes" cannot extend ES6 classes
 */
var BaseSequelize = (function () {
    function BaseSequelize() {
        this.thoughMap = {};
        this._ = {};
    }
    BaseSequelize.extend = function (target) {
        // PROTOTYPE MEMBERS
        // --------------------------
        var _this = this;
        // copies all prototype members of this to target.prototype
        Object
            .keys(this.prototype)
            .forEach(function (name) { return target.prototype[name] = _this.prototype[name]; });
        // STATIC MEMBERS
        // --------------------------
        // copies all static members of this to target
        Object
            .keys(this)
            .forEach(function (name) { return target[name] = _this[name]; });
    };
    /**
     * Prepares sequelize config passed to original sequelize constructor
     */
    BaseSequelize.prepareConfig = function (config) {
        if (config.validateOnly) {
            return Object.assign({}, config, {
                name: '_name_',
                username: '_username_',
                password: '_password_',
                dialect: 'sqlite',
                dialectModulePath: __dirname + '/../utils/db-dialect-dummy'
            });
        }
        return config;
    };
    BaseSequelize.prototype.addModels = function (arg) {
        var _this = this;
        var models = models_1.getModels(arg);
        this.defineModels(models);
        models.forEach(function (model) { return model.isInitialized = true; });
        this.associateModels(models);
        models_2.resolveScopes(models);
        models.forEach(function (model) { return _this._[model.name] = model; });
    };
    BaseSequelize.prototype.init = function (config) {
        if (config.modelPaths)
            this.addModels(config.modelPaths);
    };
    /**
     * Processes model associations
     */
    BaseSequelize.prototype.associateModels = function (models) {
        var _this = this;
        models.forEach(function (model) {
            var associations = association_1.getAssociations(model.prototype);
            if (!associations)
                return;
            associations.forEach(function (association) {
                var foreignKey = association.foreignKey || association_2.getForeignKey(model, association);
                var relatedClass = association.relatedClassGetter();
                var through;
                var otherKey;
                if (association.relation === association_1.BELONGS_TO_MANY) {
                    if (association.otherKey) {
                        otherKey = association.otherKey;
                    }
                    else {
                        if (!association.relatedClassGetter) {
                            throw new Error("RelatedClassGetter missing on \"" + model['name'] + "\"");
                        }
                        otherKey = association_2.getForeignKey(association.relatedClassGetter(), association);
                    }
                    if (association.through) {
                        if (!_this.thoughMap[association.through]) {
                            var throughModel = _this.getThroughModel(association.through);
                            _this.addModels([throughModel]);
                            _this.thoughMap[association.through] = throughModel;
                        }
                        through = _this.thoughMap[association.through];
                    }
                    else {
                        if (!association.throughClassGetter) {
                            throw new Error("ThroughClassGetter missing on \"" + model['name'] + "\"");
                        }
                        through = association.throughClassGetter();
                    }
                }
                model[association.relation](relatedClass, {
                    as: association.as,
                    through: through,
                    foreignKey: foreignKey,
                    otherKey: otherKey
                });
                // The associations has to be adjusted
                var _association = model['associations'][association.as];
                // String based through's need adjustment
                if (association.through) {
                    // as and associationAccessor values referring to string "Through"
                    _association.oneFromSource.as = association.through;
                    _association.oneFromSource.options.as = association.through;
                    _association.oneFromSource.associationAccessor = association.through;
                    _association.oneFromTarget.as = association.through;
                    _association.oneFromTarget.options.as = association.through;
                    _association.oneFromTarget.associationAccessor = association.through;
                }
                _this.adjustAssociation(model, _association);
            });
        });
    };
    return BaseSequelize;
}());
exports.BaseSequelize = BaseSequelize;
//# sourceMappingURL=BaseSequelize.js.map