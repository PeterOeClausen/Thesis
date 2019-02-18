import Tag from "./Tag";

export default interface HierarchyNode{
    Id: number;
    TagId: number;
    Tag: Tag|null;
    HierarchyId: number;
    ParentId: number|null;
    Parent: HierarchyNode|null;
}