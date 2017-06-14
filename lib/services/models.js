"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var fs = require("fs");
var path = require("path");
var Model_1 = require("../models/Model");
var data_type_1 = require("../utils/data-type");
var object_1 = require("../utils/object");
var association_1 = require("./association");
var array_1 = require("../utils/array");
var MODEL_NAME_KEY = 'sequelize:modelName';
var SCOPES_KEY = 'sequelize:scopes';
var ATTRIBUTES_KEY = 'sequelize:attributes';
var OPTIONS_KEY = 'sequelize:options';
var DEFAULT_OPTIONS = {
    timestamps: false
};
exports.PROPERTY_LINK_TO_ORIG = '__origClass';
/**
 * Sets model name from class by storing this
 * information through reflect metadata
 */
function setModelName(target, modelName) {
    Reflect.defineMetadata(MODEL_NAME_KEY, modelName, target);
}
exports.setModelName = setModelName;
/**
 * Returns model name from class by restoring this
 * information from reflect metadata
 */
function getModelName(target) {
    return Reflect.getMetadata(MODEL_NAME_KEY, target);
}
exports.getModelName = getModelName;
/**
 * Returns model attributes from class by restoring this
 * information from reflect metadata
 */
function getAttributes(target) {
    var attributes = Reflect.getMetadata(ATTRIBUTES_KEY, target);
    if (attributes) {
        return Object.keys(attributes).reduce(function (copy, key) {
            copy[key] = Object.assign({}, attributes[key]);
            return copy;
        }, {});
    }
}
exports.getAttributes = getAttributes;
/**
 * Sets attributes
 */
function setAttributes(target, attributes) {
    Reflect.defineMetadata(ATTRIBUTES_KEY, Object.assign({}, attributes), target);
}
exports.setAttributes = setAttributes;
/**
 * Adds model attribute by specified property name and
 * sequelize attribute options and stores this information
 * through reflect metadata
 */
function addAttribute(target, name, options) {
    var attributes = getAttributes(target);
    if (!attributes) {
        attributes = {};
    }
    attributes[name] = Object.assign({}, options);
    setAttributes(target, attributes);
}
exports.addAttribute = addAttribute;
/**
 * Adds attribute options for specific attribute
 */
function addAttributeOptions(target, propertyName, options) {
    var attributes = getAttributes(target);
    if (!attributes || !attributes[propertyName]) {
        throw new Error("@Column annotation is missing for \"" + propertyName + "\" of class \"" + target.constructor.name + "\"" +
            " or annotation order is wrong.");
    }
    attributes[propertyName] = object_1.deepAssign(attributes[propertyName], options);
    setAttributes(target, attributes);
}
exports.addAttributeOptions = addAttributeOptions;
/**
 * Returns sequelize define options from class prototype
 * by restoring this information from reflect metadata
 */
function getOptions(target) {
    var options = Reflect.getMetadata(OPTIONS_KEY, target);
    if (options) {
        return Object.assign({}, options);
    }
}
exports.getOptions = getOptions;
/**
 * Sets seuqlize define options to class prototype
 */
function setOptions(target, options) {
    Reflect.defineMetadata(OPTIONS_KEY, Object.assign({}, DEFAULT_OPTIONS, options), target);
}
exports.setOptions = setOptions;
/**
 * Adds options be assigning new options to old one
 */
function addOptions(target, options) {
    var _options = getOptions(target);
    if (!_options) {
        _options = {};
    }
    setOptions(target, Object.assign(_options, options));
}
exports.addOptions = addOptions;
/**
 * Maps design types to sequelize data types;
 * @throws if design type cannot be automatically mapped to
 * a sequelize data type
 */
function getSequelizeTypeByDesignType(target, propertyName) {
    var type = Reflect.getMetadata('design:type', target, propertyName);
    var dataType = data_type_1.inferDataType(type);
    if (dataType) {
        return dataType;
    }
    throw new Error("Specified type of property '" + propertyName + "'\n            cannot be automatically resolved to a sequelize data type. Please\n            define the data type manually");
}
exports.getSequelizeTypeByDesignType = getSequelizeTypeByDesignType;
/**
 * Determines models from value
 */
