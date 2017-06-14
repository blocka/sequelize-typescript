/// <reference types="sequelize" />
import 'reflect-metadata';
import { DataTypeAbstract, DefineOptions } from 'sequelize';
import { Model } from "../models/Model";
import { IPartialDefineAttributeColumnOptions } from "../interfaces/IPartialDefineAttributeColumnOptions";
import { IScopeOptions } from "../interfaces/IScopeOptions";
export declare const PROPERTY_LINK_TO_ORIG = "__origClass";
/**
 * Sets model name from class by storing this
 * information through reflect metadata
 */
export declare function setModelName(target: any, modelName: string): void;
/**
 * Returns model name from class by restoring this
 * information from reflect metadata
 */
export declare function getModelName(target: any): string;
/**
 * Returns model attributes from class by restoring this
 * information from reflect metadata
 */
export declare function getAttributes(target: any): any | undefined;
/**
 * Sets attributes
 */
export declare function setAttributes(target: any, attributes: any): void;
/**
 * Adds model attribute by specified property name and
 * sequelize attribute options and stores this information
 * through reflect metadata
 */
export declare function addAttribute(target: any, name: string, options: any): void;
/**
 * Adds attribute options for specific attribute
 */
export declare function addAttributeOptions(target: any, propertyName: string, options: IPartialDefineAttributeColumnOptions): void;
/**
 * Returns sequelize define options from class prototype
 * by restoring this information from reflect metadata
 */
export declare function getOptions(target: any): DefineOptions<any> | undefined;
/**
 * Sets seuqlize define options to class prototype
 */
export declare function setOptions(target: any, options: DefineOptions<any>): void;
/**
 * Adds options be assigning new options to old one
 */
export declare function addOptions(target: any, options: DefineOptions<any>): void;
/**
 * Maps design types to sequelize data types;
 * @throws if design type cannot be automatically mapped to
 * a sequelize data type
 */
export declare function getSequelizeTypeByDesignType(target: any, propertyName: string): DataTypeAbstract;
/**
 * Determines models from value
 */
export declare function getModels(arg: Array<typeof Model | string>): Array<typeof Model>;
/**
 * Resolves scopes and adds them to the specified models
 */
export declare function resolveScopes(models: Array<typeof Model>): void;
/**
 * Resolves all model getters of specified options object
 * recursively.
 * So that {model: () => Person} will be converted to
 * {model: Person}
 */
export declare function resolveModelGetter(options: any): void;
/**
 * Adds scope option meta data for specified prototype
 */
export declare function addScopeOptions(target: any, options: IScopeOptions): void;
/**
 * Returns scope option meta data from specified target
 */
export declare function getScopeOptions(target: any): IScopeOptions | undefined;
/**
 * Pre conform includes, so that "as" value can be inferred from source
 */
export declare function preConformIncludes(options: any, source: any): any;
