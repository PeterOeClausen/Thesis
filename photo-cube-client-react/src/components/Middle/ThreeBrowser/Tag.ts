export default interface Tag{
    Id: number,
    Name: string,
    Tagset: any,
    TagsetId: number,
    ObjectTagRelations: any
}

/*export default class Tag implements Tag{
    Id: number;
    Name: string;
    Tagset: any;
    TagsetId: number;
    ObjectTagRelations: any;
    constructor(id: number, name: string, tagset:any, tagsetId: number, objectTagRelations:any){
        this.Id = id;
        this.Name = name;
        this.Tagset = tagset;
        this.TagsetId = tagsetId;
        this.ObjectTagRelations = objectTagRelations;
    }
}*/