function getModels(arg) {
    if (arg && typeof arg[0] === 'string') {
        return arg.reduce(function (models, dir) {
            var _models = fs
                .readdirSync(dir)
                .filter(function (file) {
                // TODO extension is not necessarily only the lasst three characters
                var extension = file.slice(-3);
                return extension === '.js' || (extension === '.ts' && file.slice(-5) !== '.d.ts');
            })
                .map(function (file) { return path.parse(file).name; })
                .filter(array_1.uniqueFilter)
                .map(function (fileName) {
                var fullPath = path.join(dir, fileName);
                var module = require(fullPath);
                if (!module[fileName] && !module.default) {
                    throw new Error("No default export defined for file \"" + fileName + "\" or export does not satisfy filename.");
                }
                return module[fileName] || module.default;
            });
            models.push.apply(models, _models);
            return models;
        }, []);
    }
    return arg;
}
exports.getModels = getModels;
/**
 * Resolves scopes and adds them to the specified models
 */
function resolveScopes(models) {
    models.forEach(function (model) {
        var options = getScopeOptions(model.prototype);
        if (options) {
            Object
                .keys(options)
                .forEach(function (key) {
                var scopeFindOptions = options[key];
                resolveModelGetter(scopeFindOptions);
                scopeFindOptions = preConformIncludes(scopeFindOptions, model);
                model.addScope(key, scopeFindOptions, { override: true });
            });
        }
    });
}
exports.resolveScopes = resolveScopes;
/**
 * Resolves all model getters of specified options object
 * recursively.
 * So that {model: () => Person} will be converted to
 * {model: Person}
 */
function resolveModelGetter(options) {
    Object
        .keys(options)
        .forEach(function (key) {
        var value = options[key];
        if (typeof value === 'function' && value.length === 0) {
            var maybeModel = value();
            if (maybeModel && maybeModel.prototype && maybeModel.prototype instanceof Model_1.Model) {
                options[key] = maybeModel;
            }
        }
        else if (value && typeof value === 'object') {
            resolveModelGetter(value);
        }
    });
}
exports.resolveModelGetter = resolveModelGetter;
/**
 * Adds scope option meta data for specified prototype
 */
function addScopeOptions(target, options) {
    var _options = getScopeOptions(target) || {};
    setScopeOptions(target, object_1.deepAssign({}, _options, options));
}
exports.addScopeOptions = addScopeOptions;
/**
 * Returns scope option meta data from specified target
 */
function getScopeOptions(target) {
    var options = Reflect.getMetadata(SCOPES_KEY, target);
    if (options) {
        return object_1.deepAssign({}, options);
    }
}
exports.getScopeOptions = getScopeOptions;
/**
 * Pre conform includes, so that "as" value can be inferred from source
 */
function preConformIncludes(options, source) {
    options = Object.assign({}, options);
    if (!options.include) {
        return options;
    }
    // if include is not an array, wrap in an array
    if (!Array.isArray(options.include)) {
        options.include = [options.include];
    }
    else if (!options.include.length) {
        delete options.include;
        return;
    }
    // convert all included elements to { model: Model } form
    options.include = options.include.map(function (include) {
        include = preConformInclude(include, source);
        return include;
    });
    return options;
}
exports.preConformIncludes = preConformIncludes;
/**
 * Pre conform include, so that alias ("as") value can be inferred from source class
 */
function preConformInclude(include, source) {
    var isConstructorFn = include instanceof Function;
    if (isConstructorFn || (include.model && !include.as)) {
        if (isConstructorFn) {
            include = { model: include };
        }
        var associations = association_1.getAssociationsByRelation((source[exports.PROPERTY_LINK_TO_ORIG] || source).prototype || source, include.model);
        if (associations.length > 0) {
            if (associations.length > 1) {
                throw new Error("Alias cannot be inferred: \"" + source.name + "\" has multiple relations with \"" + include.model.name + "\"");
            }
            include.as = associations[0].as;
        }
    }
    if (!isConstructorFn && include.include) {
        include = preConformIncludes(include, include.model);
    }
    return include;
}
/**
 * Set scope option meta data for specified prototype
 */
function setScopeOptions(target, options) {
    Reflect.defineMetadata(SCOPES_KEY, options, target);
}
//# sourceMappingURL=models.js.map