import React from 'react';
import Fetcher from '../Middle/ThreeBrowser/Fetcher';
import Hierarchy from '../Middle/ThreeBrowser/Hierarchy';
import HierarchyNode from '../Middle/ThreeBrowser/HierarchyNode';
import '../../css/HierarchyBrowser.css';

export default class HierarchyBrowser extends React.Component<{}>{
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
        this.RenderHierarchy("X", {id:2});
    }

    async RenderHierarchy(dimName: string, dimension:any){
        console.log("Render Hierarchy");
        let hierarchy : Hierarchy = await Fetcher.FetchHierarchy(dimension.id);
        let rootNode: HierarchyNode = await Fetcher.FetchNode(hierarchy.RootNodeId);
        this.setState({node: this.RenderNode(rootNode, 0)});
        console.log(hierarchy);
            
    }

    RenderNode(node: HierarchyNode, level: number){
        let nodeLevelClassName : string = "nodeLevel-"+level;
        let result = 
            <div>
                <button className={nodeLevelClassName}>{node.Tag.Name}</button> 
                { node.Children.map(n => this.RenderNode(n, level + 1)) }
            </div>
        /*<ul>
            <li className="white"><button>{node.Tag.Name}</button></li>
            { node.Children.map(n => this.RenderNode(n)) }
        </ul>*/
        return result;
    }
}