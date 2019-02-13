import CubeObject from './CubeObject';
import * as THREE from 'three';
import Fetcher from './Fetcher';
import Position from './Position';
import { TextureLoader } from 'three';
import ImageTextureLoader from './ImageTextureLoader';

export default class Cell{
    //Reference to Scene.
    scene: THREE.Scene;
    textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
    
    //Coordinates:
    x: number;
    y: number;
    z: number;

    //Data nessesary for cube to get own data.
    cubeObjectData: CubeObject[];
    threeObject: THREE.Mesh | null;

    imageIndex: number = 0;

    constructor(scene:THREE.Scene, textureLoader:THREE.TextureLoader, aPosition:Position, cubeObjectData: CubeObject[]){
        this.scene = scene;
        
        this.x = aPosition.x;
        this.y = aPosition.y;
        this.z = aPosition.z;
        this.cubeObjectData = cubeObjectData;
        if(cubeObjectData.length > 0){
            this.threeObject = this.CreateMesh();
            //this.ToggleSwitchingImagesEveryXms(10000);
        }
        else{
            this.threeObject = null;
        }
    }

    ToggleSwitchingImagesEveryXms(miliseconds: number){
        setInterval(() => {
            this.imageIndex++;
            let nextImage = this.imageIndex % this.cubeObjectData.length;
            console.log(nextImage);
            this.threeObject!.material = new THREE.MeshBasicMaterial({
                map : this.textureLoader.load(Fetcher.baseUrl + "/photo/" + 
                    this.cubeObjectData[nextImage].PhotoId)
            });
            //Do something each 5000 seconds  
        }, miliseconds);
    }

    CreateMesh(){
        THREE.Cache.enabled = true;
        //Load image as material:
        let imageMaterial = new THREE.MeshBasicMaterial({
            map : ImageTextureLoader.Load(Fetcher.baseUrl + "/photo/" + this.cubeObjectData[0].PhotoId)
        });
        //Make box geometry:
        let boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        //Create mesh:
        let boxMesh = new THREE.Mesh( boxGeometry, imageMaterial );
        //Position in (x,y,z):
        boxMesh.position.x = this.x;
        boxMesh.position.y = this.y;
        boxMesh.position.z = this.z;
        //Add to scene:
        this.scene.add( boxMesh );
        return boxMesh;
    }

    RemoveFromScene(){
        if(this.threeObject != null) this.scene.remove(this.threeObject);
    }
}