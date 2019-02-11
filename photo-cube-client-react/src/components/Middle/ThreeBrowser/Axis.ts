import Tag from './Tag';
import * as THREE from 'three';
import Position from "./Position";

export enum AxisTypeEnum {
    Tagset,
    Hierarchy
};

interface ObjectTagPairs{
    object: any,
    tagInfo: Tag
}

export default class Axis{
    TitleString: string = "";
    AxisType: AxisTypeEnum;
    TitleThreeObject: any = null;
    LineThreeObject: any;
    LabelStrings: string[] = [];
    LabelThreeObjectsAndTags: ObjectTagPairs[] = [];

    constructor(title: string, axisType: AxisTypeEnum){
        this.TitleString = title;
        this.AxisType = axisType;
    }

    RemoveObjectsFromScene(scene: THREE.Scene){
        this.LabelThreeObjectsAndTags.forEach((labelObject:{object:THREE.Mesh, tagInfo:Tag}) => scene.remove(labelObject.object));
        scene.remove(this.TitleThreeObject);
        scene.remove(this.LineThreeObject);
    }

    GetLength(){
        return this.LabelThreeObjectsAndTags.length;
    }

    GetAllThreeObjects(){
        return this.LabelThreeObjectsAndTags.concat(this.TitleThreeObject);
    }

    SetAxisType(axisType: AxisTypeEnum){
        this.AxisType = axisType;
    }
}