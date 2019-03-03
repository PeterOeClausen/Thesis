import * as React from 'react';
import * as THREE from 'three';
import Position from './Position';
import '../../../css/ThreeBrowser.css';
import stockImage from '../../../images/download.jpg';
import helveticaRegular from '../../../fonts/helvetiker_regular.typeface.json';
import Axis, {AxisTypeEnum, AxisDirection, ObjectTagPair} from './Axis';
import Cell from './Cell';
import Fetcher from './Fetcher';
import Tag from './Tag';
import Hierarchy from './Hierarchy';
import Tagset from './Tagset';
import HierarchyNode from './HierarchyNode';
import { Raycaster } from 'three';
import CubeObject from './CubeObject';
import ICell from './Cell';
import { BrowsingState } from './BrowsingState';

const OrbitControls = require('three-orbitcontrols')

/*
 TODO:
- Continue with tutorial: https://reactjs.org/tutorial/tutorial.html#completing-the-game
*/

/**
 * The ThreeBrowser Component is the browsing component used to browse photos in 3D.
 * The ThreeBrowser uses the three.js library for 3D rendering: https://threejs.org/
 */
class ThreeBrowser extends React.Component<{onFileCountChanged: (fileCount: number) => void}>{

    //TODO: Add progressbar
    render(){
        /*
        let cssClasses: string = "";
        if(this.state.showTooltip){
            cssClasses += "showTooltip";
        }else{
            cssClasses += "hideTooltip";
        }
        */
        return(
            <div className="grid-item" id="ThreeBrowser">
                <div style={{ width: '400px', height: '400px' }} ref = {(mount) => { this.mount = mount }}/>
                <p style={{}}>tooltip!</p>
            </div>
        );
    }

    mount: HTMLDivElement|null = this.mount!;
    //ADD SCENE
    scene: THREE.Scene = new THREE.Scene();
    camera: any;    //Set in componentDidMount
    controls: any;  //Set in componentDidMount
    font:any;
    frameId: number = 0;
    renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
    textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
    textMeshes: THREE.Mesh[] = [];
    textLoader: any = new THREE.FontLoader();
    //Raycaster used for detecting mouse over:
    raycaster: Raycaster = new Raycaster();
    //This will be 2D coordinates of the current mouse position, [0,0] is middle of the screen:
    mouse = new THREE.Vector2();

    //Browsing state:
    //Cells:
    cells: Cell[] = [];
    //The three axis:
    xAxis: Axis = new Axis();
    yAxis: Axis = new Axis();
    zAxis: Axis = new Axis();

    Colors = {
        red: 0xF00000,
        green: 0x00F000,
        blue: 0x0000F0
    }

    constructor(props: any){
        super(props);
        this.xAxis.TitleString = "X";
        this.yAxis.TitleString = "Y";
        this.zAxis.TitleString = "Z";
    }
    
    componentDidMount(){
        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.mount!.clientWidth / this.mount!.clientHeight,
            0.1,
            1000
        );
        this.camera.position.x = 5;
        this.camera.position.y = 5;
        this.camera.position.z = 5;
        
        //this.renderer.setClearColor('#000000') //Black clear color, default white.
        this.renderer.setSize(this.mount!.clientWidth, this.mount!.clientHeight)
        
        //Add rendered scene to DOM:
        this.mount!.appendChild(this.renderer.domElement)
        
        //SET CONTROLS TO ORBITCONTROL
        this.controls = new OrbitControls( this.camera, this.renderer.domElement);

        //Load font:
        this.font = this.textLoader.parse(helveticaRegular);
        
        //Filling out available space:
        this.resizeBrowser();

        //Resize canvas when resizing window:
        window.addEventListener("resize", this.resizeBrowser);
        //Add keydown handler:
        document.addEventListener('keydown', this.handleKeyPress);
        //Mouse move tooltip:
        this.mount!.addEventListener('mousemove', this.onMouseMove);

        this.createInitialScene();

        //START ANIMATION
        this.start();

