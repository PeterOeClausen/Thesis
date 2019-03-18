import Tag from "./Tag";
import Hierarchy from "./Hierarchy";

/**
 * Repressents a node in a hierarchy.
 * Is similar to Node.cs in server implementation.
 */
export default interface HierarchyNode{
    Id: number;
    TagId: number;
    Tag: Tag;
    HierarchyId: number;
    Hierarchy: Hierarchy|null;
    Children: HierarchyNode[];
}