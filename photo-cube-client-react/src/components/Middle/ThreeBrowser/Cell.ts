import React, { Component } from 'react';

class Cell{
    x: number;
    y: number;
    z: number;

    data: object[] = [];

    constructor(x: number, y: number, z: number){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}