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
import { Colors } from './Colors';
import { Filter } from '../../LeftDock/FacetedSearcher';

const OrbitControls = require('three-orbitcontrols')

/**
 * The ThreeBrowser Component is the browsing component used to browse photos in 3D.
 * The ThreeBrowser uses the three.js library for 3D rendering: https://threejs.org/
 */
export default class ThreeBrowser extends React.Component<{
        //Props contract:
        onFileCountChanged: (fileCount: number) => void,
        previousBrowsingState: BrowsingState|null,
        onOpenCubeInCardMode: (cubeObjects: CubeObject[]) => void,
        onOpenCubeInGridMode: (cubeObjects: CubeObject[]) => void,
        filters: Filter[]
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
                    <p>Sorry! Threejs crashed... Please refresh the browser.</p>
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

    //THREE interaction properties:´
    private mount: HTMLDivElement | null | undefined;
    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.Camera = new THREE.Camera();
    private controls: any;  //Set in componentDidMount
    private font: THREE.Font;
    private frameId: number = 0;
    //Renderer to render scene:
    private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
    //Texture loader for loading textures:
    private textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
    //Textloader for loading fonts:
    private fontLoader: THREE.FontLoader = new THREE.FontLoader();
    //Raycaster used for detecting mouse over:
    private raycaster: Raycaster = new Raycaster();
    //This will be 2D coordinates of the current mouse position, [0,0] is middle of the screen. Updated in this.onMouseMove
    private mouse = new THREE.Vector2();
    //Used to find IntersectedObjects with this.raycaster:
    private boxMeshes: THREE.Mesh[] = [];
    private textMeshes: THREE.Mesh[] = [];
    private contextMenuCubeObjects: CubeObject[] = [];

    //Reusing THREE Geometries and Materials to save memory, to speed things up, and to dispose them after:
    private boxGeometry : THREE.BoxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    private boxTextures : Map<string, THREE.MeshBasicMaterial> = new Map<string, THREE.MeshBasicMaterial>();
    private textGeometries : Map<string, THREE.TextGeometry> = new Map<string, THREE.TextGeometry>();
    private redMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( { color: Colors.Red } );
    private greenMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( { color: Colors.Green } );
    private blueMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( { color: Colors.Blue } );
    private redLineMaterial: THREE.LineBasicMaterial = new THREE.LineBasicMaterial( { color: Colors.Red } );
    private greenLineMaterial: THREE.LineBasicMaterial = new THREE.LineBasicMaterial( { color: Colors.Green } );
    private blueLineMaterial: THREE.LineBasicMaterial = new THREE.LineBasicMaterial( { color: Colors.Blue } );

    //Browsing state:
    //Cells:
    cells: Cell[] = [];
    //The three axis:
    xAxis: Axis = new Axis();
    yAxis: Axis = new Axis();
    zAxis: Axis = new Axis();

    constructor(props: any){
        super(props);
        this.xAxis.TitleString = "X";
        this.yAxis.TitleString = "Y";
        this.zAxis.TitleString = "Z";
        //Loading font used in application:
        this.font = this.fontLoader.parse(helveticaRegular);
    }
    
