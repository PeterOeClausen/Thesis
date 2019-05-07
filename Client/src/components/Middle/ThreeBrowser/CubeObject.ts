import ObjectTagRelation from "./ObjectTagRelation";

/**
 * PhotoCube Client repressentation of an Object in the M^3 datamodel.
 * Is very similar to CubeObject.cs in PhotoCube Server implementation.
 */
export default interface CubeObject{
    Id: number,
    FileName: string|null,
    FileType: number,
    PhotoId: number,
    Photo: any,
    ObjectTagRelations: ObjectTagRelation[] | null,
    ThumbnailId: number,
    Thumbnail: any
}