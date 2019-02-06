import Axis from "./Axis";
import CubeObject from './CubeObject';

const baseUrl: string = "https://localhost:44317/api/";
const path: string = "cubeobject/FromTagId/";

export interface CoordinateObjectPair{
    coordinate: number,
    cubeObjectArr: CubeObject[]
}

export default class Fetcher{

    static FetchCubeObjectsFromAxis(xAxis: Axis, addCubeCallBack: (url: string, position: object) => any){
        let coordinateObjectPairs : Array<CoordinateObjectPair> = [];

        for(let i = 0; i < xAxis.LabelThreeObjectsAndTags.length ; i++){
            fetch(baseUrl + path + xAxis.LabelThreeObjectsAndTags[i].tagInfo.Id)
                .then(result => {return result.json();})
                .then(cubeObjectDataArray => {
                    coordinateObjectPairs.push({coordinate : i, cubeObjectArr: cubeObjectDataArray});
                    
                    if(cubeObjectDataArray.length > 0){
                        addCubeCallBack("https://localhost:44317/api/thumbnail/" + cubeObjectDataArray[0].ThumbnailId ,
                        {x:i, y:1, z:0});
                    }
                });
        }

        return coordinateObjectPairs;
    }

    static FetchThumbnail(thumbnailId: number){
        let thumbnailImage = null;

        fetch(baseUrl + "thumbnail/" + thumbnailId)
        .then(result => {return result.json();})
        .then(thumbnail => {
            thumbnailImage = thumbnail.Image;
        });
        return thumbnailImage;
    }

    static FetchCubeObjectsFrom2Axis(xAxis: Axis, yAxis: Axis){
        let coordinateObjectPairs : Array<CoordinateObjectPair> = [];

        for(let i = 0; i < xAxis.LabelThreeObjectsAndTags.length ; i++){
            for(let j = 0; j < yAxis.LabelThreeObjectsAndTags.length ; j++){
                fetch(baseUrl + path + xAxis.LabelThreeObjectsAndTags[i].tagInfo.Id) //Add second axis tagInfo
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