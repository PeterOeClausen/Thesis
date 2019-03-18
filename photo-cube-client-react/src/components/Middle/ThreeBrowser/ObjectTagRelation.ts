/**
 * Reppressent a relation between a CubeObject and a Tag.
 * Is similar to ObjectTagRelation.cs in the server implementation.
 */
export default interface ObjectTagRelation{
    ObjectId:number,
    TagId:number,
    Tag:any
}