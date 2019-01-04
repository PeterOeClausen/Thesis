import React, { Component } from 'react';
import './ThreeBrowser.css';
/* Using tutorial to use ThreeJS with React: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
/* https://medium.com/@colesayershapiro/using-three-js-in-react-6cb71e87bdf4 */
const THREE = require('three');
const OrbitControls = require('three-orbitcontrols')

/*
 TODO: 
- Add own Threejs code
- Continue with tutorial: https://reactjs.org/tutorial/tutorial.html#completing-the-game
- 
*/

/*import './canvasThreejsCode.js';*/

class ThreeBrowser extends Component{
    componentDidMount(){
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
        this.camera.position.z = 5;
        this.camera.rotation.y = 90 * Math.PI;
        
        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        //this.renderer.setClearColor('#000000')
        this.renderer.setSize(width, height)
        this.mount.appendChild(this.renderer.domElement)
        
        //SET CONTROLS TO ORBITCONTROL
        this.controls = new OrbitControls( this.camera, this.renderer.domElement);

        //CREATE IMAGETEXTURELOADER:
        this.textureLoader = new THREE.TextureLoader();
        this.textureLoader.crossOrigin = true;

        //CREATE TEXTLOADERS:
        this.textMeshes = [];
        this.textLoader = new THREE.FontLoader();

        //CREATE COLORS:
        const red = 0xF00000;
        const green = 0x00F000;
        const blue = 0x0000F0;

        //ADDING X, Y, Z axis:
        this.xAxis = this.addLine(new THREE.Vector3(0,0,0), new THREE.Vector3(5,0,0), red); //x is red
        this.yAxis = this.addLine(new THREE.Vector3(0,0,0), new THREE.Vector3(0,5,0), green); //y is green
        this.zAxis = this.addLine(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,5), blue); //z is blue

        

        //ADD CUBE
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: '#433F81'     })
        this.cube = new THREE.Mesh(geometry, material)
        this.scene.add(this.cube)
        this.start()
        
        //this.showExampleScene1();

        //Filling out available space:
        this.resizeBrowser();
        window.addEventListener("resize", (event) => this.resizeBrowser());
    }

    addCube(imageUrl, aPosition) {
        //Load image as material:
        var anImageMaterial = new THREE.MeshBasicMaterial({
            map : this.textureLoader.load(imageUrl)
        });
        //Make box geometry:
        var box = new THREE.BoxGeometry( 1, 1, 1 );
        //Create mesh:
        var cube = new THREE.Mesh( box, anImageMaterial );
        //Position in (x,y,z):
        cube.position.x = aPosition.x;
        cube.position.y = aPosition.y;
        cube.position.z = aPosition.z;
        //Add to scene:
        this.scene.add( cube );
        return cube;
    }

    addLine(from, to, _color) {
        var aLineMaterial = new THREE.LineBasicMaterial( { color: _color } );
        var aline = new THREE.Geometry();
        aline.vertices.push( from );
        aline.vertices.push( to );
        var aline = new THREE.Line( aline, aLineMaterial );
        this.scene.add( aline );
        return aline;
    }

    addText(someText, aColor, aPosition){
        
        this.textLoader.load( 'qwe', function ( font ) {
            //Define text geometry:
            var textGeo = new THREE.TextGeometry( 
                someText, 
                {
                    font: font,
                    size: 0.2,  //height
                    height: 0.1 //depth
                    //curveSegments: 1,
                    //bevelThickness: 1,
                    //bevelSize: 1
                    //bevelEnabled: true
                } );
            //Define the material:
            var textMaterial = new THREE.MeshBasicMaterial( { color: aColor } );
            //Create the text mesh:
            var text = new THREE.Mesh( textGeo, textMaterial );
            //Position the text:
            text.position.set( aPosition.x, aPosition.y, aPosition.z );
            //Add text to collection that get updated to look at camera
            this.textMeshes.push(text);
            //Add text to scene:
            this.scene.add( text );
        } );
    }

    showExampleScene1(){
        //Examples of inserting text:
        this.addText("1", this.green, { x: 0, y: 1, z: 0 } );
        this.addText("2", this.green, { x: 0, y: 2, z: 0 } );
        this.addText("3", this.green, { x: 0, y: 3, z: 0 } );

        this.addText("1", this.red, { x: 1, y: 0, z: 0 } );
        this.addText("2", this.red, { x: 2, y: 0, z: 0 } );
        this.addText("3", this.red, { x: 3, y: 0, z: 0 } );

        this.addText("1", this.blue, { x: 0, y: 0, z: 1 } );
        this.addText("2", this.blue, { x: 0, y: 0, z: 2 } );
        this.addText("3", this.blue, { x: 0, y: 0, z: 3 } );
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
        this.cube.rotation.x += 0.01
        this.cube.rotation.y += 0.01
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }
        
    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    }

    resizeBrowser = () => {
        console.log("Browser resize!");
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
        
    render(){
        return(
            <div className="grid-item" id="ThreeBrowser">
                <div style={{ width: '400px', height: '400px' }}
                ref = {(mount) => { this.mount = mount }}/>
            </div>
        );
    }
}
        
export default ThreeBrowser;