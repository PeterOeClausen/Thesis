import ObjectTagRelation from "./ObjectTagRelation";

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