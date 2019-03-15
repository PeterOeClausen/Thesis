import Tag from './Tag';
import * as THREE from 'three';
import Position from "./Position";
import HierarchyNode from './HierarchyNode';
import Tagset from './Tagset';
import Hierarchy from './Hierarchy';
import PickedDimension from '../../RightDock/PickedDimension';

export enum AxisTypeEnum {
    Tagset = "Tagset",
    Hierarchy = "Hierarchy",
    HierarchyLeaf = "HierarchyLeaf" //A HierarchyLeaf is a HierarchyNode that has no children.
};

export interface ObjectTagPair{
    object: THREE.Mesh,
    tag: Tag
    //Add hirarchy here!
}

export enum AxisDirection{
    X = "X",
    Y = "Y",
    Z = "Z"
}

export default class Axis{
    AxisDirection: AxisDirection|null = null;
    TitleString: string = "";
    TitleThreeObject: THREE.Mesh|null = null;
    AxisType: AxisTypeEnum|null = null;
    LineThreeObject: THREE.Line|null = null;
    LabelThreeObjects: THREE.Mesh[] = [];
    IsReady: boolean = true;
    
    PickedDimension: PickedDimension|null = null;
    TagsetId: number = 0;
    Tags: Tag[] = [];
    RootNodeId: number = 0;
    Hierarchies: HierarchyNode[] = [];

    RemoveObjectsFromScene(scene: THREE.Scene){
        this.IsReady = false;
        //this.LabelThreeObjectsAndTags.forEach((labelObject:{object:THREE.Mesh, tag:Tag}) => scene.remove(labelObject.object));
        this.LabelThreeObjects.forEach(to => scene.remove(to));
        if(this.TitleThreeObject) scene.remove(this.TitleThreeObject);
        if(this.LineThreeObject) scene.remove(this.LineThreeObject);
    }

    AddTagset(
        tagset: Tagset, 
        addTextCallback: (someText: string, aPosition:Position, aColor:THREE.Color, aSize:number) => THREE.Mesh,
        addLineCallback: (fromPosition: Position, toPosition: Position, aColor:THREE.Color) => THREE.Line){

        this.IsReady = false;
        this.AxisType = AxisTypeEnum.Tagset;
        this.TagsetId = tagset.Id;
        //Sort tags alphabethically:
        tagset.Tags!.sort((a:Tag,b:Tag) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0);
        this.Tags = tagset.Tags!;
        let color: THREE.Color = 
            this.AxisDirection === AxisDirection.X ? new THREE.Color(0xF00000): //Red
            this.AxisDirection === AxisDirection.Y ? new THREE.Color(0x00F000): //Green
            new THREE.Color(0x0000F0)                                           //Blue
        this.TitleThreeObject = addTextCallback(
            this.TitleString, //Text
            {                 //Coordinate:
                x:this.AxisDirection === AxisDirection.X ? this.Tags.length + 1 : 0,
                y:this.AxisDirection === AxisDirection.Y ? this.Tags.length + 1 : 0,
                z:this.AxisDirection === AxisDirection.Z ? this.Tags.length + 1 : 0
            },
            color,            //Color
            0.5               //Fontsize
        );
        this.LineThreeObject = addLineCallback(
            {x:0,y:0,z:0},    //From
            {                 //To
                x:this.AxisDirection === AxisDirection.X ? this.Tags.length : 0,
                y:this.AxisDirection === AxisDirection.Y ? this.Tags.length : 0,
                z:this.AxisDirection === AxisDirection.Z ? this.Tags.length : 0,
            }, 
            color             //Color
        );
        this.LabelThreeObjects = this.Tags.map((tag,index) => {
            return addTextCallback(
                tag.Name,     //Label name
                {             //Position
                    x:this.AxisDirection === AxisDirection.X ? index + 1 : 0,
                    y:this.AxisDirection === AxisDirection.Y ? index + 1 : 0,
                    z:this.AxisDirection === AxisDirection.Z ? index + 1 : 0,
                },
                color,        //Color
                0.1           //Fontsize
            )
        });
        this.IsReady = true;
    }

