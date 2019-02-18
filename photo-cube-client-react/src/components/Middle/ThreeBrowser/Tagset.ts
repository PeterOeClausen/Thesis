import Tag from "./Tag";
import Hierarchy from "./Hierarchy";

export default interface Tagset{
    Id: number;
    Name: string;
    Tags: Tag[]|null;
    Hierarchies: Hierarchy[]|null;
}