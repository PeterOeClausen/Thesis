import Axis from "./Axis";
import CubeObject from './CubeObject';
import Tag from "./Tag";

export default class Fetcher{
    static baseUrl: string = "https://localhost:44317/api/";

    static async FetchCellsFromAxis(xAxis: Axis|null, yAxis: Axis|null, zAxis: Axis|null){
        //Fetch and add new cells:
        let xDefined: boolean = xAxis !== null;
        let yDefined: boolean = yAxis !== null;
        let zDefined: boolean = zAxis !== null;
        if(!xDefined && !yDefined && !zDefined){ throw new Error("xAxis, yAxis and zAxis cannot all be null!") }
        let queryString: string = this.baseUrl + "cell/?";
        if(xDefined) { queryString += "xAxis=" + this.parseAxis(xAxis!)}
        if(yDefined) { queryString += "&yAxis=" + this.parseAxis(yAxis!)}
        if(zDefined) { queryString += "&zAxis=" + this.parseAxis(zAxis!)}
        //Header too long... use fetch with data instead! https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        console.log(queryString);
            
        return fetch(queryString)
            .then(result => {return result.json();});
    }

    private static parseAxis(axis: Axis) : string{
        console.log(axis.TitleString);
        return JSON.stringify( 
            {
                AxisDirection: axis.AxisDirection,
                AxisType: axis.AxisType,
                TagsetId: axis.TagsetId,
                HierarchyNodeId: axis.RootNodeId
            } 
        );
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

    static GetPhotoURL(photoId: number) : string{
        return Fetcher.baseUrl + "/photo/" + photoId;
    }

    static async FetchTagsWithCubeObjectId(cubeObjectId: number){
        return await fetch(Fetcher.baseUrl + "/tag?cubeObjectId=" + cubeObjectId)
            .then(result => {return result.json()});
    }

    /* THE REST OF THE FILE IS NOT IN USE, BUT IS KEPT FOR ILLUSTRATIVE PURPOSES: */

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

    //Not in use:
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
}