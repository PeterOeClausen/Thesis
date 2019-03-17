import * as React from 'react';
import * as THREE from 'three';
import Position from './Position';
import '../../../css/ThreeBrowser.css';
import stockImage from '../../../images/download.jpg';
import helveticaRegular from '../../../fonts/helvetiker_regular.typeface.json';
import Axis, {AxisTypeEnum, AxisDirection} from './Axis';
import Cell from './Cell';
import Fetcher from './Fetcher';
import Hierarchy from './Hierarchy';
import Tagset from './Tagset';
import HierarchyNode from './HierarchyNode';
import { Raycaster } from 'three';
import CubeObject from './CubeObject';
import ICell from './Cell';
import { BrowsingState } from './BrowsingState';
import PickedDimension from '../../RightDock/PickedDimension';

const OrbitControls = require('three-orbitcontrols')

/**
 * The ThreeBrowser Component is the browsing component used to browse photos in 3D.
 * The ThreeBrowser uses the three.js library for 3D rendering: https://threejs.org/
 */
class ThreeBrowser extends React.Component<{
        //Props contract:
        onFileCountChanged: (fileCount: number) => void,
        previousBrowsingState: BrowsingState|null,
        onOpenCubeInCardMode: (cubeObjects: CubeObject[]) => void,
        onOpenCubeInGridMode: (cubeObjects: CubeObject[]) => void
    }>{

    /* The state desides what is shown in the interface, and is changesd with a this.setState call. */
    state = {
        infoText: "Hover with mouse on a cube to see info",
        showContextMenu: false,
        showErrorMessage: false
    };

    render(){
        let contextMenu = <div id="conMenu"></div>
        if(this.state.showContextMenu){
            contextMenu = 
                <div id="conMenu">
                    <button onClick={(e) => this.onOpenCubeInCardMode()}>Open cube in Card mode</button>
                    <br/>
                    <button onClick={(e) => this.onOpenCubeInGridMode()}>Open cube in Grid mode</button>
                </div>
        }
        let errorMessage = <div id="ErrrorMessage"></div>
        if(this.state.showErrorMessage){
            errorMessage = 
                <div id="ErrrorMessage">
                    <p>Sorry! Threejs crashed... Probably because it was set to do too much... Please refresh the browser.</p>
                </div>
        }
        return(
            <div className="grid-item" id="ThreeBrowser">
                <div style={{ width: '400px', height: '400px' }} ref = {(mount) => { this.mount = mount }}/>
                <div id="info">{this.state.infoText}</div>
                {contextMenu}
                {errorMessage}
            </div>
        );
    }

    mount: HTMLDivElement|null = this.mount!;
    scene: THREE.Scene = new THREE.Scene();
    camera: THREE.Camera = new THREE.Camera();
    controls: any;  //Set in componentDidMount
    font:any;
    frameId: number = 0;
    renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
    textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
    textLoader: THREE.FontLoader = new THREE.FontLoader();
    //Raycaster used for detecting mouse over:
    raycaster: Raycaster = new Raycaster();
    //This will be 2D coordinates of the current mouse position, [0,0] is middle of the screen. Updated in this.onMouseMove
    mouse = new THREE.Vector2();
    
    textMeshes: THREE.Mesh[] = [];
    boxMeshes: THREE.Mesh[] = [];

    //Reusing THREE Geometries to save memory:
    boxGeometry : THREE.BoxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    boxTextures : Map<string, THREE.MeshBasicMaterial> = new Map<string, THREE.MeshBasicMaterial>();

    //Browsing state:
    //Cells:
    cells: Cell[] = [];
    //The three axis:
    xAxis: Axis = new Axis();
    yAxis: Axis = new Axis();
    zAxis: Axis = new Axis();

    contextMenuCubeObjects = [];

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
        //Adding camere:
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.mount!.clientWidth / this.mount!.clientHeight,
            0.1,
            1000
        );
        this.camera.position.x = 5;
        this.camera.position.y = 5;
        this.camera.position.z = 5;
        
        //Setting up renderer:
        this.renderer.setSize(this.mount!.clientWidth, this.mount!.clientHeight)
        
        //Add rendered scene to DOM:
        this.mount!.appendChild(this.renderer.domElement)
        
        //SET CONTROLS TO ORBITCONTROL
        this.controls = new OrbitControls( this.camera, this.renderer.domElement);

        //Load font:
        this.font = this.textLoader.parse(helveticaRegular);
        
        //Filling out available space:
        this.onBrowserResize();

        //Default x,y,z view:
        this.createInitialScene();

        //START ANIMATION
        this.start();

        //Restore to previous browsing state if it is given:
        if(this.props.previousBrowsingState) { this.RestoreBrowsingState(this.props.previousBrowsingState!); }

        //Subscribe eventlisterners:
        this.subscribeEventHandlers();
    }
    
    componentWillUnmount(){
        this.stop()
        this.unsubscribeEventHandlers();
        this.mount!.removeChild(this.renderer.domElement);      
        this.disposeWhatCanBeDisposed();  
    }

    subscribeEventHandlers(){
        //Resize canvas when resizing window:
        window.addEventListener("resize", this.onBrowserResize);
        //Add keydown handler:
        document.addEventListener('keydown', this.onKeyPress);
        //Mouse move event handler:
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove, false);
        //If renderer crashes:
        this.renderer.domElement.addEventListener("webglcontextlost", this.onWebGLContextLost, false);
        //Right click handler:
        this.renderer.domElement.addEventListener('contextmenu', this.onRightClick, false);
        //Mouse click handler:
        this.renderer.domElement.addEventListener("click", this.onMouseClick, false);
    }

    unsubscribeEventHandlers(){
        window.removeEventListener("resize", this.onBrowserResize);
        document.removeEventListener('keydown', this.onKeyPress);
        this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove, false);
        this.renderer.domElement.removeEventListener("webglcontextlost", this.onWebGLContextLost, false);
        this.renderer.domElement.removeEventListener('contextmenu', this.onRightClick, false);
        this.renderer.domElement.removeEventListener("click", this.onMouseClick, false);
    }

    disposeWhatCanBeDisposed(){
        this.renderer.dispose();
        this.boxGeometry.dispose();
        this.boxTextures.forEach((v:THREE.MeshBasicMaterial, k:string) => v.dispose());
        this.boxTextures = new Map<string, THREE.MeshBasicMaterial>();
        this.cells = [];
        this.xAxis = new Axis();
        this.yAxis = new Axis();
        this.zAxis = new Axis();
        this.contextMenuCubeObjects = [];
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

    /*Event handlers: */
    onMouseClick = (me: MouseEvent) => {
        if(me.button == 0 || me.button == 1){ //left or middle click
            this.setState({ showContextMenu: false });
        }
    }

    onRightClick = (me: MouseEvent) => {
        me.preventDefault();
        // calculate objects intersecting the picking ray:
        // is updated in function onMouseMove
        let intersects = this.raycaster.intersectObjects( this.boxMeshes );
        //Only show contextMenu if on cube object:
        if(intersects.length > 0){
            let conMenu : HTMLElement|null = document.getElementById('conMenu');
            let x = (me.clientX + 20) + 'px';
            let y = (me.clientY + 20) + 'px';
            conMenu!.style.top = y;
            conMenu!.style.left = x;
            this.setState({showContextMenu: true});
            this.contextMenuCubeObjects = intersects[0].object.userData.cubeObjects;
        }
        return false;
    }

    onMouseMove = (event: MouseEvent) => {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera( this.mouse, this.camera );
        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects( this.boxMeshes );
        if(intersects.length > 0){
            let xDefined : boolean = this.xAxis.TitleString !== "X";
            let yDefined : boolean = this.yAxis.TitleString !== "Y";
            let zDefined : boolean = this.zAxis.TitleString !== "Z";
            let infoText : string = "Number of photos: " + intersects[0].object.userData.size;
            if(xDefined){
                if(intersects[0].object.userData.x != 0 && this.xAxis.AxisType == AxisTypeEnum.Tagset){
                    infoText += ",  X: " + (this.xAxis.TitleString + ": " + this.xAxis.Tags[parseInt(intersects[0].object.userData.x) - 1].Name)
                }else if(this.xAxis.AxisType == AxisTypeEnum.Hierarchy){
                    infoText += ",  X: " + (this.xAxis.TitleString + ": " + this.xAxis.Hierarchies[parseInt(intersects[0].object.userData.x) - 1].Tag.Name)
                }
                else if(this.xAxis.AxisType == AxisTypeEnum.HierarchyLeaf){
                    infoText += ",  X: " + (this.xAxis.Hierarchies[parseInt(intersects[0].object.userData.x) - 1].Tag.Name)
                }
            }
            if(yDefined){
                if(intersects[0].object.userData.y != 0 && this.yAxis.AxisType == AxisTypeEnum.Tagset){
                    infoText += ",  Y: " + (this.yAxis.TitleString + ": " + this.yAxis.Tags[parseInt(intersects[0].object.userData.y) - 1].Name);
                }else if(this.yAxis.AxisType == AxisTypeEnum.Hierarchy){
                    infoText += ",  Y: " + (this.yAxis.TitleString + ": " + this.yAxis.Hierarchies[parseInt(intersects[0].object.userData.y) - 1].Tag.Name);
                }else if(this.yAxis.AxisType == AxisTypeEnum.HierarchyLeaf){
                    infoText += ",  Y: " + (this.yAxis.Hierarchies[parseInt(intersects[0].object.userData.y) - 1].Tag.Name)
                }
            }
            if(zDefined){
                if(intersects[0].object.userData.z != 0 && this.zAxis.AxisType == AxisTypeEnum.Tagset){
                    infoText += ",  Z: " + (this.zAxis.TitleString + ": " + this.zAxis.Tags[parseInt(intersects[0].object.userData.z) - 1].Name);
                }else if(this.zAxis.AxisType == AxisTypeEnum.Hierarchy){
                    infoText += ",  Z: " + (this.zAxis.TitleString + ": " + this.zAxis.Hierarchies[parseInt(intersects[0].object.userData.z) - 1].Tag.Name);
                }else if(this.zAxis.AxisType == AxisTypeEnum.HierarchyLeaf){
                    infoText += ",  Z: " + (this.zAxis.Hierarchies[parseInt(intersects[0].object.userData.z) - 1].Tag.Name)
                }
            }
            this.setState({infoText: infoText});
        }else{
            this.setState({infoText: "Hover with mouse on a cube to see info"});
        }
    }

    onKeyPress = (event: KeyboardEvent) => {
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

    onOpenCubeInCardMode(){
        this.props.onOpenCubeInCardMode(this.contextMenuCubeObjects);
    }

    onOpenCubeInGridMode(){
        this.props.onOpenCubeInGridMode(this.contextMenuCubeObjects);
    }

    onBrowserResize = () => {
        let browserElement: HTMLElement = document.getElementById('ThreeBrowser')!;
        let width = browserElement.clientWidth;
        let height = browserElement.clientHeight;
        this.renderer.setSize(width, height);
        //console.log(this.camera);
        (this.camera as any).aspect = width / height; //For some reason, typescript cannot see .aspect property?
        (this.camera as any).updateProjectionMatrix();
    }

    onWebGLContextLost = (e: Event) => {
        this.setState({showErrorMessage: true})
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

    /* Add cubes to scene with given imageURL and a position */
    addCubeCallback = (imageUrl: string, aPosition: Position) => {
        //If image is already loaded previously, get it, otherwise load it:
        let imageMaterial : THREE.MeshBasicMaterial;
        if(this.boxTextures.has(imageUrl)){
            imageMaterial = this.boxTextures.get(imageUrl)!;
        }else{
            //Load image as material:
            imageMaterial = new THREE.MeshBasicMaterial({
                map : this.textureLoader.load(imageUrl)
            });
            this.boxTextures.set(imageUrl, imageMaterial);
        }
        //Create mesh:
        let boxMesh = new THREE.Mesh( this.boxGeometry, imageMaterial );
        //Position in (x,y,z):
        boxMesh.position.x = aPosition.x;
        boxMesh.position.y = aPosition.y;
        boxMesh.position.z = aPosition.z;
        //Add to scene:
        this.scene.add( boxMesh );
        //Add to list of cube objects:
        this.boxMeshes.push(boxMesh);
        return boxMesh;
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

    addToCubeMeshesCallback = (cubeMesh: THREE.Mesh) => {
        this.boxMeshes.push(cubeMesh);
    }
        
    /**
     * Updates axis labels and then calls compute cells.
     * Called from outside of ThreeBrowser
     * @param dimName "X", "Y" or "Z"
     * @param dimension 
     */
    async UpdateAxis(dimName:string, dimension:PickedDimension){
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
        axis.PickedDimension = dimension;

        switch(dimension.type){
            case "hierarchy":
                let hierarchy: Hierarchy = await Fetcher.FetchHierarchy(dimension.id);
                let rootNode: HierarchyNode = await Fetcher.FetchNode(hierarchy.RootNodeId);
                axis.TitleString = hierarchy.Name + " (hierarchy)";
                axis.AddHierarchy(rootNode, this.addTextCallback, this.addLineCallback);
                break;
            case "tagset":
                let tagset: Tagset = await Fetcher.FetchTagset(dimension.id);
                axis.TitleString = tagset.Name + " (tagset)";
                axis.AddTagset(tagset, this.addTextCallback, this.addLineCallback);
                break;
            case "hierarchyNode":
                let rootNode2: HierarchyNode = await Fetcher.FetchNode(dimension.id);
                axis.TitleString = rootNode2.Tag.Name + " (hierarchy)";
                if(rootNode2.Children.length == 0){
                    axis.AddHierarchyLeaf(rootNode2, this.addTextCallback, this.addLineCallback)
                }
                else {
                    axis.AddHierarchy(rootNode2, this.addTextCallback, this.addLineCallback);
                }
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

        await this.computeCells();
    }

    async computeCells(){
        //Remove previous cells:
        this.cells.forEach((cell: Cell) => cell.RemoveFromScene());
        this.boxMeshes = [];

        //Fetch and add new cells:
        let xDefined : boolean = this.xAxis.TitleString != "X";
        let yDefined : boolean = this.yAxis.TitleString != "Y";
        let zDefined : boolean = this.zAxis.TitleString != "Z";

        let newCells: Cell[] = [];

        if(xDefined && yDefined && zDefined){   //X and Y and Z
            //Render all three axis
            //promise = this.fetchAndAddCubeObjectsForThreeAxis(this.xAxis, this.yAxis, this.zAxis);
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(this.xAxis, this.yAxis, this.zAxis);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textureLoader, this.addCubeCallback, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(xDefined && yDefined){         //X and Y
            //promise = this.fetchAndAddCubeObjectsForTwoAxis(this.xAxis, this.yAxis);
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(this.xAxis, this.yAxis, null);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textureLoader, this.addCubeCallback, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(xDefined && zDefined){         //X and Z
            //promise = this.fetchAndAddCubeObjectsForTwoAxis(this.xAxis, this.zAxis);
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(this.xAxis, null, this.zAxis);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textureLoader, this.addCubeCallback, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(yDefined && zDefined){         //Y and Z
            //promise = this.fetchAndAddCubeObjectsForTwoAxis(this.yAxis, this.zAxis);
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(null, this.yAxis, this.zAxis);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textureLoader, this.addCubeCallback, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(xDefined){                     //X
            //promise = this.fetchAndAddCubeObjectsForOneAxis(this.xAxis);
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(this.xAxis, null, null);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textureLoader, this.addCubeCallback, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(yDefined){                     //Y
            //promise = this.fetchAndAddCubeObjectsForOneAxis(this.yAxis);
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(null, this.yAxis, null);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textureLoader, this.addCubeCallback, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(zDefined){                     //Z
            //promise = this.fetchAndAddCubeObjectsForOneAxis(this.zAxis);
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(null, null, this.zAxis);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textureLoader, this.addCubeCallback, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
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
    
    GetCurrentBrowsingState(){
        console.log("Getting current browsing state")
        let currentBrowsingState : BrowsingState = {
            xAxisPickedDimension: this.xAxis.PickedDimension ? this.xAxis.PickedDimension : null,
            yAxisPickedDimension: this.yAxis.PickedDimension ? this.yAxis.PickedDimension : null,
            zAxisPickedDimension: this.zAxis.PickedDimension ? this.zAxis.PickedDimension : null,
            cameraState: JSON.stringify(this.camera.matrix.toArray())
        }
        return currentBrowsingState;
    }

    GetUniqueCubeObjects(){
        let uniqueCubeObjectIds = new Set<number>();
        let listOfUniqueCubeObjects : CubeObject[] = [];
        this.cells.forEach(c => c.CubeObjects.forEach(co => {
            if(!uniqueCubeObjectIds.has(co.Id)){
                listOfUniqueCubeObjects.push(co);
                uniqueCubeObjectIds.add(co.Id);
            }
        }));
        return listOfUniqueCubeObjects;
    }

    async RestoreBrowsingState(browsingState: BrowsingState){
        console.log("Restoring previous browsing state:");
        //Restoring camera state:
        this.camera.matrix.fromArray(JSON.parse(browsingState.cameraState));
        this.camera.matrix.decompose(this.camera.position, this.camera.quaternion, this.camera.scale);
        (this.camera as any).updateProjectionMatrix();

        //Restoring browsing state:
        if(browsingState.xAxisPickedDimension) { await this.UpdateAxis("X", browsingState.xAxisPickedDimension) }
        if(browsingState.yAxisPickedDimension) { await this.UpdateAxis("Y", browsingState.yAxisPickedDimension) }
        if(browsingState.zAxisPickedDimension) { await this.UpdateAxis("Z", browsingState.zAxisPickedDimension) }
    }
}
        
export default ThreeBrowser;