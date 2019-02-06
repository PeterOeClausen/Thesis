import React, { Component } from 'react';
import Tag from './Tag';

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

    GetLength(){
        return this.LabelThreeObjectsAndTags.length;
    }

    GetAllThreeObjects(){
        return this.LabelThreeObjectsAndTags.concat(this.TitleThreeObject);
    }

    
}