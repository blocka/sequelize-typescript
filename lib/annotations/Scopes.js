"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var models_1 = require("../services/models");
/**
 * Sets scopes for annotated class
 */
function Scopes(scopes) {
    return function (target) {
        models_1.addScopeOptions(target.prototype, scopes);
    };
}
exports.Scopes = Scopes;
//# sourceMappingURL=Scopes.js.map