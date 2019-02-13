import * as THREE from 'three';

export default class ImageTextureLoader{
    static textureLoader: THREE.TextureLoader = new THREE.TextureLoader();

    static Load(url: string){
        return this.textureLoader.load(url);;
    }
}  