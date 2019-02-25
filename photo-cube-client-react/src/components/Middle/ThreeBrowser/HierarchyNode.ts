import Tag from "./Tag";
import Hierarchy from "./Hierarchy";

export default interface HierarchyNode{
    Id: number;
    TagId: number;
    Tag: Tag;
    HierarchyId: number;
    Hierarchy: Hierarchy|null;
    Children: HierarchyNode[];
}