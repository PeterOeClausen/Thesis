/**
 * Repressents a Tag in the M^3 model.
 * Is similar to Tag.cs in the server implementation.
 */
export default interface Tag{
    Id: number,
    Name: string,
    Tagset: any,
    TagsetId: number,
    ObjectTagRelations: any
}