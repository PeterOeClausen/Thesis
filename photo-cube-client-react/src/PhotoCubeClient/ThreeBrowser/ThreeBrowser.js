import React, { Component } from 'react';
import './ThreeBrowser.css';
import stockImage from './../../images/download.jpg';
import helveticaRegular from './../../fonts/helvetiker_regular.typeface.json';

const THREE = require('three');
const OrbitControls = require('three-orbitcontrols')

/*
 TODO: 
- Add own Threejs code (Done except for key presses)
- Continue with tutorial: https://reactjs.org/tutorial/tutorial.html#completing-the-game
*/

class ThreeBrowser extends Component{
    
    componentDidMount(){
        //Get tempirary width and height
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight

        //ADD SCENE
        this.scene = new THREE.Scene();

        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
            )
        this.camera.position.x = 5;
        this.camera.position.y = 5;
        this.camera.position.z = 5;
        
        this.camera.rotation.y = 90 * Math.PI;
        
        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        //this.renderer.setClearColor('#000000')
        this.renderer.setSize(width, height)
        this.mount.appendChild(this.renderer.domElement)
        
        //SET CONTROLS TO ORBITCONTROL
        this.controls = new OrbitControls( this.camera, this.renderer.domElement);

        //START ANIMATION
        this.start()

        //CREATE IMAGETEXTURELOADER:
        this.textureLoader = new THREE.TextureLoader();
        this.textureLoader.crossOrigin = true;

        //CREATE TEXTLOADERS:
        this.textMeshes = [];
        this.textLoader = new THREE.FontLoader();

        //ADDING X, Y, Z AXIS:
        this.xAxis = this.addLine(new THREE.Vector3(0,0,0), new THREE.Vector3(5,0,0), Colors.red); //x is red
        this.yAxis = this.addLine(new THREE.Vector3(0,0,0), new THREE.Vector3(0,5,0), Colors.green); //y is green
        this.zAxis = this.addLine(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,5), Colors.blue); //z is blue

        //ADDING EXAMPLE SCENE:
        //this.showExampleScene1();

        //Filling out available space:
        this.resizeBrowser();
        window.addEventListener("resize", (event) => this.resizeBrowser());
    }

    /* Add cubes to scene with given imageURL and a position */
    addCube(imageUrl, aPosition) {
        //Load image as material:
        var imageMaterial = new THREE.MeshBasicMaterial({
            map : this.textureLoader.load(imageUrl)
        });
        //Make box geometry:
        var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        //Create mesh:
        var boxMesh = new THREE.Mesh( boxGeometry, imageMaterial );
        //Position in (x,y,z):
        boxMesh.position.x = aPosition.x;
        boxMesh.position.y = aPosition.y;
        boxMesh.position.z = aPosition.z;
        //Add to scene:
        this.scene.add( boxMesh );
        return boxMesh;
    }

    /* Add a line from THREE.Vector3(x,y,z) to THREE.Vector3(x,y,z) with a given color */
    addLine(from, to, aColor) {
        var lineMaterial = new THREE.LineBasicMaterial( { color: aColor } );
        var lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push( from );
        lineGeometry.vertices.push( to );
        var lineMesh = new THREE.Line( lineGeometry, lineMaterial );
        this.scene.add( lineMesh );
        return lineMesh;
    }

    /* Add some text with a color located on x, y, z */
    addText(someText, aColor, xPos, yPos, zPos){
        var loader = new THREE.FontLoader();
        var font = loader.parse(helveticaRegular);
        var textGeometry = new THREE.TextGeometry( someText, {
            font: font,
            size: 0.5,
            height: 0.1,
            curveSegments: 20
        } );
        var textMaterial = new THREE.MeshBasicMaterial( { color: aColor } );
        var textMesh = new THREE.Mesh( textGeometry, textMaterial );
        textMesh.position.x = xPos;
        textMesh.position.y = yPos;
        textMesh.position.z = zPos;
        this.textMeshes.push(textMesh);
        this.scene.add( textMesh );
        return textMesh;
    }

    /* Example scene: */
    showExampleScene1(){
        //Examples of inserting text:
        this.addText("1", Colors.red, 1, 0, 0 );
        this.addText("2", Colors.red, 2, 0, 0 );
        this.addText("3", Colors.red, 3, 0, 0 );
        this.addText("1", Colors.green, 0, 1, 0 );
        this.addText("2", Colors.green, 0, 2, 0);
        this.addText("3", Colors.green, 0, 3, 0 );
        this.addText("1", Colors.blue, 0, 0, 1 );
        this.addText("2", Colors.blue, 0, 0, 2 );
        this.addText("3", Colors.blue, 0, 0, 3 );

        //Add an image at pos 2,2,2
        this.addCube(stockImage, { x:2, y:2, z:2 } );
    }
        
    componentWillUnmount(){
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }
        
    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }
        
    stop = () => {
        cancelAnimationFrame(this.frameId)
    }
        
    animate = () => {
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
        //Point text to camera:
        this.textMeshes.forEach(t => t.lookAt( this.camera.position ) );
    }

    render(){
        return(
            <div className="grid-item" id="ThreeBrowser">
                <div style={{ width: '400px', height: '400px' }}
                ref = {(mount) => { this.mount = mount }}/>
            </div>
        );
    }
        
    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    }

    resizeBrowser = () => {
        var width = document.getElementById('ThreeBrowser').clientWidth;
        var height = document.getElementById('ThreeBrowser').clientHeight;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            console.log('enter press here! ')
        }
    }
}

//CREATE COLORS:
const Colors = {
    red: 0xF00000,
    green: 0x00F000,
    blue: 0x0000F0
}
        
export default ThreeBrowser;