import React, { Component } from 'react';

export default class Cell{
    x: number;
    y: number;
    z: number;

    cubeObjectData: object[] = [];

    constructor(x: number, y: number, z: number){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}