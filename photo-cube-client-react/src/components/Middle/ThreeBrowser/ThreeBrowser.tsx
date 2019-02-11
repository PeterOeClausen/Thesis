import * as React from 'react';
import * as THREE from 'three';
import Position from './Position';
import '../../../css/ThreeBrowser.css';
import ThreeBrowserController from '../ThreeBrowserController';
import stockImage from '../../../images/download.jpg';
import helveticaRegular from '../../../fonts/helvetiker_regular.typeface.json';
import Axis, {AxisTypeEnum} from './Axis';
import Cell from './Cell';
import Fetcher from './Fetcher';
import Tag from './Tag';

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
class ThreeBrowser extends React.Component{
   
    state: React.ComponentState = {
        xAxis: null,
        yAxis: null,
        zAxis: null,

        //X-AxisData:
        xAxisHasDimension: false,
        xAxisLabelThreeObjects: [],

        //Cube data:
        cubeObjects: [],
    }

    mount: HTMLDivElement|null = this.mount!;
    //ADD SCENE
    scene: THREE.Scene = new THREE.Scene();
    camera: any;
    renderer: any;
    controls: any;
    textureLoader: any;
    textMeshes: any;
    textLoader: any;
    frameId: any;
    
    Colors = {
        red: 0xF00000,
        green: 0x00F000,
        blue: 0x0000F0
    }

    constructor(props: any){
        super(props);
        this.textMeshes = []
    }
    
    componentDidMount(){

        //Get temporary width and height
        let width = this.mount!.clientWidth
        let height = this.mount!.clientHeight

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
        this.mount!.appendChild(this.renderer.domElement)
        
        //SET CONTROLS TO ORBITCONTROL
        this.controls = new OrbitControls( this.camera, this.renderer.domElement);

        //START ANIMATION
        this.start()

        //CREATE IMAGETEXTURELOADER:
        this.textureLoader = new THREE.TextureLoader();
        this.textureLoader.crossOrigin = true;

        //CREATE TEXTLOADERS:
        
        this.textLoader = new THREE.FontLoader();

        //Filling out available space:
        this.resizeBrowser();
        window.addEventListener("resize", (event) => this.resizeBrowser());

        //XYZ-AXIS:
        //Creating X-Axis:
        let newXAxis = new Axis("X", AxisTypeEnum.Tagset);
        newXAxis.TitleThreeObject = this.addText("X", {x:5,y:0,z:0}, new THREE.Color(0xF00000), 0.5);
        newXAxis.LineThreeObject = this.addLine({x:0,y:0,z:0}, {x:5,y:0,z:0}, new THREE.Color(0xF00000));
        this.setState( {xAxis: newXAxis} );
        //Creating Y-Axis:
        let newYAxis = new Axis("Y", AxisTypeEnum.Tagset);  
        newYAxis.TitleThreeObject = this.addText("Y", {x:0,y:5,z:0}, new THREE.Color(0x00F000), 0.5);
        newYAxis.LineThreeObject = this.addLine({x:0,y:0,z:0}, {x:0,y:5,z:0}, new THREE.Color(0x00F000));
        this.setState( {yAxis: newYAxis} );
        //Creating Z-Axis:
        let newZAxis = new Axis("Z", AxisTypeEnum.Tagset);
        newZAxis.TitleThreeObject = this.addText("Z", {x:0,y:0,z:5}, new THREE.Color(0x0000F0), 0.5);
        newZAxis.LineThreeObject = this.addLine({x:0,y:0,z:0}, {x:0,y:0,z:5}, new THREE.Color(0x0000F0));
        this.setState( {zAxis: newZAxis} );

        //ADDING EXAMPLE SCENE:
        //this.showExampleScene1();

        //this.addCube(stockImage, { x:1, y:1, z:1 } );
        //this.addCube("https://localhost:44317/api/thumbnail/1", { x:1, y:1, z:1 } );
    }

