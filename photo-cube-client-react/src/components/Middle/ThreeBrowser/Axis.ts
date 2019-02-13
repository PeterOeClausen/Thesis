import Tag from './Tag';
import * as THREE from 'three';
import Position from "./Position";

export enum AxisTypeEnum {
    Tagset,
    Hierarchy
};

export interface ObjectTagPair{
    object: THREE.Mesh,
    tag: Tag
}

export enum AxisDirection{
    x,
    y,
    z
}

export default class Axis{
    TitleString: string = "";
    AxisType: AxisTypeEnum;
    AxisDirection: AxisDirection
    TitleThreeObject: any = null;
    LineThreeObject: any;
    LabelStrings: string[] = [];
    LabelThreeObjectsAndTags: ObjectTagPair[] = [];

    constructor(axisDirection:AxisDirection, title: string, axisType: AxisTypeEnum){
        this.AxisDirection = axisDirection;
        this.TitleString = title;
        this.AxisType = axisType;
    }

    RemoveObjectsFromScene(scene: THREE.Scene){
        this.LabelThreeObjectsAndTags.forEach((labelObject:{object:THREE.Mesh, tag:Tag}) => scene.remove(labelObject.object));
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