import React from 'react';
import Fetcher from '../Middle/ThreeBrowser/Fetcher';
import Hierarchy from '../Middle/ThreeBrowser/Hierarchy';
import HierarchyNode from '../Middle/ThreeBrowser/HierarchyNode';
import '../../css/HierarchyBrowser.css';

export default class HierarchyBrowser extends React.Component<{
        onDimensionChanged: (dimName: string, dimension:any) => void,
    }>{
    state = {
        node: <p>Pick a hierarchy to browse it...</p>
    }
    
    render(){
        return(
            <div id="HierarchyBrowser">
                <h4 className="Header">HierarchyBrowser:</h4>
                <div className="Scrollable">
                    {this.state.node}
                </div>
            </div>
        )
    }
    
    componentDidMount(){
        //this.RenderHierarchy("X", {id:2});
    }

    async RenderHierarchy(dimName: string, dimension:any){
        console.log("Render Hierarchy");
        let hierarchy : Hierarchy = await Fetcher.FetchHierarchy(dimension.id);
        let rootNode: HierarchyNode = await Fetcher.FetchNode(hierarchy.RootNodeId);
        this.setState({node: this.RenderNode(dimName, rootNode, 0)});
        console.log(hierarchy);       
    }

    RenderNode(dimName: string, node: HierarchyNode, level: number){
        let nodeLevelClassName : string = "nodeLevel-"+level;
        let result = 
            <div key={"Node:" + node.Tag.Id + ", level: " + level}>
                <button
                    className={nodeLevelClassName} 
                    onClick={() => this.props.onDimensionChanged(dimName, {type:"hierarchyNode", id:node.Id, name:node.Tag.Name})}>
                        {node.Tag.Name}
                </button> 
                { node.Children.map(n => this.RenderNode(dimName, n, level + 1)) }
            </div>
        /*<ul>
            <li className="white"><button>{node.Tag.Name}</button></li>
            { node.Children.map(n => this.RenderNode(n)) }
        </ul>*/
        return result;
    }

    ClearHierarchy(dimName: string){
        console.log("Clear Hierarchy")
        this.setState({node: null});
    }
}