"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var versioning_1 = require("../utils/versioning");
var string_1 = require("../utils/string");
var models_1 = require("../services/models");
var object_1 = require("../utils/object");
var parentPrototype = versioning_1.majorVersion === 3 ? sequelize_1.Instance.prototype : sequelize_1.Model.prototype;
var BaseModel = (function () {
    function BaseModel() {
    }
    BaseModel.extend = function (target) {
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
        // Creates proxies for all static methods but forbidden ones
        object_1.getAllPropertyNames(target)
            .filter(function (key) { return !isForbiddenKey(key); })
            .forEach(function (key) {
            if (typeof target[key] !== 'function')
                return;
            var superFn = target[key];
            target[key] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (!this.isInitialized) {
                    throw new Error("Model not initialized: \"" + this.name + "\" needs to be added to a Sequelize instance " +
                        ("before \"" + key + "\" can be called."));
                }
                var optionIndex = BaseModel.toPreConformIncludeMap[key];
                if (optionIndex !== void 0) {
                    var options = args[optionIndex];
                    if (options) {
                        args[optionIndex] = models_1.preConformIncludes(options, this);
                    }
                }
                return superFn.call.apply(superFn, [this].concat(args));
            };
        });
        function isForbiddenKey(key) {
            // is private member?
            if (key.charAt(0) === '_') {
                return true;
            }
            var forbiddenKeys = ['name', 'constructor', 'length', 'prototype', 'caller', 'arguments', 'apply',
                'QueryInterface', 'QueryGenerator', 'init', 'replaceHookAliases', 'refreshAttributes'];
            return forbiddenKeys.indexOf(key) !== -1;
        }
    };
    BaseModel.prepareInstantiationOptions = function (options, source) {
        options = models_1.preConformIncludes(options, source);
        if (!('isNewRecord' in options))
            options.isNewRecord = true;
        // TODO@robin has to be validated: necessary?
        // options = _.extend({
        //   isNewRecord: true,
        //   $schema: this.$schema,
        //   $schemaDelimiter: this.$schemaDelimiter
        // }, options || {});
        var staticMethodPrefix = versioning_1.majorVersion === 3 ? '$' : '_';
        // preventing TypeError: Cannot read property 'indexOf' of undefined(=includeNames)
        if (!options['includeNames'])
            options['includeNames'] = [];
        if (!options['includeValidated']) {
            sequelize_1.Model[staticMethodPrefix + 'conformOptions'](options, source);
            if (options.include) {
                sequelize_1.Model[staticMethodPrefix + 'expandIncludeAll'].call(source, options);
                sequelize_1.Model[staticMethodPrefix + 'validateIncludedElements'].call(source, options);
            }
        }
        return options;
    };
    /**
     * Adds relation between specified instances and source instance
     */
    BaseModel.prototype.$add = function (propertyKey, instances, options) {
        // TODO@robin find a way to add values to the target(this) datavalues
        // const dataValues = this['dataValues']; // this will not work correctly
        //
        // if (!dataValues[propertyKey]) dataValues[propertyKey] = [];
        //
        // dataValues[propertyKey].push(value);
        return this['add' + string_1.capitalize(propertyKey)](instances, options);
    };
    ;
    /**
     * Sets relation between specified instances and source instance
     * (replaces old relations)
     */
    BaseModel.prototype.$set = function (propertyKey, instances, options) {
        // TODO@robin find a way to add values to the target(this) datavalues
        // this['dataValues'][propertyKey] = args[0]; // this will not work correctly
        return this['set' + string_1.capitalize(propertyKey)](instances, options);
    };
    ;
    /**
     * Returns related instance (specified by propertyKey) of source instance
     */
    BaseModel.prototype.$get = function (propertyKey, options) {
        return this['get' + string_1.capitalize(propertyKey)](options);
    };
    ;
    /**
     * Counts related instances (specified by propertyKey) of source instance
     */
    BaseModel.prototype.$count = function (propertyKey, options) {
        return this['count' + string_1.capitalize(propertyKey)](options);
    };
    ;
    /**
     * Creates instances and relate them to source instance
     */
    BaseModel.prototype.$create = function (propertyKey, values, options) {
        return this['create' + string_1.capitalize(propertyKey)](values, options);
    };
    ;
    /**
     * Checks if specified instances is related to source instance
     */
    BaseModel.prototype.$has = function (propertyKey, instances, options) {
        return this['has' + string_1.capitalize(propertyKey)](instances, options);
    };
    ;
    /**
     * Removes specified instances from source instance
     */
    BaseModel.prototype.$remove = function (propertyKey, instances, options) {
        return this['remove' + string_1.capitalize(propertyKey)](instances, options);
    };
    ;
    /**
     * Pre conforms includes
     *
     * SEE DETAILS FOR ACTUAL FUNCTIONALITY ON DECLARATION FILE
     */
    BaseModel.prototype.reload = function (options) {
        return parentPrototype.reload.call(this, models_1.preConformIncludes(options, this));
    };
    ;
    return BaseModel;
}());
BaseModel.isInitialized = false;
/**
 * Indicates which static methods of Model has to be proxied,
 * to prepare include option to automatically resolve alias;
 * The index represents the index of the options of the
 * corresponding method parameter
 */
BaseModel.toPreConformIncludeMap = {
    bulkBuild: 1,
    build: 1,
    create: 1,
    aggregate: 2,
    findAll: 0,
    findById: 1,
    findOne: 0,
    reload: 0,
    find: 0,
};
exports.BaseModel = BaseModel;
//# sourceMappingURL=BaseModel.js.map