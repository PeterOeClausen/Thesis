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

    static async FetchCubeObjectsFromAxis(xAxis: Axis, addCubeCallBack: (url: string, position: Position) => any){
        //let coordinateObjectPairs : Array<CoordinateObjectPair> = [];
        let promises = [];
        
        for(let i = 0; i < xAxis.LabelThreeObjectsAndTags.length ; i++){
            promises.push(fetch(this.baseUrl + "cubeobject/FromTagId/" + xAxis.LabelThreeObjectsAndTags[i].tag.Id)
                .then(result => {return result.json();})
                .then(cubeObjectDataArray => {
                    //coordinateObjectPairs.push({coordinate : i, cubeObjectArr: cubeObjectDataArray});
                    
                    if(cubeObjectDataArray.length > 0){
                        addCubeCallBack("https://localhost:44317/api/photo/" + cubeObjectDataArray[0].PhotoId ,
                            {x:i+1, y:1, z:0}
                        );
                    }
                })
            );
        }

        return await Promise.all(promises);
        //return coordinateObjectPairs;
    }

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

    static FetchThumbnail(thumbnailId: number){
        let thumbnailImage = null;

        fetch(this.baseUrl + "thumbnail/" + thumbnailId)
        .then(result => {return result.json();})
        .then(thumbnail => {
            thumbnailImage = thumbnail.Image;
        });
        return thumbnailImage;
    }

    static async FetchCubeObjectsWithTag(tag: Tag){
        return await fetch(this.baseUrl + "cubeobject/fromTagId/" + tag.Id)
            .then(result => {return result.json();})
            .then((cubeObjectArr: CubeObject[]) => {return cubeObjectArr});
    }

    static async FetchCubeObjectsWith2Tags(tag1: Tag, tag2: Tag){
        return await fetch(this.baseUrl + "cubeobject/from2TagIds/" + tag1.Id + "/" + tag2.Id)
            .then(result => {return result.json();})
            .then((cubeObjectArr: CubeObject[]) => {return cubeObjectArr});
    }

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

    static FetchCubeObjectsFrom2Axis(xAxis: Axis, yAxis: Axis){
        let coordinateObjectPairs : Array<CoordinateObjectPair> = [];

        for(let i = 0; i < xAxis.LabelThreeObjectsAndTags.length ; i++){
            for(let j = 0; j < yAxis.LabelThreeObjectsAndTags.length ; j++){
                fetch(this.baseUrl + "cubeobject/FromTagId/" + xAxis.LabelThreeObjectsAndTags[i].tag.Id) //Add second axis tagInfo
                .then(result => {return result.json();})
                .then(cubeObjectDataArray => {
                    let result = cubeObjectDataArray as CubeObject[];
                    coordinateObjectPairs.push({coordinate : i, cubeObjectArr: result});
                });
            }
        }

        return coordinateObjectPairs;
    }

}