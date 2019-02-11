import CubeObject from './CubeObject';
import * as THREE from 'three';
import Fetcher from './Fetcher';

export default class Cell{
    //Reference to Scene.
    scene: THREE.Scene;
    textureLoader: THREE.TextureLoader;
    
    //Coordinates:
    x: number;
    y: number;
    z: number;

    //Data nessesary for cube to get own data.
    cubeObjectData: CubeObject[] = [];

    threeObject: THREE.Mesh;

    constructor(scene:THREE.Scene, textureLoader:THREE.TextureLoader, x: number, y: number, z: number, cubeObjectData: CubeObject[]){
        this.scene = scene;
        this.textureLoader = textureLoader;
        this.x = x;
        this.y = y;
        this.z = z;
        this.cubeObjectData = cubeObjectData;
        this.threeObject = this.CreateMesh();

        setInterval(() => {
            //Do something each 5000 seconds
        }, 5000);
    }

    CreateMesh(){
        //Load image as material:
        var imageMaterial = new THREE.MeshBasicMaterial({
            map : this.textureLoader.load(Fetcher.baseUrl + "/photo/" + this.cubeObjectData[0].PhotoId)
        });
        //Make box geometry:
        var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        //Create mesh:
        var boxMesh = new THREE.Mesh( boxGeometry, imageMaterial );
        //Position in (x,y,z):
        boxMesh.position.x = this.x;
        boxMesh.position.y = this.y;
        boxMesh.position.z = this.z;
        //Add to scene:
        this.scene.add( boxMesh );
        return boxMesh;
    }

    RemoveFromScene(){
        this.scene.remove(this.threeObject);
    }
}