import React, { Component } from 'react';
import CubeObject from './CubeObject';

export default class Cell{
    //Coordinates:
    x: number;
    y: number;
    z: number;

    cubeObjectData: CubeObject[] = [];
    
    constructor(x: number, y: number, z: number){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}