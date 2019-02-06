import React, { Component } from 'react';
import '../../../css/ThreeBrowser.css';
import ThreeBrowserController from '../ThreeBrowserController';
import stockImage from '../../../images/download.jpg';
import helveticaRegular from '../../../fonts/helvetiker_regular.typeface.json';
import Axis, {AxisTypeEnum} from './Axis';
import Cell from './Cell';
import Fetcher from './Fetcher';

const THREE = require('three');
const OrbitControls = require('three-orbitcontrols')

/*
 TODO: 
- Add own Threejs code (Done except for key presses)
- Continue with tutorial: https://reactjs.org/tutorial/tutorial.html#completing-the-game
*/

/**
 * The ThreeBrowser Component is the browsing component used to browse photos in 3D.
 * 
 * The ThreeBrowser uses the three.js library for 3D rendering: https://threejs.org/
 */
class ThreeBrowser extends Component{
    
    state = {
        xAxis: null,
        yAxis: null,
        zAxis: null,

        //X-AxisData:
        xAxisHasDimension: false,
        xAxisLabelThreeObjects: [],

        //Cube data:
        cubeObjects: [],
    }

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
        
        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        //this.renderer.setClearColor('#000000') //Black clear color, default white.
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

        //Filling out available space:
        this.resizeBrowser();
        window.addEventListener("resize", (event) => this.resizeBrowser());

        //XYZ-AXIS:
        //Creating X-Axis:
        let newXAxis = new Axis("X", AxisTypeEnum.Tagset);
        newXAxis.TitleThreeObject = this.addText("X", 5,0,0, Colors.red, 0.5);
        newXAxis.LineThreeObject = this.addLine(0,0,0, 5,0,0, Colors.red);
        this.setState( {xAxis: newXAxis} );
        //Creating Y-Axis:
        let newYAxis = new Axis("Y", AxisTypeEnum.Tagset);
        newYAxis.TitleThreeObject = this.addText("y", 0,5,0, Colors.green, 0.5);
        newYAxis.LineThreeObject = this.addLine(0,0,0, 0,5,0, Colors.green);
        this.setState( {yAxis: newYAxis} );
        //Creating Z-Axis:
        let newZAxis = new Axis("Z", AxisTypeEnum.Tagset);
        newZAxis.TitleThreeObject = this.addText("z", 0,0,5, Colors.blue, 0.5);
        newZAxis.LineThreeObject = this.addLine(0,0,0, 0,0,5, Colors.blue);
        this.setState( {zAxis: newZAxis} );

        //ADDING EXAMPLE SCENE:
        //this.showExampleScene1();

        //this.addCube(stockImage, { x:1, y:1, z:1 } );
        //this.addCube("https://localhost:44317/api/thumbnail/1", { x:1, y:1, z:1 } );
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
        console.log(event);
        if(event.key === 'Enter'){
          console.log('enter press here! ')
        }
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
    addLine(fromX, fromY, fromZ, toX, toY, toZ, aColor) {
        var lineMaterial = new THREE.LineBasicMaterial( { color: aColor } );
        var lineGeometry = new THREE.Geometry();
        var from = new THREE.Vector3(fromX,fromY,fromZ);
        var to = new THREE.Vector3(toX,toY,toZ);
        lineGeometry.vertices.push( from );
        lineGeometry.vertices.push( to );
        var lineMesh = new THREE.Line( lineGeometry, lineMaterial );
        this.scene.add( lineMesh );
        return lineMesh;
    }

