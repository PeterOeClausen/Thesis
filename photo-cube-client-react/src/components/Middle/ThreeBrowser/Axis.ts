import React, { Component } from 'react';

export default class Axis{
    TitleString: string = "";
    TitleThreeObject: any = null;
    LineThreeObject: any;
    LabelStrings: string[] = [];
    LabelThreeObjectsAndTags: object[] = [];

    constructor(title: string){
        this.TitleString = title;
    }

    GetLength(){
        return this.LabelThreeObjectsAndTags.length;
    }

    GetAllThreeObjects(){
        return this.LabelThreeObjectsAndTags.concat(this.TitleThreeObject);
    }

    
}