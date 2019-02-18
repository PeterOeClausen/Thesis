import Tag from "./Tag";
import HierarchyNode from "./HierarchyNode";

export default interface Hierarchy{
    Id: number;
    Name: string;
    Tagset: Tag[]|null;
    TagsetId: number ;
    Nodes: HierarchyNode[];
}