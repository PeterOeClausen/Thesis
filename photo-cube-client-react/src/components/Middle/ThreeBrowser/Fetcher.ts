import Axis from "./Axis";
import CubeObject from './CubeObject';
import Position from './Position';
import Tag from "./Tag";

export interface CoordinateObjectPair{
    coordinate: number,
    cubeObjectArr: CubeObject[]
}

export default class Fetcher{
    static baseUrl: string = "https://localhost:44317/api/";

    //Not in use:
    static async imageResult(PhotoId: number){
        // Using sessionStorage as cache:
        let cachedValue = sessionStorage.getItem("photo/" + PhotoId);
        let imageResult: File;
        if(cachedValue != null){ //Cache hit!
            console.log("Cache hit in Photo!");
            imageResult = JSON.parse(cachedValue);
        }else{
            imageResult = await fetch(this.baseUrl + "photo/" + PhotoId)
            .then(result => {return result.json();});
            // Cache data using sessionStorage:
            sessionStorage.setItem("photo/" + PhotoId, JSON.stringify(imageResult));
        }
        return imageResult;
    }

    //Not in use:    
    static FetchThumbnail(thumbnailId: number){
        let thumbnailImage = null;

        fetch(this.baseUrl + "thumbnail/" + thumbnailId)
        .then(result => {return result.json();})
        .then(thumbnail => {
            thumbnailImage = thumbnail.Image;
        });
        return thumbnailImage;
    }

    //Not in use:
    static async FetchCubeObjectsWithTag(tag: Tag){
        return await fetch(this.baseUrl + "cubeobject/fromTagId/" + tag.Id)
            .then(result => {return result.json();})
            .then((cubeObjectArr: CubeObject[]) => {return cubeObjectArr});
    }

    //Not in use:
    static async FetchCubeObjectsWith2Tags(tag1: Tag, tag2: Tag){
        return await fetch(this.baseUrl + "cubeobject/from2TagIds/" + tag1.Id + "/" + tag2.Id)
            .then(result => {return result.json();})
            .then((cubeObjectArr: CubeObject[]) => {return cubeObjectArr});
    }

    //Not in use:
    static async FetchCubeObjectsWith3Tags(tag1: Tag, tag2: Tag, tag3: Tag){
        return await fetch(this.baseUrl + "cubeobject/from3TagIds/" + tag1.Id + "/" + tag2.Id + "/" + tag3.Id)
            .then(result => {return result.json();})
            .then((cubeObjectArr: CubeObject[]) => {return cubeObjectArr});
    }

    //OTR = ObjectTagRelations
    //Filters instead of getting new.
    static async FetchCubeObjectsWithTagsOTR(tag1: Tag, tag2: Tag|null, tag3: Tag|null){
        // Using sessionStorage as cache:
        let cachedValue = sessionStorage.getItem("cubeobject/fromTagIdWithOTR/" + tag1.Id);
        let cubeObjectArrResult: CubeObject[];
        if(cachedValue != null){ //Cache hit!
            console.log("Cache hit!")
            cubeObjectArrResult = JSON.parse(cachedValue);
        }else{  //No cache hit, get data from server:
            cubeObjectArrResult = await fetch(this.baseUrl + "cubeobject/fromTagIdWithOTR/" + tag1.Id)
                .then(result => {return result.json();})
                .then((cubeObjectArr: CubeObject[]) => {
                    return cubeObjectArr
                });
            // Cache data using sessionStorage:
            sessionStorage.setItem("cubeobject/fromTagIdWithOTR/" + tag1.Id, JSON.stringify(cubeObjectArrResult));
        }
        //Filter:
        if(tag2 != null){ 
            //Filters out CubeObjects not tagged with tag2:
            cubeObjectArrResult = cubeObjectArrResult
                .filter(co => co.ObjectTagRelations!.some(otr => otr.TagId == tag2.Id));
        }if(tag3 != null){
            //Filters out CubeObjects not tagged with tag3:
            cubeObjectArrResult = cubeObjectArrResult
                .filter(co => co.ObjectTagRelations!.some(otr => otr.TagId == tag3.Id));
        }
        return cubeObjectArrResult;
    }

    static async FetchCellsFromAxis(xAxis: Axis, yAxis: Axis, zAxis: Axis){
        //Fetch and add new cells:
        let xDefined : boolean = xAxis.TitleString != "X";
        let yDefined : boolean = yAxis.TitleString != "Y";
        let zDefined : boolean = zAxis.TitleString != "Z";
        let promise: Promise<void>;
        if(xDefined){

        }
    }

    static async FetchNode(nodeId: number){
        return await fetch(Fetcher.baseUrl + "/node/" + nodeId)
            .then(result => {return result.json()});
    }

    static async FetchHierarchy(hierarchyId: number){
        return await fetch(Fetcher.baseUrl + "/hierarchy/" + hierarchyId)
            .then(result => {return result.json()});
    }

    static async FetchTagset(tagsetId: number){
        return await fetch(Fetcher.baseUrl + "/tagset/" + tagsetId)
        .then(result => {return result.json()});
    }
}