        /*
        THREE.DefaultLoadingManager.onProgress = (item:any, loaded: number, total: number) => {
            console.log(item);
            console.log((loaded / total * 100));
        };
        */
    }

    createInitialScene(){
        //XYZ-AXIS:
        //Creating X-Axis:
        this.ClearXAxis();

        //Creating Y-Axis:
        this.ClearYAxis();
        
        //Creating Z-Axis:
        this.ClearZAxis();
    }

    ClearXAxis(){
        this.xAxis.RemoveObjectsFromScene(this.scene);
        let newXAxis = new Axis();
        newXAxis.AxisDirection = AxisDirection.X;
        newXAxis.TitleString = "X";
        newXAxis.TitleThreeObject = this.addText("X", {x:2,y:0,z:0}, new THREE.Color(0xF00000), 0.5);
        newXAxis.LineThreeObject = this.addLine({x:0,y:0,z:0}, {x:2,y:0,z:0}, new THREE.Color(0xF00000));
        this.xAxis = newXAxis;
        this.computeCells();
    }

    ClearYAxis(){
        this.yAxis.RemoveObjectsFromScene(this.scene);
        let newYAxis = new Axis();
        newYAxis.AxisDirection = AxisDirection.Y;
        newYAxis.TitleString = "Y";
        newYAxis.TitleThreeObject = this.addText("Y", {x:0,y:2,z:0}, new THREE.Color(0x00F000), 0.5);
        newYAxis.LineThreeObject = this.addLine({x:0,y:0,z:0}, {x:0,y:2,z:0}, new THREE.Color(0x00F000));
        this.yAxis = newYAxis;
        this.computeCells();
    }

    ClearZAxis(){
        this.zAxis.RemoveObjectsFromScene(this.scene);
        let newZAxis = new Axis();
        newZAxis.AxisDirection = AxisDirection.Z;
        newZAxis.TitleString = "Z";
        newZAxis.TitleThreeObject = this.addText("Z", {x:0,y:0,z:2}, new THREE.Color(0x0000F0), 0.5);
        newZAxis.LineThreeObject = this.addLine({x:0,y:0,z:0}, {x:0,y:0,z:2}, new THREE.Color(0x0000F0));
        this.zAxis = newZAxis;
        this.computeCells();
    }

    componentWillUnmount(){
        this.stop()
        this.mount!.removeChild(this.renderer.domElement)
        this.unsubscribeToDocumentEvents();
    }

    unsubscribeToDocumentEvents(){
        document.removeEventListener('keydown', this.handleKeyPress);
        window.removeEventListener("resize", this.resizeBrowser);
        this.mount!.removeEventListener('mousemove', this.onMouseMove);
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
        
    renderScene = () => {
        this.renderer.render(this.scene, this.camera);
    }

    resizeBrowser = () => {
        let browserElement: HTMLElement = document.getElementById('ThreeBrowser')!;
        let width = browserElement.clientWidth;
        let height = browserElement.clientHeight;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    handleKeyPress = (event: KeyboardEvent) => {
        if(event.code === "Space"){
            //Move camera up in the y direction:
            this.camera.position.y += 0.1;
            this.controls.target.y += 0.1;
            this.controls.update();
        }
        else if(event.code === "ControlLeft"){
            //Move camera down in the y direction:
            this.camera.position.y -= 0.1;
            this.controls.target.y -= 0.1;
            this.controls.update();
        }
    }

    /* Add cubes to scene with given imageURL and a position */
    addCube(imageUrl: string, aPosition: Position) {
        //Load image as material:
        let imageMaterial = new THREE.MeshBasicMaterial({
            map : this.textureLoader.load(imageUrl)
        });
        //Make box geometry:
        let boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        //Create mesh:
        let boxMesh = new THREE.Mesh( boxGeometry, imageMaterial );
        //Position in (x,y,z):
        boxMesh.position.x = aPosition.x;
        boxMesh.position.y = aPosition.y;
        boxMesh.position.z = aPosition.z;
        //Add to scene:
        this.scene.add( boxMesh );
        return boxMesh;
    }

    addCubeCallback = (imageUrl: string, aPosition: Position) => {
        //Load image as material:
        let imageMaterial = new THREE.MeshBasicMaterial({
            map : this.textureLoader.load(imageUrl)
        });
        //Make box geometry:
        let boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        //Create mesh:
        let boxMesh = new THREE.Mesh( boxGeometry, imageMaterial );
        //Position in (x,y,z):
        boxMesh.position.x = aPosition.x;
        boxMesh.position.y = aPosition.y;
        boxMesh.position.z = aPosition.z;
        //Add to scene:
        this.scene.add( boxMesh );
        return boxMesh;
    }

    /* Add a line from THREE.Vector3(x,y,z) to THREE.Vector3(x,y,z) with a given color */
    addLine(fromPosition: Position, toPosition: Position, aColor:THREE.Color) {
        let lineMaterial = new THREE.LineBasicMaterial( { color: aColor } );
        let lineGeometry = new THREE.Geometry();
        let from = new THREE.Vector3(fromPosition.x,fromPosition.y,fromPosition.z);
        let to = new THREE.Vector3(toPosition.x, toPosition.y, toPosition.z);
        lineGeometry.vertices.push( from );
        lineGeometry.vertices.push( to );
        let lineMesh = new THREE.Line( lineGeometry, lineMaterial );
        this.scene.add( lineMesh );
        return lineMesh;
    }

    addLineCallback = (fromPosition: Position, toPosition: Position, aColor:THREE.Color) => {
        let lineMaterial = new THREE.LineBasicMaterial( { color: aColor } );
        let lineGeometry = new THREE.Geometry();
        let from = new THREE.Vector3(fromPosition.x,fromPosition.y,fromPosition.z);
        let to = new THREE.Vector3(toPosition.x, toPosition.y, toPosition.z);
        lineGeometry.vertices.push( from );
        lineGeometry.vertices.push( to );
        let lineMesh = new THREE.Line( lineGeometry, lineMaterial );
        this.scene.add( lineMesh );
        return lineMesh;
    }

    /* Add some text with a color located on x, y, z */
    addText(someText: string, aPosition:Position, aColor:THREE.Color, aSize:number){
        let textGeometry = new THREE.TextGeometry( someText, {
            font: this.font,
            size: aSize,
            height: 0.1,
            curveSegments: 20
        } );
        let textMaterial = new THREE.MeshBasicMaterial( { color: aColor } );
        let textMesh = new THREE.Mesh( textGeometry, textMaterial );
        textMesh.position.x = aPosition.x;
        textMesh.position.y = aPosition.y;
        textMesh.position.z = aPosition.z;
        this.textMeshes.push(textMesh);
        this.scene.add( textMesh );
        return textMesh; //Returns ThreeObject
    }

    addTextCallback = (someText: string, aPosition:Position, aColor:THREE.Color, aSize:number) => {
        let textGeometry = new THREE.TextGeometry( someText, {
            font: this.font,
            size: aSize,
            height: 0.1,
            curveSegments: 20
        } );
        let textMaterial = new THREE.MeshBasicMaterial( { color: aColor } );
        let textMesh = new THREE.Mesh( textGeometry, textMaterial );
        textMesh.position.x = aPosition.x;
        textMesh.position.y = aPosition.y;
        textMesh.position.z = aPosition.z;
        this.textMeshes.push(textMesh);
        this.scene.add( textMesh );
        return textMesh; //Returns ThreeObject
    }
        
    /**
     * Updates axis labels and then calls compute cells.
     * Called from outside of ThreeBrowser
     * @param dimName "X", "Y" or "Z"
     * @param dimension 
     */
    async updateAxis(dimName:string, dimension:any){
        let axis : Axis = new Axis();
        switch(dimName){
            case "X":
                this.xAxis.RemoveObjectsFromScene(this.scene);
                axis.AxisDirection = AxisDirection.X; //.AxisDirection = AxisDirection.X;
                break;
            case "Y":
                this.yAxis.RemoveObjectsFromScene(this.scene);
                axis.AxisDirection = AxisDirection.Y;
                break;
            case "Z":
                this.zAxis.RemoveObjectsFromScene(this.scene);
                axis.AxisDirection = AxisDirection.Z;
                break;
        }
        
        switch(dimension.type){
            case "hierarchy":
                let hierarchy: Hierarchy = await Fetcher.FetchHierarchy(dimension.id);
                let rootNode: HierarchyNode = await Fetcher.FetchNode(hierarchy.RootNodeId);
                /*
                let tags: (Tag)[] = rootNode.Children.map(n => {
                    n.Tag!.Name += "(h)"; //Appending (h)
                    return n.Tag!;
                });*/
                axis.TitleString = hierarchy.Name + " (hierarchy)";
                axis.AddHierarchy(rootNode, this.addTextCallback, this.addLineCallback);
                break;
            case "tagset":
                let tagset: Tagset = await Fetcher.FetchTagset(dimension.id);
                axis.TitleString = tagset.Name + " (tagset)";
                axis.AddTagset(tagset, this.addTextCallback, this.addLineCallback);
                break;
        }

        switch(dimName){
            case "X":
                this.xAxis = axis;
                break;
            case "Y":
                this.yAxis = axis;
                break;
            case "Z":
                this.zAxis = axis;
                break;
        }

        this.computeCells();
    }

    async computeCells(){
        //Remove previous cells:
        this.cells.forEach((cell: Cell) => cell.RemoveFromScene());

        //Fetch and add new cells:
        let xDefined : boolean = this.xAxis.TitleString != "X";
        let yDefined : boolean = this.yAxis.TitleString != "Y";
        let zDefined : boolean = this.zAxis.TitleString != "Z";

        let newCells: Cell[] = [];

        if(xDefined && yDefined && zDefined){   //X and Y and Z
            //Render all three axis
            //promise = this.fetchAndAddCubeObjectsForThreeAxis(this.xAxis, this.yAxis, this.zAxis);
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(this.xAxis, this.yAxis, this.zAxis);
            console.log(ICells);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textLoader, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(xDefined && yDefined){         //X and Y
            //promise = this.fetchAndAddCubeObjectsForTwoAxis(this.xAxis, this.yAxis);
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(this.xAxis, this.yAxis, null);
            console.log(ICells);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textLoader, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(xDefined && zDefined){         //X and Z
            //promise = this.fetchAndAddCubeObjectsForTwoAxis(this.xAxis, this.zAxis);
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(this.xAxis, null, this.zAxis);
            console.log(ICells);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textLoader, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(yDefined && zDefined){         //Y and Z
            //promise = this.fetchAndAddCubeObjectsForTwoAxis(this.yAxis, this.zAxis);
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(null, this.yAxis, this.zAxis);
            console.log(ICells);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textLoader, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(xDefined){                     //X
            //promise = this.fetchAndAddCubeObjectsForOneAxis(this.xAxis);
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(this.xAxis, null, null);
            console.log(ICells);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textLoader, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
            //TODO: Add cubes to UI.
        }else if(yDefined){                     //Y
            //promise = this.fetchAndAddCubeObjectsForOneAxis(this.yAxis);
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(null, this.yAxis, null);
            console.log(ICells);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textLoader, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(zDefined){                     //Z
            //promise = this.fetchAndAddCubeObjectsForOneAxis(this.zAxis);
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(null, null, this.zAxis);
            console.log(ICells);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textLoader, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }

        this.cells = newCells;

        //await promise!;
        console.log("Done computing cells")

        //Update filecount:
        let uniquePhotoIds: Set<number> = new Set();
        this.cells.forEach((cell: Cell) => 
            cell.CubeObjects.forEach(co => uniquePhotoIds.add(co.PhotoId)));
        this.props.onFileCountChanged(uniquePhotoIds.size);
    }

    /**
     * Recursively goes through the HierarchyNode tree and collects all the tags.
     * @param hn A hierarchy node to start from.
     */
    /*extractTagsFromHierarchyNode(hn: HierarchyNode): Tag[]{
        let tags: Tag[] = [hn.Tag];
        let childTags: Tag[] = hn.Children.flatMap(c => this.extractTagsFromHierarchyNode(c));
        return tags.concat(childTags);
    }*/

    /*async fetchAndAddCubeObjectsForOneAxis(axis: Axis){
        let cells: Cell[] = [];
        //Change promise if axis is of type hirarchy
        let promises = 
            axis.AxisType === AxisTypeEnum.Tagset ? 
                //If axis is tagset:
                axis.Tags.map(async (tag: Tag, index) => {
                    let cubeObjectArr = await Fetcher.FetchCubeObjectsWithTagsOTR(tag, null, null);
                    
                    //Calculate coordinates:
                    let coordinate = {x:0, y:0, z:0};
                    switch(axis.AxisDirection){
                        case AxisDirection.X: //If axis is xAxis
                            coordinate.x += 1 + index;
                            coordinate.y += 1;
                            break;
                        case AxisDirection.Y:
                            coordinate.y += 1 + index;
                            coordinate.z += 0.5;
                            break;
                        case AxisDirection.Z:
                            coordinate.z += 1 + index;
                            coordinate.y += 1;
                            break;
                    }
                    let cell = new Cell(this.scene, this.textLoader, coordinate, cubeObjectArr);
                    cells.push(cell);
                })
                :   
                //If axis is hierarchy:
                axis.Hierarchies.map(async (hierarchies: HierarchyNode, index) => {
                   
                });

        await Promise.all(promises); //Wait for all cells to be added:
        //this.setState({cells: cells});
    }*/

    /*async fetchAndAddCubeObjectsForTwoAxis(axis1: Axis, axis2:Axis){
        let cells: Cell[] = [];
        let promises = axis1.Tags.map(async (tag1: Tag, index1) => {
            axis2.Tags.map(async (tag2: Tag, index2) => {
                let cubeObjectArr = await Fetcher.FetchCubeObjectsWithTagsOTR(tag1, tag2, null);
                let coordinate = {x:0, y:0, z:0};
                switch((axis1.AxisDirection, axis2.AxisDirection)){
                    case (AxisDirection.X, AxisDirection.Y):    //x and y
                        coordinate.x += 1 + index1;
                        coordinate.y += 1 + index2;
                        break;
                    case (AxisDirection.X, AxisDirection.Z):    //x and z
                        coordinate.x += 1 + index1;
                        coordinate.z += 1 + index2;
                        break;
                    case (AxisDirection.Y, AxisDirection.Z):    //y and z
                        coordinate.y += 1 + index1;
                        coordinate.z += 1 + index2;
                        break;
                }
                let cell = new Cell(this.scene, this.textLoader, coordinate, cubeObjectArr);
                cells.push(cell);
            });
        });
        await Promise.all(promises); //Wait for all cells to be added:
        this.setState({cells: cells});
    }*/

    /*async fetchAndAddCubeObjectsForThreeAxis(axis1: Axis, axis2:Axis, axis3:Axis){
        let cells: Cell[] = [];
        let promises = axis1.Tags.map(async (tag1: Tag, index1) => {
            axis2.Tags.map(async (tag2: Tag, index2) => {
                axis3.Tags.map(async (tag3: Tag, index3) => {
                    let cubeObjectArr = await Fetcher.FetchCubeObjectsWithTagsOTR(tag1, tag2, tag3);
                    let coordinate = {x:0, y:0, z:0};
                    //x and y and z:
                    coordinate.x += 1 + index1;
                    coordinate.y += 1 + index2;
                    coordinate.z += 1 + index3;
                    let cell = new Cell(this.scene, this.textLoader, coordinate, cubeObjectArr);
                    cells.push(cell);
                });
            });
        });
        await Promise.all(promises); //Wait for all cells to be added:
        this.setState({cells: cells});
    }*/
    
    onMouseMove = (event:MouseEvent) => {
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    GetCurrentBrowsingState(){
        let cameraAngle = new THREE.Vector3();
        //this.camera.getWorldDirection(camera)
        /*
        let currentBrowsingState : BrowsingState = {
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            zAxis: this.zAxis,
            cameraPosition: {x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z }
            //cameraAngle: this.camera.
        }*/
    }
}
        
export default ThreeBrowser;