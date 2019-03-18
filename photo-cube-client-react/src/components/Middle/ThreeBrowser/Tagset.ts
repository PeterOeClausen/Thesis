import Tag from "./Tag";
import Hierarchy from "./Hierarchy";

/**
 * Repressents a Tagset in the M^3 datamodel.
 * Is similar to Tagset.cs in the server implementation.
 */
export default interface Tagset{
    Id: number;
    Name: string;
    Tags: Tag[]|null;
    Hierarchies: Hierarchy[]|null;
}