"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var association_1 = require("../../services/association");
function BelongsToMany(relatedClassGetter, through, foreignKey, otherKey) {
    return function (target, propertyName) {
        association_1.addAssociation(target, association_1.BELONGS_TO_MANY, relatedClassGetter, propertyName, foreignKey, otherKey, through);
    };
}
exports.BelongsToMany = BelongsToMany;
//# sourceMappingURL=BelongsToMany.js.map