    AddHierarchy(
        hierarchy: HierarchyNode,
        addTextCallback: (someText: string, aPosition:Position, aColor:THREE.Color, aSize:number) => THREE.Mesh,
        addLineCallback: (fromPosition: Position, toPosition: Position, aColor:THREE.Color) => THREE.Line){
        
        this.IsReady = false;
        this.AxisType = AxisTypeEnum.Hierarchy;
        this.RootNodeId = hierarchy.Id;
        this.Hierarchies = hierarchy.Children;
        this.Hierarchies.sort((a:HierarchyNode,b:HierarchyNode) => a.Tag.Name > b.Tag.Name ? 1 : a.Tag.Name < b.Tag.Name ? -1 : 0);
        
        let color: THREE.Color = 
            this.AxisDirection === AxisDirection.X ? new THREE.Color(0xF00000): //Red
            this.AxisDirection === AxisDirection.Y ? new THREE.Color(0x00F000): //Green
            new THREE.Color(0x0000F0);                                          //Blue
        //Adding title:
        this.TitleThreeObject = addTextCallback(
            this.TitleString, //Text
            {                 //Coordinate:
                x:this.AxisDirection === AxisDirection.X ? this.Hierarchies.length + 1 : 0,
                y:this.AxisDirection === AxisDirection.Y ? this.Hierarchies.length + 1 : 0,
                z:this.AxisDirection === AxisDirection.Z ? this.Hierarchies.length + 1 : 0
            },
            color,            //Color
            0.5               //Fontsize
        );
        //Adjusting line length:
        this.LineThreeObject = addLineCallback(
            {x:0,y:0,z:0},    //From
            {                 //To
                x:this.AxisDirection === AxisDirection.X ? this.Hierarchies.length : 0,
                y:this.AxisDirection === AxisDirection.Y ? this.Hierarchies.length : 0,
                z:this.AxisDirection === AxisDirection.Z ? this.Hierarchies.length : 0,
            }, 
            color             //Color
        );
        //Adding labels:
        this.LabelThreeObjects = this.Hierarchies.map((hirarchy,index) => {
            return addTextCallback(
                //Label name:
                hirarchy.Tag.Name,
                //Position:
                {                 
                    x:this.AxisDirection === AxisDirection.X ? index + 1 : 0,
                    y:this.AxisDirection === AxisDirection.Y ? index + 1 : 0,
                    z:this.AxisDirection === AxisDirection.Z ? index + 1 : 0,
                },
                //Color:
                color,        
                //Fontsize:
                0.1           
            )
        });
        this.IsReady = true;
    }

    AddHierarchyLeaf(
        hierarchy: HierarchyNode,
        addTextCallback: (someText: string, aPosition:Position, aColor:THREE.Color, aSize:number) => THREE.Mesh,
        addLineCallback: (fromPosition: Position, toPosition: Position, aColor:THREE.Color) => THREE.Line){
        
        this.IsReady = false;
        this.AxisType = AxisTypeEnum.HierarchyLeaf;
        this.RootNodeId = hierarchy.Id;
        this.Hierarchies = [hierarchy];
        
        let color: THREE.Color = 
            this.AxisDirection === AxisDirection.X ? new THREE.Color(0xF00000): //Red
            this.AxisDirection === AxisDirection.Y ? new THREE.Color(0x00F000): //Green
            new THREE.Color(0x0000F0);                                          //Blue if Z
        //Adding title:
        this.TitleThreeObject = addTextCallback(
            this.TitleString, //Text
            {                 //Coordinate:
                x:this.AxisDirection === AxisDirection.X ? 2 : 0,
                y:this.AxisDirection === AxisDirection.Y ? 2 : 0,
                z:this.AxisDirection === AxisDirection.Z ? 2 : 0
            },
            color,            //Color
            0.5               //Fontsize
        );
        //Adjusting line length:
        this.LineThreeObject = addLineCallback(
            {x:0,y:0,z:0},    //From
            {                 //To
                x:this.AxisDirection === AxisDirection.X ? 1 : 0,
                y:this.AxisDirection === AxisDirection.Y ? 1 : 0,
                z:this.AxisDirection === AxisDirection.Z ? 1 : 0,
            }, 
            color             //Color
        );
        //Adding labels:
        this.LabelThreeObjects = [ 
             addTextCallback(
                //Label name:
                hierarchy.Tag.Name,
                //Position:
                {                 
                    x:this.AxisDirection === AxisDirection.X ? 1 : 0,
                    y:this.AxisDirection === AxisDirection.Y ? 1 : 0,
                    z:this.AxisDirection === AxisDirection.Z ? 1 : 0,
                },
                //Color:
                color,        
                //Fontsize:
                0.1           
            )
        ]
        
        this.IsReady = true;
    }
}