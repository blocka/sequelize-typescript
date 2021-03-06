/// <reference types="sequelize" />
import 'reflect-metadata';
import * as SequelizeOrigin from 'sequelize';
import { Model } from "../Model";
import { ISequelizeConfig } from "../../interfaces/ISequelizeConfig";
import { BaseSequelize } from "../BaseSequelize";
export declare class Sequelize extends SequelizeOrigin implements BaseSequelize {
    Model: any;
    thoughMap: {
        [through: string]: any;
    };
    _: {
        [modelName: string]: typeof Model;
    };
    init: (config: ISequelizeConfig) => void;
    addModels: (models: Array<typeof Model> | string[]) => void;
    associateModels: (models: Array<typeof Model>) => void;
    constructor(config: ISequelizeConfig);
    getThroughModel(through: string): typeof Model;
    /**
     * The association needs to be adjusted. So that throughModel properties
     * referencing a original sequelize Model instance
     */
    adjustAssociation(model: any, association: any): void;
    /**
     * Creates sequelize models and registers these models
     * in the registry
     */
    defineModels(classes: Array<typeof Model>): void;
}
