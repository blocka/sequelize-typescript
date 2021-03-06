/// <reference types="sequelize" />
import 'reflect-metadata';
import * as OriginSequelize from 'sequelize';
import { Model } from "../Model";
import { ISequelizeConfig } from "../../interfaces/ISequelizeConfig";
import { BaseSequelize } from "../BaseSequelize";
export declare class Sequelize extends OriginSequelize implements BaseSequelize {
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
    adjustAssociation(model: any, association: any): void;
    /**
     * Creates sequelize models and registers these models
     * in the registry
     */
    defineModels(models: Array<typeof Model>): void;
}
