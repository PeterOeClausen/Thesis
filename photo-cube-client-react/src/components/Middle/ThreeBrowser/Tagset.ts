import Tag from "./Tag";
import Hierarchy from "./Hierarchy";

/**
 * Repressents a Tagset in the M^3 datamodel.
 */
export default interface Tagset{
    Id: number;
    Name: string;
    Tags: Tag[]|null;
    Hierarchies: Hierarchy[]|null;
}