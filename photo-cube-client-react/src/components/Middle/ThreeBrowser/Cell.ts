import CubeObject from './CubeObject';
import * as THREE from 'three';
import Fetcher from './Fetcher';
import Position from './Position';
import { TextureLoader } from 'three';
import ImageTextureLoader from './ImageTextureLoader';

export default interface ICell{
    //Coordinates:
    x: number;
    y: number;
    z: number;

    //Data nessesary for cube to get own data.
    CubeObjects: CubeObject[];
}

export default class Cell{
    //Reference to Scene.
    scene: THREE.Scene;
    textureLoader: THREE.TextureLoader;
    
    //Coordinates in hyperCube:
    x: number;
    y: number;
    z: number;

    //Data nessesary for cube to get own data.
    CubeObjects: CubeObject[];
    threeObject: THREE.Mesh | null;

    imageIndex: number = 0;

    constructor(
        scene:THREE.Scene, 
        textureLoader:THREE.TextureLoader, 
        addCubeCallback: (imageUrl: string, aPosition: Position) => THREE.Mesh, aPosition:Position, 
        cubeObjectData: CubeObject[]
        ){
        
        this.scene = scene;
        this.textureLoader = textureLoader;
        
        this.x = aPosition.x;
        this.y = aPosition.y;
        this.z = aPosition.z;
        this.CubeObjects = cubeObjectData;
        if(cubeObjectData.length > 0){
            this.threeObject = addCubeCallback(Fetcher.baseUrl + "/thumbnail/" + this.CubeObjects[0].ThumbnailId, {x: this.x, y: this.y, z:this.z});
            this.threeObject.userData = { x: this.x, y: this.y, z:this.z, size: this.CubeObjects.length, cubeObjects: this.CubeObjects };
            //this.ToggleSwitchingImagesEveryXms(10000);
        }
        else{
            this.threeObject = null;
        }
    }

    ToggleSwitchingImagesEveryXms(miliseconds: number){
        setInterval(() => {
            this.imageIndex++;
            let nextImage = this.imageIndex % this.CubeObjects.length;
            this.threeObject!.material = new THREE.MeshBasicMaterial({
                map : this.textureLoader.load(Fetcher.baseUrl + "/thumbnail/" + 
                    this.CubeObjects[nextImage].ThumbnailId)
            });
            //Do something each 'miliseconds' seconds  
        }, miliseconds);
    }

    private CreateCubeMesh(){
        THREE.Cache.enabled = true;
        let imageMaterial = new THREE.MeshBasicMaterial({
            map : ImageTextureLoader.Load(Fetcher.baseUrl + "/thumbnail/" + this.CubeObjects[0].ThumbnailId)
        });
        //Make box geometry:
        let boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        //Create mesh:
        let boxMesh = new THREE.Mesh( boxGeometry, imageMaterial );
        //Position in (x,y,z):
        boxMesh.position.x = this.x;
        boxMesh.position.y = this.y;
        boxMesh.position.z = this.z;
        //Tooltip:
        boxMesh.userData.tooltipText = this.CubeObjects.length + " photos.";
        //Add to scene:
        this.scene.add( boxMesh );
        return boxMesh;
    }

    RemoveFromScene(){
        if(this.threeObject != null) this.scene.remove(this.threeObject);
    }
}