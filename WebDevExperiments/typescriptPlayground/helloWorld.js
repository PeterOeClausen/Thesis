"use strict";
exports.__esModule = true;
var message = "Hello World!";
console.log(message);
var HierarchyNode2 = /** @class */ (function () {
    function HierarchyNode2(id, tagId, hierarchyId, children) {
        this.Id = id;
        this.TagId = tagId;
        this.HierarchyId = hierarchyId;
        this.Children = children;
    }
    return HierarchyNode2;
}());
exports["default"] = HierarchyNode2;
var aHierarchyNodeC = new HierarchyNode2(1, 1, 1, []);
console.log(aHierarchyNodeC instanceof HierarchyNode2);
