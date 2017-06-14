"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var models_1 = require("../services/models");
/**
 * Sets default scope for annotated class
 */
function DefaultScope(scope) {
    return function (target) {
        models_1.addScopeOptions(target.prototype, {
            defaultScope: scope
        });
    };
}
exports.DefaultScope = DefaultScope;
//# sourceMappingURL=DefaultScope.js.map