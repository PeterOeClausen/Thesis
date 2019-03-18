import Tag from "./Tag";
import HierarchyNode from "./HierarchyNode";

/**
 * Repressents a Hierarchy in the M^3 model.
 * Is similar to Hierarchy.cs on the server.
 */
export default interface Hierarchy{
    Type: "Hierarchy",
    Id: number;
    Name: string;
    Tagset: Tag[]|null;
    TagsetId: number ;
    Nodes: HierarchyNode[];
    RootNodeId: number;
}