    componentDidMount(){
        if(this.mount){
            //Adding camera:
            this.camera = new THREE.PerspectiveCamera(
                75,
                this.mount.clientWidth / this.mount.clientHeight,
                0.1,
                1000
            );
            this.camera.position.x = 5;
            this.camera.position.y = 5;
            this.camera.position.z = 5;
            
            //Setting up renderer:
            this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight)
            
            //Add rendered scene to DOM:
            this.mount.appendChild(this.renderer.domElement)
            
            //Set controls to OrbitControls:
            this.controls = new OrbitControls( this.camera, this.renderer.domElement);

            //Filling out available space with renderer:
            this.onBrowserResize();

            //Start animation:
            this.start();

            //Default x,y,z view:
            this.createInitialScene();

            //Restore to previous browsing state if it is given:
            if(this.props.previousBrowsingState) { 
                this.restoreBrowsingState(this.props.previousBrowsingState!); 
            }else{
                //To trigger compute cells in default x,y,z view:
                this.computeCells();
            }

            //Subscribe eventlisterners:
            this.subscribeEventHandlers();
        }
    }
    
    /** Before closing component: */
    componentWillUnmount(){
        this.stop()
        this.unsubscribeEventHandlers();
        if(this.mount){
            this.mount.removeChild(this.renderer.domElement);
        }
        this.disposeWhatCanBeDisposed();  
    }

    private subscribeEventHandlers(){
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

    private unsubscribeEventHandlers(){
        window.removeEventListener("resize", this.onBrowserResize);
        document.removeEventListener('keydown', this.onKeyPress);
        this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove, false);
        this.renderer.domElement.removeEventListener("webglcontextlost", this.onWebGLContextLost, false);
        this.renderer.domElement.removeEventListener('contextmenu', this.onRightClick, false);
        this.renderer.domElement.removeEventListener("click", this.onMouseClick, false);
    }

    /** 
     * Cleans up memory. Geometries, Textures and Materials needs to be disposed manually:
     * https://threejs.org/docs/index.html#manual/en/introduction/How-to-dispose-of-objects
     */
    private disposeWhatCanBeDisposed(){
        this.renderer.dispose();
        this.controls.dispose();
        this.boxGeometry.dispose();
        this.boxTextures.forEach((v:THREE.MeshBasicMaterial, k:string) => v.dispose());
        this.boxTextures = new Map<string, THREE.MeshBasicMaterial>();
        this.textGeometries.forEach((v:THREE.TextGeometry, k:string) => v.dispose());
        this.textGeometries = new Map<string, THREE.TextGeometry>();
        this.redMaterial.dispose();
        this.greenMaterial.dispose();
        this.blueMaterial.dispose();
        this.redLineMaterial.dispose();
        this.greenLineMaterial.dispose();
        this.blueLineMaterial.dispose();
        this.cells = [];
        this.xAxis = new Axis();
        this.yAxis = new Axis();
        this.zAxis = new Axis();
        this.boxMeshes = [];
        this.textMeshes = [];
        this.contextMenuCubeObjects = [];
    }

    /** start, animate, stop, renderScene is part of ThreeJS render loop. */
    private start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    //Render loop:
    private animate = () => {
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
        //Point text to camera:
        this.textMeshes.forEach((t:THREE.Mesh) => t.lookAt( this.camera.position ));
    }
        
    private stop = () => {
        cancelAnimationFrame(this.frameId)
    }
        
    private renderScene = () => {
        this.renderer.render(this.scene, this.camera);
    }

    private async createInitialScene(){
        //Creating X-Axis:
        this.ClearXAxis();
        //Creating Y-Axis:
        this.ClearYAxis();
        //Creating Z-Axis:
        this.ClearZAxis();
    }

    public ClearXAxis(){
        this.xAxis.RemoveObjectsFromScene(this.scene);
        let newXAxis = new Axis();
        newXAxis.AxisDirection = AxisDirection.X;
        newXAxis.TitleString = "X";
        newXAxis.TitleThreeObject = this.addTextCallback("X", {x:2,y:0,z:0}, Colors.Red, 0.5);
        newXAxis.LineThreeObject = this.addLineCallback({x:0,y:0,z:0}, {x:2,y:0,z:0}, Colors.Red);
        this.xAxis = newXAxis;
    }

    public ClearYAxis(){
        this.yAxis.RemoveObjectsFromScene(this.scene);
        let newYAxis = new Axis();
        newYAxis.AxisDirection = AxisDirection.Y;
        newYAxis.TitleString = "Y";
        newYAxis.TitleThreeObject = this.addTextCallback("Y", {x:0,y:2,z:0}, Colors.Green, 0.5);
        newYAxis.LineThreeObject = this.addLineCallback({x:0,y:0,z:0}, {x:0,y:2,z:0}, Colors.Green);
        this.yAxis = newYAxis;
    }

    public ClearZAxis(){
        this.zAxis.RemoveObjectsFromScene(this.scene);
        let newZAxis = new Axis();
        newZAxis.AxisDirection = AxisDirection.Z;
        newZAxis.TitleString = "Z";
        newZAxis.TitleThreeObject = this.addTextCallback("Z", {x:0,y:0,z:2}, Colors.Blue, 0.5);
        newZAxis.LineThreeObject = this.addLineCallback({x:0,y:0,z:0}, {x:0,y:0,z:2}, Colors.Blue);
        this.zAxis = newZAxis;
    }

    /* EVENT HANDLERS: */
    /** Handler for mouse left click. */
    private onMouseClick = (me: MouseEvent) => {
        if(me.button == 0 || me.button == 1){ //left or middle click
            this.setState({ showContextMenu: false });
        }
    }

    /** Handler for right click */
    private onRightClick = (me: MouseEvent) => {
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

    /** Handler for when mouse moves */
    private onMouseMove = (event: MouseEvent) => {
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

    /** Handler for keyboard presses. */
    private onKeyPress = (event: KeyboardEvent) => {
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

    /** Handler to rightclick - open cube in Card mode. */
    private onOpenCubeInCardMode(){
        this.props.onOpenCubeInCardMode(this.contextMenuCubeObjects);
    }

    /**
     * Handler to rightclick - Open cube in grid mode.
     */
    private onOpenCubeInGridMode(){
        this.props.onOpenCubeInGridMode(this.contextMenuCubeObjects);
    }

    /**
     * Handler if window size changes. Resizes the canvas.
     */
    private onBrowserResize = () => {
        let browserElement: HTMLElement = document.getElementById('ThreeBrowser')!;
        let width = browserElement.clientWidth;
        let height = browserElement.clientHeight;
        this.renderer.setSize(width, height);
        (this.camera as any).aspect = width / height; //For some reason, typescript cannot see .aspect property?
        (this.camera as any).updateProjectionMatrix();
    }

    /**
     * Handler if ThreeJS crashes.
     */
    private onWebGLContextLost = (e: Event) => {
        this.setState({showErrorMessage: true});
        console.log(this.renderer.info);
    }

    /* CALLBACK FUNCTIONS */
    /** Adds a line from fromPosition to toPosition with aColor */
    private addLineCallback = (fromPosition: Position, toPosition: Position, aColor:Colors) => {
        let lineMaterial : THREE.LineBasicMaterial;
        switch(aColor){
            case Colors.Red: lineMaterial = this.redLineMaterial; break;
            case Colors.Green: lineMaterial = this.greenLineMaterial; break;
            case Colors.Blue: lineMaterial = this.blueLineMaterial; break;
            default: throw("Unknown color in addLineCallBack!");
        }
        let lineGeometry = new THREE.Geometry;
        let from = new THREE.Vector3(fromPosition.x,fromPosition.y,fromPosition.z);
        let to = new THREE.Vector3(toPosition.x, toPosition.y, toPosition.z);
        lineGeometry.vertices.push( from );
        lineGeometry.vertices.push( to );
        let lineMesh = new THREE.Line( lineGeometry, lineMaterial );
        lineGeometry.dispose();
        this.scene.add( lineMesh );
        return lineMesh;
    }

    /** Adds {SomeText} to aPosition{x, y, z} with aColor and aSize */
    private addTextCallback = (someText: string, aPosition:Position, aColor:Colors, aSize:number) => {
        let textGeometry : THREE.TextGeometry;
        if(this.textGeometries.has(someText)){
            textGeometry = this.textGeometries.get(someText)!;
        }else{
            textGeometry = new THREE.TextGeometry( someText, {
                font: this.font,
                size: aSize,
                height: 0.01,
                curveSegments: 3
            });
            this.textGeometries.set(someText, textGeometry);
        }
        let textMaterial: THREE.MeshBasicMaterial;
        switch(aColor){
            case Colors.Red: textMaterial = this.redMaterial; break;
            case Colors.Green: textMaterial = this.greenMaterial; break;
            case Colors.Blue: textMaterial = this.blueMaterial; break;
            default: throw("Unknown color in addText!");
        }
        let textMesh = new THREE.Mesh( textGeometry, textMaterial );
        textMesh.position.x = aPosition.x;
        textMesh.position.y = aPosition.y;
        textMesh.position.z = aPosition.z;
        this.textMeshes.push(textMesh);
        this.scene.add( textMesh );
        return textMesh;
    }

    /** Adds a cube to scene with given imageURL and aPosition */
    private addCubeCallback = (imageUrl: string, aPosition: Position) => {
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
        //Add to list of cube objects in order to detect raycaster collisions later:
        this.boxMeshes.push(boxMesh);
        return boxMesh;
    }
        
    /**
     * Updates axis labels and then calls compute cells.
     * Called from outside of ThreeBrowser
     * @param dimName "X", "Y" or "Z"
     * @param dimension 
     */
    public async UpdateAxis(dimName:string, dimension:PickedDimension){
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

        //This await is important, don't remove it.
        await this.computeCells();
    }

    /**
     * Removes current cells from the scene.
     * Clears the current cells and fetches new cells from the server:
     */
    private async computeCells(){
        //Remove previous cells:
        this.cells.forEach((cell: Cell) => cell.RemoveFromScene());
        this.boxMeshes = [];

        //Fetch and add new cells:
        let xDefined : boolean = this.xAxis.TitleString != "X";
        let yDefined : boolean = this.yAxis.TitleString != "Y";
        let zDefined : boolean = this.zAxis.TitleString != "Z";

        let newCells: Cell[] = [];

        //Fetch cells based on which axis are defined:
        if(xDefined && yDefined && zDefined){   //X and Y and Z
            //Render all three axis
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(this.xAxis, this.yAxis, this.zAxis, this.props.filters);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textureLoader, this.addCubeCallback, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(xDefined && yDefined){         //X and Y
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(this.xAxis, this.yAxis, null, this.props.filters);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textureLoader, this.addCubeCallback, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(xDefined && zDefined){         //X and Z
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(this.xAxis, null, this.zAxis, this.props.filters);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textureLoader, this.addCubeCallback, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(yDefined && zDefined){         //Y and Z
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(null, this.yAxis, this.zAxis, this.props.filters);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textureLoader, this.addCubeCallback, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(xDefined){                     //X
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(this.xAxis, null, null, this.props.filters);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textureLoader, this.addCubeCallback, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(yDefined){                     //Y
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(null, this.yAxis, null, this.props.filters);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textureLoader, this.addCubeCallback, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }else if(zDefined){                     //Z
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(null, null, this.zAxis, this.props.filters);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textureLoader, this.addCubeCallback, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        } else if(!xDefined && !yDefined && !zDefined){
            let ICells : ICell[] = await Fetcher.FetchCellsFromAxis(null, null, null, this.props.filters);
            ICells.forEach((c:ICell) => newCells.push(new Cell(this.scene, this.textureLoader, this.addCubeCallback, {x: c.x, y: c.y, z:c.z}, c.CubeObjects)));
        }

        this.cells = newCells;

        console.log("Done computing cells")

        //Update filecount:
        let uniquePhotoIds: Set<number> = new Set();
        this.cells.forEach((cell: Cell) => 
            cell.CubeObjects.forEach(co => uniquePhotoIds.add(co.PhotoId)));
        this.props.onFileCountChanged(uniquePhotoIds.size);
    }

    /**
     * Recomputes the cells. 
     * Can be called from parent component.
     * Used to recompute cells after filters has been added.
     */
    public async RecomputeCells(){
        await this.computeCells();
    }
    
    /**
     * Used to get browsing state just before switching to another browsing mode.
     */
    public GetCurrentBrowsingState(){
        console.log("Getting current browsing state")
        let currentBrowsingState : BrowsingState = {
            xAxisPickedDimension: this.xAxis.PickedDimension ? this.xAxis.PickedDimension : null,
            yAxisPickedDimension: this.yAxis.PickedDimension ? this.yAxis.PickedDimension : null,
            zAxisPickedDimension: this.zAxis.PickedDimension ? this.zAxis.PickedDimension : null,
            cameraState: JSON.stringify(this.camera.matrix.toArray())
        }
        return currentBrowsingState;
    }

    /**
     * Used to restore from previous browsingstate - see this.GetCurrentBrowsingState().
     * @param browsingState 
     */
    private async restoreBrowsingState(browsingState: BrowsingState){
        console.log("Restoring previous browsing state:");
        //Restoring camera state:
        this.camera.matrix.fromArray(JSON.parse(browsingState.cameraState));
        this.camera.matrix.decompose(this.camera.position, this.camera.quaternion, this.camera.scale);
        (this.camera as any).updateProjectionMatrix();

        //Restoring browsing state:
        if(browsingState.xAxisPickedDimension) { await this.UpdateAxis("X", browsingState.xAxisPickedDimension) }
        if(browsingState.yAxisPickedDimension) { await this.UpdateAxis("Y", browsingState.yAxisPickedDimension) }
        if(browsingState.zAxisPickedDimension) { await this.UpdateAxis("Z", browsingState.zAxisPickedDimension) }
        await this.computeCells();
    }

    /**
     * Used to collect cubeObjects to be shown in Grid or Card mode.
     */
    public GetUniqueCubeObjects(){
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
}