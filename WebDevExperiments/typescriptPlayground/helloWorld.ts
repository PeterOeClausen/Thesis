let message: string = "Hello World!";
console.log(message);


export default interface HierarchyNode{
    Id: number;
    TagId: number;
    HierarchyId: number;
    Children: HierarchyNode[];
}

export default class HierarchyNode2{
    Id: number;
    TagId: number;
    HierarchyId: number;
    Children: HierarchyNode[];
    constructor(id, tagId, hierarchyId, children){
        this.Id = id;
        this.TagId = tagId;
        this.HierarchyId = hierarchyId;
        this.Children = children;
    }
}

let aHierarchyNodeC : HierarchyNode = new HierarchyNode2(1, 1, 1, []);

console.log(aHierarchyNodeC instanceof HierarchyNode2);