    /* Add some text with a color located on x, y, z */
    addText(someText, xPos, yPos, zPos, aColor, aSize){
        var loader = new THREE.FontLoader();
        var font = loader.parse(helveticaRegular);
        var textGeometry = new THREE.TextGeometry( someText, {
            font: font,
            size: aSize,
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
        return textMesh; //Returns ThreeObject
    }

    /* Example scene: */
    showExampleScene1(){
        //Examples of inserting text:
        this.addText("1", 1, 0, 0, Colors.red );
        this.addText("2", 2, 0, 0, Colors.red );
        this.addText("3", 3, 0, 0, Colors.red );
        this.addText("1", 0, 1, 0, Colors.green );
        this.addText("2", 0, 2, 0, Colors.green );
        this.addText("3", 0, 3, 0, Colors.green );
        this.addText("1", 0, 0, 1, Colors.blue );
        this.addText("2", 0, 0, 2, Colors.blue );
        this.addText("3", 0, 0, 3, Colors.blue );

        //Add an image at pos 2,2,2
        this.addCube(stockImage, { x:2, y:2, z:2 } );
    }
        
    fetchDataAndUpdateDimensionWithTagset(dimName, dimension){
        fetch("https://localhost:44317/api/" + dimension.type + "/" + dimension.id)
        .then(result => {return result.json();})
        .then(tagset => {
            //data.((r) => console.log(r))
            this.updateDimension(dimName, tagset);
        });
        
    }

    //TODO: Rewrite to make shorter.
    updateDimension(dimName, tagset){
        //Sort tags alphabethically:
        tagset.Tags.sort((a,b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0);

        const offsetFromCenter = 1;
        switch(dimName){
            case "X":
                //Add new labels to scene and state:
                let newXLabelObjectsAndTags = [];
                for(let i = 0; i < tagset.Tags.length; i++){
                    newXLabelObjectsAndTags.push({ 
                        object: this.addText(tagset.Tags[i].Name, i + offsetFromCenter,0,0, Colors.red, 0.1),
                        tagInfo: tagset.Tags[i] 
                    });
                }
                //Fetch old state:
                let newXAxis = this.state.xAxis;
                newXAxis.AxisType = AxisTypeEnum.Tagset;

                //Remove objects from scene:
                newXAxis.LabelThreeObjectsAndTags.forEach(labelObject => this.scene.remove(labelObject.object));
                this.scene.remove(newXAxis.TitleThreeObject);
                this.scene.remove(newXAxis.LineThreeObject);
                
                //Update values:
                newXAxis.LabelThreeObjectsAndTags = newXLabelObjectsAndTags;
                newXAxis.TitleString = tagset.Name;
                
                //Add objects to scene and values:
                newXAxis.TitleThreeObject = this.addText(tagset.Name, tagset.Tags.length + offsetFromCenter,0,0, Colors.red, 0.5);
                newXAxis.LineThreeObject = this.addLine(0,0,0, newXAxis.LabelThreeObjectsAndTags.length,0,0, Colors.red);
                
                //Update xAxis in state:
                this.setState( {xAxis: newXAxis} );

                //Rewrite:
                this.setState( {xAxisHasDimension: true} );
            break;
            case "Y":
                //Add new labels to scene and state:
                let newYLabelObjectsAndTags = [];
                for(let i = 0; i < tagset.Tags.length; i++){
                    newYLabelObjectsAndTags.push({ 
                        object: this.addText(tagset.Tags[i].Name, 0,i + offsetFromCenter,0, Colors.green, 0.1),
                        tagInfo: tagset.Tags[i] 
                    });
                }
                //Fetch old state:
                let newYAxis = this.state.yAxis;
                newYAxis.AxisType = AxisTypeEnum.Tagset;
                
                //Remove objects from scene:
                newYAxis.LabelThreeObjectsAndTags.forEach(labelObject => this.scene.remove(labelObject.object));
                this.scene.remove(newYAxis.TitleThreeObject);
                this.scene.remove(newYAxis.LineThreeObject);
                
                //Update values:
                newYAxis.LabelThreeObjectsAndTags = newYLabelObjectsAndTags;
                newYAxis.TitleString = tagset.Name;
                
                //Add objects to scene and values:
                newYAxis.TitleThreeObject = this.addText(tagset.Name, 0,tagset.Tags.length + offsetFromCenter,0, Colors.green, 0.5);
                newYAxis.LineThreeObject = this.addLine(0,0,0, 0,newYAxis.LabelThreeObjectsAndTags.length,0, Colors.green);
                
                //Update yAxis in state:
                this.setState( {yAxis: newYAxis} );

                //Rewrite:
                this.setState( {yAxisHasDimension: true} );
            break;
            case "Z":
                //Add new labels to scene and state:
                let newZLabelObjectsAndTags = [];
                for(let i = 0; i < tagset.Tags.length; i++){
                    newZLabelObjectsAndTags.push({ 
                        object: this.addText(tagset.Tags[i].Name, 0,0,i + offsetFromCenter, Colors.blue, 0.1),
                        tagInfo: tagset.Tags[i] 
                    });
                }
                //Fetch old state:
                let newZAxis = this.state.zAxis;
                newZAxis.AxisType = AxisTypeEnum.Tagset;
                
                //Remove objects from scene:
                newZAxis.LabelThreeObjectsAndTags.forEach(labelObject => this.scene.remove(labelObject.object));
                this.scene.remove(newZAxis.TitleThreeObject);
                this.scene.remove(newZAxis.LineThreeObject);
                
                //Update values:
                newZAxis.LabelThreeObjectsAndTags = newZLabelObjectsAndTags;
                newZAxis.TitleString = tagset.Name;
                
                //Add objects to scene and values:
                newZAxis.TitleThreeObject = this.addText(tagset.Name, 0,0,tagset.Tags.length + offsetFromCenter, Colors.blue, 0.5);
                newZAxis.LineThreeObject = this.addLine(0,0,0, 0,0,newZAxis.LabelThreeObjectsAndTags.length, Colors.blue);
                
                //Update zAxis in state:
                this.setState( {zAxis: newZAxis} );

                //Rewrite:
                this.setState( {zAxisHasDimension: true} );
            break;
        }
        
        this.fetchAndAddCubeObjects();
    }

    fetchAndAddCubeObjects(){
        let NewCellsAndCoordinates = [];

        let addCubeCallback = (imageUrl, aPosition) => this.addCube(imageUrl, aPosition);

        

        let result = Fetcher.FetchCubeObjectsFromAxis(this.state.xAxis, addCubeCallback);

        result.forEach(elem => {
            console.log("Hello?");
            console.log(elem);
            if(elem.cubeObjectArr.length > 0){
                this.addCube("https://localhost:44317/api/thumbnail/" + elem.cubeObjectArr[0].ThumbnailId ,
                    {x:elem.coordinate, y:1, z:0});
            }
        });
        console.log("Done!");

        /*
        //Make cells:
        for(let i = 0; i < this.state.xAxis.LabelThreeObjectsAndTags.length; i++){
            let newCell = new Cell(i, 0, 0);
            
            fetch("https://localhost:44317/api/cubeobject/FromTagId/" + this.state.xAxis.LabelThreeObjectsAndTags[i].tagInfo.Id)
            .then(result => {return result.json();})
            .then(cubeObjectDataArray =>{
                newCell.cubeObjectData = cubeObjectDataArray;
                //console.log(this.state.xAxis.LabelThreeObjectsAndTags[i].tagInfo);
                //console.log(cubeObjectDataArray);
                //cubeObjectDataArray.forEach(cubeObject => console.log(cubeObject))
            });

            NewCellsAndCoordinates.push(newCell);

            for(let j = 0; j < this.state.yAxis.length; j++){
                for(let k = 0; k < this.state.zAxis.length; k++){
                    
                    
                }
            }  
        }
        */

        /*
        //Remove previous cube objects:
        this.state.cubeObjects.forEach(co => this.scene.remove(co));
        let newCubeObjects = [];
        if(this.state.xAxisHasDimension){
            for(let i = 0; i < this.state.xAxisLabelThreeObjects.length; i++){
                fetch("https://localhost:44317/api/cubeobject/FromTagId/" + this.state.xAxisLabelThreeObjects[i].tagInfo.Id)
                .then(result => {return result.json();})
                .then(cubeObjectArray => {
                    //data.((r) => console.log(r))
                    //this.updateDimension(dimName, tagset);
                    cubeObjectArray.forEach(co => newCubeObjects.push(co));
                });
            }
        }
        this.setState( {cubeObjects: newCubeObjects} );
        console.log(this.state.cubeObjects);
        */
    }
}

//CREATE COLORS:
const Colors = {
    red: 0xF00000,
    green: 0x00F000,
    blue: 0x0000F0
}
        
export default ThreeBrowser;