    componentWillUnmount(){
        this.stop()
        this.mount!.removeChild(this.renderer.domElement)
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
        this.textMeshes.forEach((t:THREE.Mesh) => t.lookAt( this.camera.position ) );
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
        const browserElement: HTMLElement = document.getElementById('ThreeBrowser')!;
        var width = browserElement.clientWidth;
        var height = browserElement.clientHeight;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    handleKeyPress = (event: any) => {
        console.log(event);
        if(event.key === 'Enter'){
          console.log('enter press here! ')
        }
    }

    /* Add cubes to scene with given imageURL and a position */
    addCube(imageUrl: string, aPosition: Position) {
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
    addLine(fromPosition: Position, toPosition: Position, aColor:any) {
        var lineMaterial = new THREE.LineBasicMaterial( { color: aColor } );
        var lineGeometry = new THREE.Geometry();
        var from = new THREE.Vector3(fromPosition.x,fromPosition.y,fromPosition.z);
        var to = new THREE.Vector3(toPosition.x, toPosition.y, toPosition.z);
        lineGeometry.vertices.push( from );
        lineGeometry.vertices.push( to );
        var lineMesh = new THREE.Line( lineGeometry, lineMaterial );
        this.scene.add( lineMesh );
        return lineMesh;
    }

    /* Add some text with a color located on x, y, z */
    addText(someText: string, aPosition:Position, aColor:THREE.Color, aSize:number){
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
        textMesh.position.x = aPosition.x;
        textMesh.position.y = aPosition.y;
        textMesh.position.z = aPosition.z;
        this.textMeshes.push(textMesh);
        this.scene.add( textMesh );
        return textMesh; //Returns ThreeObject
    }

    /* Example scene: */
    /*
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
    }*/
        
    fetchDataAndUpdateDimensionWithTagset(dimName:string, dimension:any){
        fetch("https://localhost:44317/api/" + dimension.type + "/" + dimension.id)
        .then(result => {return result.json();})
        .then(tagset => {
            //data.((r) => console.log(r))
            this.updateDimension(dimName, tagset);
        });
    }

    //TODO: Rewrite to make shorter.
    updateDimension(dimName:string, tagset:any){
        //Sort tags alphabethically:
        tagset.Tags.sort((a:Tag,b:Tag) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0);

        const offsetFromCenter = 1;
        switch(dimName){
            case "X":
                //Add new labels to scene and state:
                let newXLabelObjectsAndTags = [];
                for(let i = 0; i < tagset.Tags.length; i++){
                    newXLabelObjectsAndTags.push({ 
                        object: this.addText(tagset.Tags[i].Name, {x:i + offsetFromCenter,y:0,z:0}, new THREE.Color(this.Colors.red), 0.1),
                        tagInfo: tagset.Tags[i] 
                    });
                }
                //Fetch old state:
                let newXAxis:Axis = this.state.xAxis;
                newXAxis.SetAxisType(AxisTypeEnum.Tagset);

                //Remove objects from scene:
                newXAxis.RemoveObjectsFromScene(this.scene);
                
                //Update values:
                newXAxis.LabelThreeObjectsAndTags = newXLabelObjectsAndTags;
                newXAxis.TitleString = tagset.Name;
                
                //Add objects to scene and values:
                newXAxis.TitleThreeObject = this.addText(tagset.Name, {x:tagset.Tags.length + offsetFromCenter,y:0,z:0}, new THREE.Color(this.Colors.red), 0.5);
                newXAxis.LineThreeObject = this.addLine({x:0,y:0,z:0}, {x:newXAxis.LabelThreeObjectsAndTags.length,y:0,z:0}, this.Colors.red);
                
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
                        object: this.addText(tagset.Tags[i].Name, {x:0,y:i + offsetFromCenter,z:0}, new THREE.Color(this.Colors.green), 0.1),
                        tagInfo: tagset.Tags[i] 
                    });
                }
                //Fetch old state:
                let newYAxis: Axis = this.state.yAxis;

                //Set axis type:
                newYAxis.SetAxisType(AxisTypeEnum.Tagset);
                
                //Remove objects from scene:
                newYAxis.LabelThreeObjectsAndTags.forEach((labelObject:any) => this.scene.remove(labelObject.object));
                this.scene.remove(newYAxis.TitleThreeObject);
                this.scene.remove(newYAxis.LineThreeObject);
                
                //Update values:
                newYAxis.LabelThreeObjectsAndTags = newYLabelObjectsAndTags;
                newYAxis.TitleString = tagset.Name;
                
                //Add objects to scene and values:
                newYAxis.TitleThreeObject = this.addText(tagset.Name, {x:0,y:tagset.Tags.length + offsetFromCenter,z:0}, new THREE.Color(this.Colors.green), 0.5);
                newYAxis.LineThreeObject = this.addLine({x:0,y:0,z:0}, {x:0,y:newYAxis.LabelThreeObjectsAndTags.length,z:0}, this.Colors.green);
                
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
                        object: this.addText(tagset.Tags[i].Name, {x:0,y:0,z:i + offsetFromCenter}, new THREE.Color(this.Colors.blue), 0.1),
                        tagInfo: tagset.Tags[i] 
                    });
                }
                //Fetch old state:
                let newZAxis = this.state.zAxis;
                newZAxis.AxisType = AxisTypeEnum.Tagset;
                
                //Remove objects from scene:
                newZAxis.LabelThreeObjectsAndTags.forEach((labelObject:any) => this.scene.remove(labelObject.object));
                this.scene.remove(newZAxis.TitleThreeObject);
                this.scene.remove(newZAxis.LineThreeObject);
                
                //Update values:
                newZAxis.LabelThreeObjectsAndTags = newZLabelObjectsAndTags;
                newZAxis.TitleString = tagset.Name;
                
                //Add objects to scene and values:
                newZAxis.TitleThreeObject = this.addText(tagset.Name, {x:0,y:0,z:tagset.Tags.length + offsetFromCenter}, new THREE.Color(this.Colors.blue), 0.5);
                newZAxis.LineThreeObject = this.addLine({x:0,y:0,z:0}, {x:0,y:0,z:newZAxis.LabelThreeObjectsAndTags.length}, this.Colors.blue);
                
                //Update zAxis in state:
                this.setState( {zAxis: newZAxis} );

                //Rewrite:
                this.setState( {zAxisHasDimension: true} );
            break;
        }
        
        this.fetchAndAddCubeObjects();
    }

    async fetchAndAddCubeObjects(){
        let NewCellsAndCoordinates = [];

        //Removing previous cube objects from scene:
        this.state.cubeObjects.forEach((co:THREE.Mesh) => this.scene.remove(co));

        let newCubeObjectArray: THREE.Mesh[] = [];
        let addCubeCallback = (imageUrl:string, aPosition:Position) => newCubeObjectArray.push(this.addCube(imageUrl, aPosition));
        let result = await Fetcher.FetchCubeObjectsFromAxis(this.state.xAxis, addCubeCallback);
        this.setState({cubeObjects: newCubeObjectArray});

        /*
        result.forEach(elem => {
            console.log("Hello?");
            console.log(elem);
            if(elem.cubeObjectArr.length > 0){
                this.addCube("https://localhost:44317/api/thumbnail/" + elem.cubeObjectArr[0].ThumbnailId ,
                    {x:elem.coordinate, y:1, z:0});
            }
        });
        console.log("Done!");
        */

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
        
export default ThreeBrowser;